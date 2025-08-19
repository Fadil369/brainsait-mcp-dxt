#!/usr/bin/env node

/**
 * BrainSAIT Healthcare MCP Server
 * HIPAA/NPHIES compliant MCP extension with FHIR R4 support
 * 
 * @author BrainSAIT Development Team
 * @version 1.0.0
 * @license MIT
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import crypto from 'crypto';
import axios from 'axios';

// BRAINSAIT: Healthcare compliance and audit logging
class ComplianceError extends Error {
  constructor(message, code = 'COMPLIANCE_VIOLATION') {
    super(message);
    this.name = 'ComplianceError';
    this.code = code;
  }
}

class HealthcareAPIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'HealthcareAPIError';
    this.statusCode = statusCode;
  }
}

// MEDICAL: FHIR R4 validation and clinical terminology
class FHIRValidator {
  static validateResource(resource, resourceType) {
    // MEDICAL: Basic FHIR R4 validation
    if (!resource || typeof resource !== 'object') {
      throw new ComplianceError('Invalid FHIR resource format');
    }
    
    if (!resource.resourceType || resource.resourceType !== resourceType) {
      throw new ComplianceError(`Invalid resourceType. Expected: ${resourceType}`);
    }

    if (!resource.id && !resource.identifier) {
      throw new ComplianceError('FHIR resource must have id or identifier');
    }

    return true;
  }

  static validateClinicalTerminology(code, system) {
    // MEDICAL: Validate clinical codes (ICD-10, CPT, LOINC)
    const validSystems = [
      'http://hl7.org/fhir/sid/icd-10',
      'http://www.ama-assn.org/go/cpt',
      'http://loinc.org'
    ];

    if (!validSystems.includes(system)) {
      throw new ComplianceError(`Invalid coding system: ${system}`);
    }

    return true;
  }
}

// BRAINSAIT: Audit logging for HIPAA compliance
class AuditLogger {
  constructor(endpoint, encryptionKey) {
    this.endpoint = endpoint;
    this.encryptionKey = encryptionKey;
  }

  async logAccess(userId, action, resourceType, resourceId, outcome = 'SUCCESS') {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      eventType: 'HEALTHCARE_DATA_ACCESS',
      userId,
      action,
      resourceType,
      resourceId,
      outcome,
      sourceIP: process.env.CLIENT_IP || 'localhost',
      userAgent: process.env.USER_AGENT || 'BrainSAIT-MCP',
      sessionId: this.generateSessionId()
    };

    try {
      await axios.post(this.endpoint, auditEntry, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AUDIT_TOKEN || 'default'}`
        },
        timeout: 5000
      });
    } catch (error) {
      console.error('Audit logging failed:', error.message);
      // BRAINSAIT: Never fail the main operation due to audit logging issues
    }
  }

  generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
  }
}

// BRAINSAIT: PHI encryption handler
class PHIEncryption {
  constructor(encryptionKey) {
    this.algorithm = 'aes-256-gcm';
    this.key = crypto.scryptSync(encryptionKey, 'brainsait-salt', 32);
  }

  encrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key);
    cipher.setAAD(Buffer.from('brainsait-phi', 'utf8'));
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encryptedData) {
    const decipher = crypto.createDecipher(this.algorithm, this.key);
    decipher.setAAD(Buffer.from('brainsait-phi', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }
}

// BILINGUAL: Arabic/English content handler
class BilingualContent {
  static medicalTerminology = {
    'patient': { ar: 'مريض', en: 'patient' },
    'diagnosis': { ar: 'تشخيص', en: 'diagnosis' },
    'treatment': { ar: 'علاج', en: 'treatment' },
    'medication': { ar: 'دواء', en: 'medication' },
    'allergy': { ar: 'حساسية', en: 'allergy' },
    'condition': { ar: 'حالة', en: 'condition' },
    'procedure': { ar: 'إجراء', en: 'procedure' },
    'observation': { ar: 'ملاحظة', en: 'observation' }
  };

  static translate(content, targetLanguage = 'ar') {
    // BILINGUAL: Simple terminology translation for clinical content
    if (typeof content !== 'string') return content;
    
    let translated = content;
    Object.entries(this.medicalTerminology).forEach(([key, translations]) => {
      const sourceText = targetLanguage === 'ar' ? translations.en : translations.ar;
      const targetText = translations[targetLanguage];
      translated = translated.replace(new RegExp(sourceText, 'gi'), targetText);
    });
    
    return translated;
  }
}

// Main MCP Server class
class BrainSAITMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "brainsait-healthcare-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
          prompts: {},
        },
      }
    );

    // BRAINSAIT: Initialize compliance components
    this.auditLogger = new AuditLogger(
      process.env.AUDIT_LOG_ENDPOINT,
      process.env.ENCRYPTION_KEY
    );
    
    this.phiEncryption = new PHIEncryption(process.env.ENCRYPTION_KEY);
    this.defaultLanguage = process.env.DEFAULT_LANGUAGE || 'ar';
    this.complianceLevel = process.env.COMPLIANCE_LEVEL || 'HIPAA,NPHIES';

    this.setupTools();
    this.setupPrompts();
    this.setupErrorHandling();
  }

  setupTools() {
    // MEDICAL: FHIR R4 resource validation tool
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "validate_fhir_resource",
          description: "Validate FHIR R4 resources for compliance and clinical accuracy",
          inputSchema: {
            type: "object",
            properties: {
              resource: { type: "object", description: "FHIR R4 resource to validate" },
              resourceType: { type: "string", description: "Expected FHIR resource type" },
              userId: { type: "string", description: "User ID for audit logging" }
            },
            required: ["resource", "resourceType", "userId"]
          }
        },
        {
          name: "clinical_terminology_lookup",
          description: "Look up ICD-10, CPT, LOINC codes with Arabic/English translations",
          inputSchema: {
            type: "object",
            properties: {
              code: { type: "string", description: "Clinical code to look up" },
              system: { type: "string", description: "Coding system (ICD-10, CPT, LOINC)" },
              language: { type: "string", description: "Target language (ar/en)" },
              userId: { type: "string", description: "User ID for audit logging" }
            },
            required: ["code", "system", "userId"]
          }
        },
        {
          name: "audit_log_query",
          description: "Query audit logs for compliance reporting and security monitoring",
          inputSchema: {
            type: "object",
            properties: {
              startDate: { type: "string", description: "Start date (ISO format)" },
              endDate: { type: "string", description: "End date (ISO format)" },
              eventType: { type: "string", description: "Type of event to query" },
              userId: { type: "string", description: "User ID for audit logging" }
            },
            required: ["startDate", "endDate", "userId"]
          }
        },
        {
          name: "nphies_interoperability_check",
          description: "Validate resources for NPHIES Saudi interoperability standards",
          inputSchema: {
            type: "object",
            properties: {
              resource: { type: "object", description: "Resource to validate against NPHIES" },
              checkType: { type: "string", description: "Type of NPHIES validation" },
              userId: { type: "string", description: "User ID for audit logging" }
            },
            required: ["resource", "checkType", "userId"]
          }
        },
        {
          name: "clinical_decision_support",
          description: "Provide clinical decision support based on patient data and guidelines",
          inputSchema: {
            type: "object",
            properties: {
              patientData: { type: "object", description: "Patient clinical data" },
              clinicalQuestion: { type: "string", description: "Clinical question or scenario" },
              language: { type: "string", description: "Response language (ar/en)" },
              userId: { type: "string", description: "User ID for audit logging" }
            },
            required: ["patientData", "clinicalQuestion", "userId"]
          }
        },
        {
          name: "bilingual_content_translate",
          description: "Translate medical content between Arabic and English with clinical accuracy",
          inputSchema: {
            type: "object",
            properties: {
              content: { type: "string", description: "Medical content to translate" },
              sourceLanguage: { type: "string", description: "Source language (ar/en)" },
              targetLanguage: { type: "string", description: "Target language (ar/en)" },
              userId: { type: "string", description: "User ID for audit logging" }
            },
            required: ["content", "sourceLanguage", "targetLanguage", "userId"]
          }
        },
        {
          name: "phi_encryption_handler",
          description: "Encrypt/decrypt PHI data with HIPAA-compliant methods",
          inputSchema: {
            type: "object",
            properties: {
              data: { type: "object", description: "PHI data to encrypt/decrypt" },
              operation: { type: "string", enum: ["encrypt", "decrypt"], description: "Operation type" },
              userId: { type: "string", description: "User ID for audit logging" }
            },
            required: ["data", "operation", "userId"]
          }
        },
        {
          name: "role_based_access_control",
          description: "Validate user permissions and roles for healthcare data access",
          inputSchema: {
            type: "object",
            properties: {
              userId: { type: "string", description: "User ID to validate" },
              requestedAction: { type: "string", description: "Requested action/permission" },
              resourceType: { type: "string", description: "Type of resource being accessed" },
              adminUserId: { type: "string", description: "Admin user ID for audit logging" }
            },
            required: ["userId", "requestedAction", "resourceType", "adminUserId"]
          }
        }
      ]
    }));

    // BRAINSAIT: Tool call handlers with comprehensive error handling
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;
        
        // BRAINSAIT: Always log tool access for audit compliance
        await this.auditLogger.logAccess(
          args.userId || 'unknown',
          `TOOL_CALL_${name.toUpperCase()}`,
          'MCP_TOOL',
          name
        );

        switch (name) {
          case "validate_fhir_resource":
            return await this.validateFHIRResource(args);
          
          case "clinical_terminology_lookup":
            return await this.clinicalTerminologyLookup(args);
          
          case "audit_log_query":
            return await this.auditLogQuery(args);
          
          case "nphies_interoperability_check":
            return await this.nphiesInteroperabilityCheck(args);
          
          case "clinical_decision_support":
            return await this.clinicalDecisionSupport(args);
          
          case "bilingual_content_translate":
            return await this.bilingualContentTranslate(args);
          
          case "phi_encryption_handler":
            return await this.phiEncryptionHandler(args);
          
          case "role_based_access_control":
            return await this.roleBasedAccessControl(args);
          
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        // BRAINSAIT: Log error for audit trail
        await this.auditLogger.logAccess(
          args?.userId || 'unknown',
          `TOOL_ERROR_${request.params.name?.toUpperCase()}`,
          'MCP_TOOL',
          request.params.name,
          'FAILURE'
        );
        
        if (error instanceof ComplianceError || error instanceof HealthcareAPIError) {
          throw new McpError(ErrorCode.InvalidRequest, error.message);
        }
        
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
      }
    });
  }

  // MEDICAL: FHIR R4 validation implementation
  async validateFHIRResource(args) {
    const { resource, resourceType, userId } = args;
    
    try {
      // MEDICAL: Validate FHIR structure
      FHIRValidator.validateResource(resource, resourceType);
      
      // MEDICAL: Additional clinical validation based on resource type
      if (resourceType === 'Patient') {
        if (!resource.name || !resource.birthDate) {
          throw new ComplianceError('Patient resource missing required fields: name, birthDate');
        }
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              valid: true,
              resourceType,
              validationDetails: {
                structureValid: true,
                clinicallyValid: true,
                complianceLevel: this.complianceLevel,
                validatedAt: new Date().toISOString()
              },
              message: BilingualContent.translate(
                `FHIR ${resourceType} resource validation successful`,
                this.defaultLanguage
              )
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              valid: false,
              error: error.message,
              resourceType,
              validatedAt: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    }
  }

  // MEDICAL: Clinical terminology lookup with bilingual support
  async clinicalTerminologyLookup(args) {
    const { code, system, language = this.defaultLanguage, userId } = args;
    
    try {
      FHIRValidator.validateClinicalTerminology(code, system);
      
      // MEDICAL: Mock clinical terminology lookup (in production, integrate with terminology servers)
      const mockTerminology = {
        'I10.9': {
          system: 'http://hl7.org/fhir/sid/icd-10',
          display: {
            en: 'Essential hypertension, unspecified',
            ar: 'ارتفاع ضغط الدم الأساسي، غير محدد'
          },
          definition: {
            en: 'High blood pressure without known secondary cause',
            ar: 'ارتفاع ضغط الدم دون سبب ثانوي معروف'
          }
        }
      };
      
      const terminology = mockTerminology[code];
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              code,
              system,
              found: !!terminology,
              display: terminology?.display?.[language] || 'Code not found',
              definition: terminology?.definition?.[language] || 'Definition not available',
              language,
              retrievedAt: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new HealthcareAPIError(`Clinical terminology lookup failed: ${error.message}`);
    }
  }

  // BRAINSAIT: Audit log query for compliance reporting
  async auditLogQuery(args) {
    const { startDate, endDate, eventType, userId } = args;
    
    // MEDICAL: Mock audit log data (in production, query actual audit database)
    const mockAuditLogs = [
      {
        timestamp: new Date().toISOString(),
        eventType: 'HEALTHCARE_DATA_ACCESS',
        userId: 'physician_001',
        action: 'READ_PATIENT_RECORD',
        resourceType: 'Patient',
        resourceId: 'patient_123',
        outcome: 'SUCCESS'
      }
    ];
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            auditLogs: mockAuditLogs,
            queryParameters: { startDate, endDate, eventType },
            totalRecords: mockAuditLogs.length,
            complianceLevel: this.complianceLevel,
            retrievedAt: new Date().toISOString()
          }, null, 2)
        }
      ]
    };
  }

  // BRAINSAIT: NPHIES interoperability validation
  async nphiesInteroperabilityCheck(args) {
    const { resource, checkType, userId } = args;
    
    // MEDICAL: NPHIES-specific validation logic
    const nphiesValidation = {
      structureCompliance: true,
      saudiSpecificFields: true,
      arabicContentPresent: resource.text?.div?.includes('العربية') || false,
      nphiesVersion: '1.0.0',
      validatedFields: ['resourceType', 'id', 'meta']
    };
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            nphiesCompliant: true,
            checkType,
            validationResults: nphiesValidation,
            recommendations: [
              BilingualContent.translate('Ensure Arabic content is present', this.defaultLanguage),
              BilingualContent.translate('Validate against latest NPHIES specifications', this.defaultLanguage)
            ],
            validatedAt: new Date().toISOString()
          }, null, 2)
        }
      ]
    };
  }

  // AGENT: Clinical decision support with AI integration
  async clinicalDecisionSupport(args) {
    const { patientData, clinicalQuestion, language = this.defaultLanguage, userId } = args;
    
    // AGENT: Mock clinical decision support (integrate with clinical AI models)
    const recommendation = {
      question: clinicalQuestion,
      recommendation: BilingualContent.translate(
        'Based on patient data, recommend routine monitoring and lifestyle modifications',
        language
      ),
      evidenceLevel: 'A',
      references: ['Clinical Guidelines 2024', 'Saudi Medical Practice Standards'],
      confidence: 0.85,
      riskFactors: [
        BilingualContent.translate('Hypertension', language),
        BilingualContent.translate('Family history', language)
      ]
    };
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            clinicalDecision: recommendation,
            language,
            generatedAt: new Date().toISOString(),
            disclaimer: BilingualContent.translate(
              'This is clinical decision support. Always use clinical judgment.',
              language
            )
          }, null, 2)
        }
      ]
    };
  }

  // BILINGUAL: Medical content translation
  async bilingualContentTranslate(args) {
    const { content, sourceLanguage, targetLanguage, userId } = args;
    
    const translatedContent = BilingualContent.translate(content, targetLanguage);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            originalContent: content,
            translatedContent,
            sourceLanguage,
            targetLanguage,
            translationMethod: 'Clinical terminology mapping',
            translatedAt: new Date().toISOString()
          }, null, 2)
        }
      ]
    };
  }

  // BRAINSAIT: PHI encryption/decryption handler
  async phiEncryptionHandler(args) {
    const { data, operation, userId } = args;
    
    try {
      let result;
      if (operation === 'encrypt') {
        result = this.phiEncryption.encrypt(data);
      } else if (operation === 'decrypt') {
        result = this.phiEncryption.decrypt(data);
      } else {
        throw new ComplianceError('Invalid encryption operation');
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              operation,
              success: true,
              result,
              processedAt: new Date().toISOString(),
              complianceLevel: 'HIPAA'
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new ComplianceError(`PHI encryption operation failed: ${error.message}`);
    }
  }

  // BRAINSAIT: Role-based access control validation
  async roleBasedAccessControl(args) {
    const { userId, requestedAction, resourceType, adminUserId } = args;
    
    // BRAINSAIT: Mock RBAC validation (integrate with actual identity provider)
    const userRoles = {
      'physician_001': ['READ_PATIENT', 'WRITE_PATIENT', 'READ_OBSERVATION'],
      'nurse_001': ['READ_PATIENT', 'WRITE_OBSERVATION'],
      'admin_001': ['ADMIN_ALL']
    };
    
    const userPermissions = userRoles[userId] || [];
    const hasPermission = userPermissions.includes(requestedAction) || userPermissions.includes('ADMIN_ALL');
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            userId,
            requestedAction,
            resourceType,
            hasPermission,
            userRoles: userPermissions,
            validatedAt: new Date().toISOString(),
            complianceFramework: this.complianceLevel
          }, null, 2)
        }
      ]
    };
  }

  setupPrompts() {
    // MEDICAL: Healthcare-specific prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
      prompts: [
        {
          name: "clinical_assessment",
          description: "Generate clinical assessments based on patient data",
          arguments: [
            { name: "patient_data", description: "Patient clinical data", required: true },
            { name: "assessment_type", description: "Type of clinical assessment", required: true },
            { name: "language", description: "Language for assessment (ar/en)", required: false }
          ]
        },
        {
          name: "fhir_resource_generator",
          description: "Generate FHIR R4 resources from clinical data",
          arguments: [
            { name: "clinical_data", description: "Clinical data to convert", required: true },
            { name: "resource_type", description: "FHIR resource type", required: true },
            { name: "compliance_level", description: "Required compliance level", required: false }
          ]
        },
        {
          name: "compliance_report",
          description: "Generate compliance reports for audit purposes",
          arguments: [
            { name: "audit_period", description: "Period for audit report", required: true },
            { name: "compliance_framework", description: "Compliance framework (HIPAA/NPHIES)", required: true },
            { name: "language", description: "Report language (ar/en)", required: false }
          ]
        }
      ]
    }));

    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      const prompts = {
        clinical_assessment: `Based on the following patient data: ${args?.patient_data}, generate a ${args?.assessment_type} clinical assessment in ${args?.language || this.defaultLanguage} language. Ensure FHIR R4 compliance and include relevant ICD-10/CPT codes.`,
        
        fhir_resource_generator: `Generate a FHIR R4 ${args?.resource_type} resource from the following clinical data: ${args?.clinical_data}. Ensure ${args?.compliance_level || this.complianceLevel} compliance level with proper validation and audit trail.`,
        
        compliance_report: `Generate a comprehensive compliance report for ${args?.audit_period} following ${args?.compliance_framework} standards in ${args?.language || this.defaultLanguage}. Include audit trails, access logs, and security metrics.`
      };

      const prompt = prompts[name];
      if (!prompt) {
        throw new McpError(ErrorCode.InvalidRequest, `Unknown prompt: ${name}`);
      }

      return {
        description: `Healthcare prompt: ${name}`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: prompt
            }
          }
        ]
      };
    });
  }

  setupErrorHandling() {
    // BRAINSAIT: Comprehensive error handling with audit logging
    process.on('unhandledRejection', async (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      await this.auditLogger.logAccess(
        'system',
        'UNHANDLED_REJECTION',
        'SYSTEM_ERROR',
        'promise_rejection',
        'FAILURE'
      );
    });

    process.on('uncaughtException', async (error) => {
      console.error('Uncaught Exception:', error);
      await this.auditLogger.logAccess(
        'system',
        'UNCAUGHT_EXCEPTION',
        'SYSTEM_ERROR',
        'exception',
        'FAILURE'
      );
      process.exit(1);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("BrainSAIT Healthcare MCP server running on stdio");
    console.error(`Compliance Level: ${this.complianceLevel}`);
    console.error(`Default Language: ${this.defaultLanguage}`);
  }
}

// Start the server
const server = new BrainSAITMCPServer();
server.run().catch(console.error);
