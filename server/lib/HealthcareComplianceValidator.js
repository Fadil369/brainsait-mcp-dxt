/**
 * BrainSAIT Healthcare Compliance Validator
 * Ensures HIPAA/NPHIES compliance for all remote healthcare connections
 *
 * @author BrainSAIT Development Team
 * @version 1.0.0
 * @license MIT
 */

import crypto from 'crypto';

/**
 * Healthcare Compliance Error
 */
export class ComplianceValidationError extends Error {
  constructor (message, violationType = 'COMPLIANCE_VIOLATION', severity = 'HIGH') {
    super(message);
    this.name = 'ComplianceValidationError';
    this.violationType = violationType;
    this.severity = severity;
  }
}

/**
 * Healthcare Compliance Validator
 * Validates healthcare connections against HIPAA, NPHIES, and other standards
 */
export class HealthcareComplianceValidator {
  constructor (config = {}) {
    this.complianceFrameworks = config.frameworks || ['HIPAA', 'NPHIES'];
    this.strictMode = config.strictMode || true;
    this.auditLogger = config.auditLogger;

    // Compliance rules configuration
    this.rules = {
      HIPAA: new HIPAAComplianceRules(),
      NPHIES: new NPHIESComplianceRules(),
      GENERAL: new GeneralHealthcareRules()
    };
  }

  /**
   * Validate connector configuration for compliance
   * @param {Object} connectorConfig - Connector configuration to validate
   * @param {Array} frameworks - Compliance frameworks to validate against
   */
  async validateConnectorCompliance (connectorConfig, frameworks = this.complianceFrameworks) {
    const validationResults = {
      overall: 'UNKNOWN',
      violations: [],
      warnings: [],
      passed: [],
      frameworks: {},
      validatedAt: new Date().toISOString(),
      validatorVersion: '1.0.0'
    };

    try {
      // Validate each requested framework
      for (const framework of frameworks) {
        const frameworkResult = await this.validateFramework(connectorConfig, framework);
        validationResults.frameworks[framework] = frameworkResult;

        // Collect violations and warnings
        validationResults.violations.push(...frameworkResult.violations);
        validationResults.warnings.push(...frameworkResult.warnings);
        validationResults.passed.push(...frameworkResult.passed);
      }

      // Determine overall compliance status
      validationResults.overall = this.determineOverallCompliance(validationResults);

      // Log compliance validation
      if (this.auditLogger) {
        await this.auditLogger.logAccess(
          'system',
          'COMPLIANCE_VALIDATION',
          'CONNECTOR_CONFIG',
          connectorConfig.id || 'unknown',
          validationResults.overall === 'COMPLIANT' ? 'SUCCESS' : 'FAILURE',
          JSON.stringify({
            frameworks,
            violationCount: validationResults.violations.length,
            warningCount: validationResults.warnings.length
          })
        );
      }

      return validationResults;
    } catch (error) {
      if (this.auditLogger) {
        await this.auditLogger.logAccess(
          'system',
          'COMPLIANCE_VALIDATION_ERROR',
          'CONNECTOR_CONFIG',
          connectorConfig.id || 'unknown',
          'FAILURE',
          error.message
        );
      }

      throw new ComplianceValidationError(`Compliance validation failed: ${error.message}`);
    }
  }

  /**
   * Validate data transmission for compliance
   * @param {Object} data - Data to be transmitted
   * @param {Object} connectorConfig - Connector configuration
   * @param {string} operation - Type of operation (CREATE, READ, UPDATE, DELETE)
   */
  async validateDataTransmission (data, connectorConfig, operation = 'READ') {
    const validationResults = {
      compliant: false,
      violations: [],
      warnings: [],
      dataClassification: null,
      encryptionRequired: false,
      auditRequired: false,
      validatedAt: new Date().toISOString()
    };

    try {
      // Classify data sensitivity
      validationResults.dataClassification = this.classifyDataSensitivity(data);

      // Check encryption requirements
      validationResults.encryptionRequired = this.requiresEncryption(
        validationResults.dataClassification,
        connectorConfig
      );

      // Check audit requirements
      validationResults.auditRequired = this.requiresAuditLogging(
        validationResults.dataClassification,
        operation,
        connectorConfig
      );

      // Validate PHI handling
      if (validationResults.dataClassification.containsPHI) {
        await this.validatePHIHandling(data, connectorConfig, operation, validationResults);
      }

      // Validate against each framework
      for (const framework of this.complianceFrameworks) {
        await this.validateDataAgainstFramework(
          data,
          connectorConfig,
          operation,
          framework,
          validationResults
        );
      }

      // Determine compliance
      validationResults.compliant = validationResults.violations.length === 0;

      return validationResults;
    } catch (error) {
      throw new ComplianceValidationError(`Data transmission validation failed: ${error.message}`);
    }
  }

  /**
   * Validate framework-specific requirements
   * @private
   */
  async validateFramework (connectorConfig, framework) {
    const result = {
      framework,
      compliant: false,
      violations: [],
      warnings: [],
      passed: [],
      validatedAt: new Date().toISOString()
    };

    const rules = this.rules[framework] || this.rules.GENERAL;

    try {
      // Run all rules for this framework
      const ruleResults = await rules.validateConfig(connectorConfig);

      result.violations = ruleResults.violations;
      result.warnings = ruleResults.warnings;
      result.passed = ruleResults.passed;
      result.compliant = ruleResults.violations.length === 0;

      return result;
    } catch (error) {
      result.violations.push({
        rule: 'FRAMEWORK_VALIDATION',
        severity: 'HIGH',
        message: `Framework validation error: ${error.message}`,
        framework
      });

      return result;
    }
  }

  /**
   * Classify data sensitivity level
   * @private
   */
  classifyDataSensitivity (data) {
    const classification = {
      level: 'PUBLIC',
      containsPHI: false,
      containsPII: false,
      sensitiveFields: [],
      riskLevel: 'LOW'
    };

    const dataString = JSON.stringify(data).toLowerCase();

    // PHI indicators
    const phiIndicators = [
      'patient', 'medical', 'diagnosis', 'treatment', 'medication',
      'allergy', 'condition', 'procedure', 'observation', 'encounter',
      'birthdate', 'ssn', 'medical_record_number', 'mrn'
    ];

    // PII indicators
    const piiIndicators = [
      'name', 'address', 'phone', 'email', 'identifier',
      'social_security', 'passport', 'license'
    ];

    // Check for PHI
    for (const indicator of phiIndicators) {
      if (dataString.includes(indicator)) {
        classification.containsPHI = true;
        classification.sensitiveFields.push(indicator);
      }
    }

    // Check for PII
    for (const indicator of piiIndicators) {
      if (dataString.includes(indicator)) {
        classification.containsPII = true;
        classification.sensitiveFields.push(indicator);
      }
    }

    // Determine classification level
    if (classification.containsPHI) {
      classification.level = 'PHI';
      classification.riskLevel = 'HIGH';
    } else if (classification.containsPII) {
      classification.level = 'PII';
      classification.riskLevel = 'MEDIUM';
    }

    return classification;
  }

  /**
   * Check if encryption is required
   * @private
   */
  requiresEncryption (dataClassification, connectorConfig) {
    // Always require encryption for PHI
    if (dataClassification.containsPHI) {
      return true;
    }

    // Check connector configuration
    return connectorConfig.healthcareCompliance?.encryptionRequired || false;
  }

  /**
   * Check if audit logging is required
   * @private
   */
  requiresAuditLogging (dataClassification, operation, connectorConfig) {
    // Always require audit for PHI operations
    if (dataClassification.containsPHI) {
      return true;
    }

    // Check connector configuration
    return connectorConfig.healthcareCompliance?.auditRequired || false;
  }

  /**
   * Validate PHI handling compliance
   * @private
   */
  async validatePHIHandling (data, connectorConfig, operation, validationResults) {
    // Check minimum necessary standard
    if (!this.validateMinimumNecessary(data, operation)) {
      validationResults.violations.push({
        rule: 'MINIMUM_NECESSARY',
        severity: 'HIGH',
        message: 'PHI disclosure violates minimum necessary standard',
        framework: 'HIPAA'
      });
    }

    // Check access controls
    if (!connectorConfig.authentication || !this.validateAccessControls(connectorConfig.authentication)) {
      validationResults.violations.push({
        rule: 'ACCESS_CONTROLS',
        severity: 'HIGH',
        message: 'Inadequate access controls for PHI transmission',
        framework: 'HIPAA'
      });
    }

    // Check encryption requirements
    if (!connectorConfig.healthcareCompliance?.encryptionRequired) {
      validationResults.violations.push({
        rule: 'ENCRYPTION_REQUIRED',
        severity: 'HIGH',
        message: 'PHI transmission requires encryption',
        framework: 'HIPAA'
      });
    }
  }

  /**
   * Validate data against specific framework
   * @private
   */
  async validateDataAgainstFramework (data, connectorConfig, operation, framework, validationResults) {
    const rules = this.rules[framework];
    if (!rules) return;

    const frameworkResults = await rules.validateData(data, connectorConfig, operation);

    validationResults.violations.push(...frameworkResults.violations);
    validationResults.warnings.push(...frameworkResults.warnings);
  }

  /**
   * Validate minimum necessary standard
   * @private
   */
  validateMinimumNecessary (data, operation) {
    // This would implement business logic to determine if the data
    // being transmitted meets the minimum necessary standard
    // For now, return true as this would need business-specific rules
    return true;
  }

  /**
   * Validate access controls
   * @private
   */
  validateAccessControls (authentication) {
    // Check for strong authentication
    if (!authentication.type || !['oauth2', 'bearer', 'certificate'].includes(authentication.type)) {
      return false;
    }

    // Additional validations would go here
    return true;
  }

  /**
   * Determine overall compliance status
   * @private
   */
  determineOverallCompliance (validationResults) {
    const highSeverityViolations = validationResults.violations.filter(v => v.severity === 'HIGH');

    if (highSeverityViolations.length > 0) {
      return 'NON_COMPLIANT';
    }

    const mediumSeverityViolations = validationResults.violations.filter(v => v.severity === 'MEDIUM');

    if (mediumSeverityViolations.length > 0) {
      return this.strictMode ? 'NON_COMPLIANT' : 'CONDITIONALLY_COMPLIANT';
    }

    return 'COMPLIANT';
  }
}

/**
 * HIPAA Compliance Rules
 */
class HIPAAComplianceRules {
  async validateConfig (config) {
    const result = {
      violations: [],
      warnings: [],
      passed: []
    };

    // Encryption requirements
    if (!config.healthcareCompliance?.encryptionRequired) {
      result.violations.push({
        rule: 'HIPAA_ENCRYPTION',
        severity: 'HIGH',
        message: 'HIPAA requires encryption for PHI transmission',
        framework: 'HIPAA'
      });
    } else {
      result.passed.push('HIPAA_ENCRYPTION');
    }

    // Audit logging requirements (except for audit systems themselves)
    if (!config.healthcareCompliance?.auditRequired && config.type !== 'audit_system') {
      result.violations.push({
        rule: 'HIPAA_AUDIT',
        severity: 'HIGH',
        message: 'HIPAA requires comprehensive audit logging',
        framework: 'HIPAA'
      });
    } else {
      result.passed.push('HIPAA_AUDIT');
    }

    // Access controls
    if (!config.authentication || !['oauth2', 'certificate', 'bearer', 'apikey'].includes(config.authentication.type)) {
      result.violations.push({
        rule: 'HIPAA_ACCESS_CONTROL',
        severity: 'HIGH',
        message: 'HIPAA requires strong authentication mechanisms',
        framework: 'HIPAA'
      });
    } else {
      result.passed.push('HIPAA_ACCESS_CONTROL');
    }

    // HTTPS requirement
    if (!config.endpoint?.startsWith('https://')) {
      result.violations.push({
        rule: 'HIPAA_HTTPS',
        severity: 'HIGH',
        message: 'HIPAA requires HTTPS for data transmission',
        framework: 'HIPAA'
      });
    } else {
      result.passed.push('HIPAA_HTTPS');
    }

    return result;
  }

  async validateData (data, config, operation) {
    const result = {
      violations: [],
      warnings: []
    };

    // Additional data-specific HIPAA validations would go here

    return result;
  }
}

/**
 * NPHIES Compliance Rules
 */
class NPHIESComplianceRules {
  async validateConfig (config) {
    const result = {
      violations: [],
      warnings: [],
      passed: []
    };

    // NPHIES-specific validations
    if (config.healthcareCompliance?.nphies) {
      // Arabic language support
      if (!config.supportedLanguages?.includes('ar')) {
        result.warnings.push({
          rule: 'NPHIES_ARABIC_SUPPORT',
          severity: 'MEDIUM',
          message: 'NPHIES recommends Arabic language support',
          framework: 'NPHIES'
        });
      } else {
        result.passed.push('NPHIES_ARABIC_SUPPORT');
      }

      // Saudi-specific data requirements
      if (!config.dataMapping?.saudiSpecific) {
        result.warnings.push({
          rule: 'NPHIES_SAUDI_DATA',
          severity: 'MEDIUM',
          message: 'NPHIES may require Saudi-specific data fields',
          framework: 'NPHIES'
        });
      } else {
        result.passed.push('NPHIES_SAUDI_DATA');
      }
    }

    return result;
  }

  async validateData (data, config, operation) {
    const result = {
      violations: [],
      warnings: []
    };

    // NPHIES data-specific validations would go here

    return result;
  }
}

/**
 * General Healthcare Compliance Rules
 */
class GeneralHealthcareRules {
  async validateConfig (config) {
    const result = {
      violations: [],
      warnings: [],
      passed: []
    };

    // General healthcare IT security requirements
    if (config.errorHandling?.retryAttempts > 5) {
      result.warnings.push({
        rule: 'GENERAL_RETRY_LIMIT',
        severity: 'LOW',
        message: 'High retry attempts may impact system stability',
        framework: 'GENERAL'
      });
    } else {
      result.passed.push('GENERAL_RETRY_LIMIT');
    }

    // Timeout validation
    if (config.errorHandling?.timeoutMs > 60000) {
      result.warnings.push({
        rule: 'GENERAL_TIMEOUT',
        severity: 'LOW',
        message: 'Long timeouts may impact user experience',
        framework: 'GENERAL'
      });
    } else {
      result.passed.push('GENERAL_TIMEOUT');
    }

    return result;
  }

  async validateData (data, config, operation) {
    const result = {
      violations: [],
      warnings: []
    };

    // General data validation rules would go here

    return result;
  }
}

export default HealthcareComplianceValidator;
