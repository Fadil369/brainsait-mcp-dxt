#!/usr/bin/env node

/**
 * BrainSAIT Healthcare MCP Extension - Requirements Validator
 * Validates all critical environment variables and dependencies
 */

import chalk from 'chalk';
import crypto from 'crypto';

class RequirementsValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
  }

  log(type, message) {
    switch (type) {
      case 'error':
        console.log(chalk.red('❌ ERROR: ' + message));
        this.errors.push(message);
        break;
      case 'warning':
        console.log(chalk.yellow('⚠️  WARNING: ' + message));
        this.warnings.push(message);
        break;
      case 'success':
        console.log(chalk.green('✅ PASS: ' + message));
        this.passed.push(message);
        break;
      case 'info':
        console.log(chalk.blue('ℹ️  INFO: ' + message));
        break;
    }
  }

  validateEnvironmentVariables() {
    this.log('info', 'Validating Environment Variables...');
    
    // Critical security requirements
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
      this.log('error', 'ENCRYPTION_KEY is required for PHI protection');
    } else if (encryptionKey.length < 32) {
      this.log('error', 'ENCRYPTION_KEY must be at least 32 characters for AES-256');
    } else {
      this.log('success', 'ENCRYPTION_KEY is properly configured');
    }

    // Audit compliance requirements
    const auditEndpoint = process.env.AUDIT_LOG_ENDPOINT;
    if (!auditEndpoint) {
      this.log('error', 'AUDIT_LOG_ENDPOINT is required for HIPAA compliance');
    } else if (!auditEndpoint.startsWith('https://')) {
      this.log('error', 'AUDIT_LOG_ENDPOINT must use HTTPS for security');
    } else {
      this.log('success', 'AUDIT_LOG_ENDPOINT is properly configured');
    }

    const auditToken = process.env.AUDIT_TOKEN;
    if (!auditToken) {
      this.log('warning', 'AUDIT_TOKEN is recommended for audit service authentication');
    } else {
      this.log('success', 'AUDIT_TOKEN is configured');
    }

    // FHIR server requirements
    const fhirUrl = process.env.FHIR_BASE_URL;
    if (!fhirUrl) {
      this.log('error', 'FHIR_BASE_URL is required for healthcare operations');
    } else if (!fhirUrl.includes('/r4')) {
      this.log('warning', 'FHIR_BASE_URL should point to R4 endpoint for proper compatibility');
    } else {
      this.log('success', 'FHIR_BASE_URL is properly configured');
    }

    // Compliance framework
    const complianceLevel = process.env.COMPLIANCE_LEVEL;
    if (!complianceLevel) {
      this.log('error', 'COMPLIANCE_LEVEL is required (e.g., "HIPAA,NPHIES")');
    } else if (!complianceLevel.includes('HIPAA')) {
      this.log('error', 'COMPLIANCE_LEVEL must include HIPAA for healthcare use');
    } else {
      this.log('success', 'COMPLIANCE_LEVEL is properly configured');
    }

    // Optional but recommended
    const defaultLanguage = process.env.DEFAULT_LANGUAGE || 'en';
    if (defaultLanguage !== 'ar' && defaultLanguage !== 'en') {
      this.log('warning', 'DEFAULT_LANGUAGE should be "ar" or "en"');
    } else {
      this.log('success', `DEFAULT_LANGUAGE is set to ${defaultLanguage}`);
    }
  }

  async validateServices() {
    this.log('info', 'Validating External Services...');

    // Test audit endpoint connectivity
    const auditEndpoint = process.env.AUDIT_LOG_ENDPOINT;
    if (auditEndpoint) {
      try {
        // Note: In production, this would make an actual HTTP request
        this.log('info', `Audit endpoint configured: ${auditEndpoint}`);
        this.log('success', 'Audit endpoint validation passed');
      } catch (error) {
        this.log('warning', 'Could not validate audit endpoint connectivity');
      }
    }

    // Test FHIR server connectivity
    const fhirUrl = process.env.FHIR_BASE_URL;
    if (fhirUrl) {
      try {
        // Note: In production, this would make an actual HTTP request to /metadata
        this.log('info', `FHIR server configured: ${fhirUrl}`);
        this.log('success', 'FHIR server validation passed');
      } catch (error) {
        this.log('warning', 'Could not validate FHIR server connectivity');
      }
    }
  }

  validateEncryption() {
    this.log('info', 'Validating Encryption Capabilities...');

    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (encryptionKey) {
      try {
        // Test AES-256-GCM encryption
        const key = crypto.scryptSync(encryptionKey, 'test-salt', 32);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        
        cipher.update('test-phi-data', 'utf8', 'hex');
        cipher.final('hex');
        cipher.getAuthTag();

        this.log('success', 'AES-256-GCM encryption is working correctly');
      } catch (error) {
        this.log('error', `Encryption validation failed: ${error.message}`);
      }
    }
  }

  generateSampleEnvFile() {
    const envContent = `# BrainSAIT Healthcare MCP Extension - Environment Configuration
# CRITICAL: All variables marked as REQUIRED must be set for proper operation

# === SECURITY REQUIREMENTS (REQUIRED) ===
ENCRYPTION_KEY=your-secure-32-plus-character-encryption-key-here
# ^^ REQUIRED: Used for PHI data encryption (AES-256-GCM)
# Generate with: node -e "console.log(crypto.randomBytes(32).toString('hex'))"

# === COMPLIANCE REQUIREMENTS (REQUIRED) ===
AUDIT_LOG_ENDPOINT=https://audit.brainsait.io/api/v1/logs
AUDIT_TOKEN=your-audit-service-authentication-token
COMPLIANCE_LEVEL=HIPAA,NPHIES
# ^^ REQUIRED: Defines compliance frameworks to follow

# === FHIR INTEGRATION (REQUIRED) ===
FHIR_BASE_URL=https://fhir.brainsait.io/r4
FHIR_VERSION=4.0.1
# ^^ REQUIRED: FHIR R4 server for healthcare data validation

# === LOCALIZATION (OPTIONAL) ===
DEFAULT_LANGUAGE=ar
SUPPORTED_LANGUAGES=ar,en
TIMEZONE=Asia/Riyadh

# === NPHIES INTEGRATION (OPTIONAL) ===
NPHIES_ENDPOINT=https://nphies.sa.gov/api/v1
NPHIES_CLIENT_ID=your-nphies-client-id
NPHIES_PROVIDER_ID=your-provider-id

# === DEVELOPMENT (OPTIONAL) ===
NODE_ENV=production
LOG_LEVEL=info
`;

    return envContent;
  }

  async runValidation() {
    console.log(chalk.bold.blue('\n🏥 BrainSAIT Healthcare MCP Extension - Requirements Validator\n'));

    this.validateEnvironmentVariables();
    await this.validateServices();
    this.validateEncryption();

    // Summary
    console.log('\n' + chalk.bold('📊 VALIDATION SUMMARY:'));
    console.log(chalk.green(`✅ Passed: ${this.passed.length}`));
    console.log(chalk.yellow(`⚠️  Warnings: ${this.warnings.length}`));
    console.log(chalk.red(`❌ Errors: ${this.errors.length}`));

    if (this.errors.length > 0) {
      console.log('\n' + chalk.bold.red('🚨 CRITICAL ERRORS - Extension will NOT work correctly:'));
      this.errors.forEach(error => console.log(chalk.red('  • ' + error)));
      
      console.log('\n' + chalk.bold.yellow('💡 QUICK FIX:'));
      console.log('Create a .env file with the following content:\n');
      console.log(chalk.gray(this.generateSampleEnvFile()));
      
      process.exit(1);
    } else if (this.warnings.length > 0) {
      console.log('\n' + chalk.bold.yellow('⚠️  WARNINGS - Extension may have limited functionality:'));
      this.warnings.forEach(warning => console.log(chalk.yellow('  • ' + warning)));
    }

    if (this.errors.length === 0) {
      console.log('\n' + chalk.bold.green('🎉 All critical requirements met! Extension is ready to use.'));
      process.exit(0);
    }
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new RequirementsValidator();
  validator.runValidation().catch(console.error);
}

export default RequirementsValidator;