/**
 * BrainSAIT Healthcare Connector Configuration Manager
 * Manages connector configurations with validation and security
 *
 * @author BrainSAIT Development Team
 * @version 1.0.0
 * @license MIT
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

/**
 * Connector Configuration Manager
 * Handles secure storage and retrieval of connector configurations
 */
export class ConnectorConfigManager {
  constructor (config = {}) {
    this.configDir = config.configDir || process.env.CONNECTOR_CONFIG_DIR || './connector-configs';
    this.encryptionKey = config.encryptionKey || process.env.ENCRYPTION_KEY;
    this.complianceLevel = config.complianceLevel || 'HIPAA,NPHIES';

    if (!this.encryptionKey) {
      throw new Error('Encryption key required for secure configuration storage');
    }

    this.encryption = new ConfigEncryption(this.encryptionKey);

    // Ensure config directory exists
    this.initializeConfigDirectory();
  }

  /**
   * Save connector configuration securely
   * @param {string} connectorId - Connector identifier
   * @param {Object} config - Connector configuration
   */
  async saveConfig (connectorId, config) {
    try {
      // Validate configuration
      this.validateConfiguration(config);

      // Sanitize sensitive data
      const sanitizedConfig = this.sanitizeConfig(config);

      // Encrypt configuration
      const encryptedConfig = this.encryption.encrypt(sanitizedConfig);

      // Save to file
      const configPath = path.join(this.configDir, `${connectorId}.json`);
      await fs.writeFile(configPath, JSON.stringify(encryptedConfig, null, 2));

      return {
        success: true,
        connectorId,
        configPath,
        savedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to save connector configuration: ${error.message}`);
    }
  }

  /**
   * Load connector configuration securely
   * @param {string} connectorId - Connector identifier
   */
  async loadConfig (connectorId) {
    try {
      const configPath = path.join(this.configDir, `${connectorId}.json`);

      // Check if config exists
      try {
        await fs.access(configPath);
      } catch {
        throw new Error(`Configuration not found for connector: ${connectorId}`);
      }

      // Read encrypted configuration
      const encryptedData = await fs.readFile(configPath, 'utf8');
      const encryptedConfig = JSON.parse(encryptedData);

      // Decrypt configuration
      const config = this.encryption.decrypt(encryptedConfig);

      return {
        success: true,
        connectorId,
        config,
        loadedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to load connector configuration: ${error.message}`);
    }
  }

  /**
   * List all stored connector configurations
   */
  async listConfigs () {
    try {
      const files = await fs.readdir(this.configDir);
      const configFiles = files.filter(file => file.endsWith('.json'));

      const configs = [];

      for (const file of configFiles) {
        const connectorId = path.basename(file, '.json');
        try {
          const { config } = await this.loadConfig(connectorId);
          configs.push({
            connectorId,
            type: config.type,
            name: config.name,
            endpoint: config.endpoint,
            healthcareCompliance: config.healthcareCompliance,
            lastModified: (await fs.stat(path.join(this.configDir, file))).mtime
          });
        } catch (error) {
          configs.push({
            connectorId,
            error: error.message,
            status: 'invalid'
          });
        }
      }

      return {
        success: true,
        configs,
        totalCount: configs.length,
        retrievedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to list connector configurations: ${error.message}`);
    }
  }

  /**
   * Delete connector configuration
   * @param {string} connectorId - Connector identifier
   */
  async deleteConfig (connectorId) {
    try {
      const configPath = path.join(this.configDir, `${connectorId}.json`);

      // Check if config exists
      try {
        await fs.access(configPath);
      } catch {
        throw new Error(`Configuration not found for connector: ${connectorId}`);
      }

      // Delete configuration file
      await fs.unlink(configPath);

      return {
        success: true,
        connectorId,
        deletedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to delete connector configuration: ${error.message}`);
    }
  }

  /**
   * Update connector configuration
   * @param {string} connectorId - Connector identifier
   * @param {Object} updates - Configuration updates
   */
  async updateConfig (connectorId, updates) {
    try {
      // Load existing configuration
      const { config: existingConfig } = await this.loadConfig(connectorId);

      // Merge updates
      const updatedConfig = {
        ...existingConfig,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Save updated configuration
      return await this.saveConfig(connectorId, updatedConfig);
    } catch (error) {
      throw new Error(`Failed to update connector configuration: ${error.message}`);
    }
  }

  /**
   * Backup all configurations
   */
  async backupConfigs () {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(this.configDir, 'backups', timestamp);

      // Create backup directory
      await fs.mkdir(backupDir, { recursive: true });

      // Get all config files
      const files = await fs.readdir(this.configDir);
      const configFiles = files.filter(file => file.endsWith('.json'));

      // Copy each config file to backup
      for (const file of configFiles) {
        const sourcePath = path.join(this.configDir, file);
        const backupPath = path.join(backupDir, file);
        await fs.copyFile(sourcePath, backupPath);
      }

      return {
        success: true,
        backupDir,
        configCount: configFiles.length,
        backedUpAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to backup configurations: ${error.message}`);
    }
  }

  /**
   * Validate connector configuration
   * @private
   */
  validateConfiguration (config) {
    const required = ['type', 'name', 'endpoint', 'authentication', 'healthcareCompliance'];

    for (const field of required) {
      if (!config[field]) {
        throw new Error(`Missing required configuration field: ${field}`);
      }
    }

    // Validate endpoint URL
    try {
      new URL(config.endpoint);
    } catch {
      throw new Error('Invalid endpoint URL format');
    }

    // Validate healthcare compliance
    const compliance = config.healthcareCompliance;
    if (!compliance.hipaa && !compliance.nphies) {
      throw new Error('Healthcare compliance configuration must include HIPAA or NPHIES');
    }

    // Validate authentication
    const auth = config.authentication;
    if (!auth.type || !['bearer', 'apikey', 'oauth2', 'basic'].includes(auth.type)) {
      throw new Error('Invalid authentication type');
    }

    return true;
  }

  /**
   * Sanitize configuration for storage
   * @private
   */
  sanitizeConfig (config) {
    const sanitized = JSON.parse(JSON.stringify(config));

    // Add metadata
    sanitized.createdAt = sanitized.createdAt || new Date().toISOString();
    sanitized.updatedAt = new Date().toISOString();
    sanitized.complianceLevel = this.complianceLevel;
    sanitized.version = '1.0.0';

    // Validate sensitive fields are properly marked
    if (sanitized.authentication) {
      sanitized.authentication.encrypted = true;
    }

    return sanitized;
  }

  /**
   * Initialize configuration directory
   * @private
   */
  async initializeConfigDirectory () {
    try {
      await fs.mkdir(this.configDir, { recursive: true });
      await fs.mkdir(path.join(this.configDir, 'backups'), { recursive: true });
    } catch (error) {
      throw new Error(`Failed to initialize configuration directory: ${error.message}`);
    }
  }
}

/**
 * Configuration Encryption
 * Handles encryption/decryption of connector configurations
 */
class ConfigEncryption {
  constructor (encryptionKey) {
    this.algorithm = 'aes-256-gcm';
    this.key = crypto.scryptSync(encryptionKey, 'brainsait-config-salt', 32);
  }

  encrypt (config) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    cipher.setAAD(Buffer.from('brainsait-connector-config', 'utf8'));

    let encrypted = cipher.update(JSON.stringify(config), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm: this.algorithm,
      encryptedAt: new Date().toISOString()
    };
  }

  decrypt (encryptedConfig) {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(encryptedConfig.iv, 'hex')
    );
    decipher.setAAD(Buffer.from('brainsait-connector-config', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedConfig.authTag, 'hex'));

    let decrypted = decipher.update(encryptedConfig.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }
}

/**
 * Configuration Template Generator
 * Generates configuration templates for different healthcare systems
 */
export class ConfigTemplateGenerator {
  /**
   * Generate configuration template for a healthcare system type
   * @param {string} systemType - Type of healthcare system
   * @param {Object} baseConfig - Base configuration parameters
   */
  static generateTemplate (systemType, baseConfig = {}) {
    const templates = {
      ehr_system: {
        type: 'ehr_system',
        name: `${baseConfig.organizationName || 'Healthcare'} EHR System`,
        description: 'Electronic Health Record system integration',
        endpoint: baseConfig.endpoint || 'https://ehr.example.com/api',

        authentication: {
          type: 'oauth2',
          clientId: baseConfig.clientId || '${EHR_CLIENT_ID}',
          clientSecret: baseConfig.clientSecret || '${EHR_CLIENT_SECRET}',
          tokenUrl: baseConfig.tokenUrl || 'https://ehr.example.com/oauth/token',
          scope: 'patient.read patient.write encounter.read encounter.write'
        },

        healthcareCompliance: {
          hipaa: true,
          nphies: baseConfig.nphiesRequired || false,
          auditRequired: true,
          encryptionRequired: true,
          dataRetentionDays: baseConfig.dataRetentionDays || 2555 // 7 years
        },

        capabilities: [
          'patient_management',
          'encounter_management',
          'clinical_documentation',
          'medication_management'
        ],

        errorHandling: {
          retryAttempts: 3,
          retryDelay: 2000,
          timeoutMs: 30000,
          circuitBreakerThreshold: 5
        },

        monitoring: {
          healthCheckInterval: 60000,
          performanceThresholds: {
            responseTime: 5000,
            errorRate: 0.05
          }
        }
      },

      fhir_server: {
        type: 'fhir_server',
        name: `${baseConfig.organizationName || 'Healthcare'} FHIR Server`,
        description: 'FHIR R4 compliant server integration',
        endpoint: baseConfig.endpoint || 'https://fhir.example.com/R4',

        authentication: {
          type: 'bearer',
          token: baseConfig.token || '${FHIR_ACCESS_TOKEN}',
          refreshToken: baseConfig.refreshToken || '${FHIR_REFRESH_TOKEN}',
          tokenUrl: baseConfig.tokenUrl || 'https://fhir.example.com/oauth/token'
        },

        healthcareCompliance: {
          hipaa: true,
          nphies: baseConfig.nphiesRequired || false,
          fhirR4: true,
          auditRequired: true,
          encryptionRequired: true,
          dataRetentionDays: baseConfig.dataRetentionDays || 2555
        },

        capabilities: [
          'resource_crud',
          'search_operations',
          'batch_operations',
          'terminology_services'
        ],

        errorHandling: {
          retryAttempts: 3,
          retryDelay: 1500,
          timeoutMs: 25000,
          circuitBreakerThreshold: 3
        },

        monitoring: {
          healthCheckInterval: 60000,
          performanceThresholds: {
            responseTime: 3000,
            errorRate: 0.03
          }
        }
      },

      audit_system: {
        type: 'audit_system',
        name: `${baseConfig.organizationName || 'Healthcare'} Audit System`,
        description: 'Healthcare audit and compliance logging',
        endpoint: baseConfig.endpoint || 'https://audit.example.com/api',

        authentication: {
          type: 'apikey',
          key: baseConfig.apiKey || '${AUDIT_API_KEY}',
          header: 'X-API-Key'
        },

        healthcareCompliance: {
          hipaa: true,
          nphies: baseConfig.nphiesRequired || false,
          auditRequired: false, // This IS the audit system
          encryptionRequired: true,
          dataRetentionDays: baseConfig.dataRetentionDays || 2555
        },

        capabilities: [
          'audit_log_creation',
          'compliance_reporting',
          'access_monitoring',
          'breach_detection'
        ],

        errorHandling: {
          retryAttempts: 5,
          retryDelay: 1000,
          timeoutMs: 15000,
          circuitBreakerThreshold: 10
        },

        monitoring: {
          healthCheckInterval: 30000,
          performanceThresholds: {
            responseTime: 2000,
            errorRate: 0.01
          }
        }
      }
    };

    const template = templates[systemType];
    if (!template) {
      throw new Error(`Unknown system type: ${systemType}`);
    }

    return {
      ...template,
      generatedAt: new Date().toISOString(),
      templateVersion: '1.0.0'
    };
  }

  /**
   * Get all available template types
   */
  static getAvailableTypes () {
    return [
      { type: 'ehr_system', name: 'Electronic Health Record System' },
      { type: 'fhir_server', name: 'FHIR R4 Server' },
      { type: 'audit_system', name: 'Audit and Compliance System' }
    ];
  }
}

export default ConnectorConfigManager;
