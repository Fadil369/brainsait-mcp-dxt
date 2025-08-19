/**
 * BrainSAIT Healthcare Connector Templates
 * Pre-configured templates for common healthcare system integrations
 *
 * @author BrainSAIT Development Team
 * @version 1.0.0
 * @license MIT
 */

import { WebConnectorError } from './WebConnectorManager.js';

/**
 * Healthcare Connector Templates
 * Provides pre-configured templates for EHR, FHIR, Audit, and other healthcare systems
 */
export class HealthcareConnectorTemplates {
  /**
   * EHR System Connector Template
   * For connecting to Electronic Health Record systems
   */
  static getEHRTemplate (config = {}) {
    return {
      type: 'ehr_system',
      name: config.name || 'EHR System',
      description: 'Electronic Health Record system integration',
      endpoint: config.endpoint,

      authentication: {
        type: config.authType || 'oauth2',
        ...config.authentication
      },

      healthcareCompliance: {
        hipaa: true,
        nphies: config.nphiesCompliant || false,
        auditRequired: true,
        encryptionRequired: true
      },

      capabilities: [
        'patient_lookup',
        'patient_create',
        'patient_update',
        'encounter_management',
        'clinical_documentation',
        'medication_management',
        'allergy_management',
        'problem_list_management'
      ],

      dataMapping: {
        patientSearch: '/api/v1/patients/search',
        patientCreate: '/api/v1/patients',
        patientUpdate: '/api/v1/patients/{id}',
        encounterList: '/api/v1/encounters',
        clinicalNotes: '/api/v1/clinical-notes',
        medications: '/api/v1/medications',
        allergies: '/api/v1/allergies',
        problems: '/api/v1/problems'
      },

      headers: {
        Accept: 'application/fhir+json',
        'Content-Type': 'application/fhir+json',
        'X-EHR-System': config.systemName || 'Generic',
        'X-Healthcare-Standard': 'FHIR-R4'
      },

      errorHandling: {
        retryAttempts: 3,
        retryDelay: 2000,
        timeoutMs: 30000
      },

      validation: {
        validateFHIR: true,
        validateNPHIES: config.nphiesCompliant || false,
        requiredFields: ['resourceType', 'id']
      },

      encryptSensitiveData: true,

      ...config
    };
  }

  /**
   * FHIR Server Connector Template
   * For connecting to FHIR R4 compliant servers
   */
  static getFHIRTemplate (config = {}) {
    return {
      type: 'fhir_server',
      name: config.name || 'FHIR Server',
      description: 'FHIR R4 compliant server integration',
      endpoint: config.endpoint,

      authentication: {
        type: config.authType || 'bearer',
        ...config.authentication
      },

      healthcareCompliance: {
        hipaa: true,
        nphies: config.nphiesCompliant || false,
        fhirR4: true,
        auditRequired: true,
        encryptionRequired: true
      },

      capabilities: [
        'resource_crud',
        'search_operations',
        'batch_operations',
        'transaction_operations',
        'terminology_services',
        'capability_statement',
        'patient_everything',
        'encounter_everything'
      ],

      dataMapping: {
        // FHIR R4 standard endpoints
        patient: '/Patient',
        encounter: '/Encounter',
        observation: '/Observation',
        condition: '/Condition',
        medication: '/Medication',
        medicationRequest: '/MedicationRequest',
        allergyIntolerance: '/AllergyIntolerance',
        diagnosticReport: '/DiagnosticReport',
        procedure: '/Procedure',
        immunization: '/Immunization',
        careTeam: '/CareTeam',
        carePlan: '/CarePlan',

        // Search operations
        search: '/{resourceType}',
        searchById: '/{resourceType}/{id}',
        searchByIdentifier: '/{resourceType}?identifier={identifier}',

        // Special operations
        patientEverything: '/Patient/{id}/$everything',
        encounterEverything: '/Encounter/{id}/$everything',
        capabilityStatement: '/metadata',

        // Terminology services
        codeSystemLookup: '/CodeSystem/$lookup',
        valueSetExpand: '/ValueSet/$expand',
        conceptMapTranslate: '/ConceptMap/$translate'
      },

      headers: {
        Accept: 'application/fhir+json',
        'Content-Type': 'application/fhir+json',
        Prefer: 'return=representation',
        'X-FHIR-Version': '4.0.1'
      },

      errorHandling: {
        retryAttempts: 3,
        retryDelay: 1500,
        timeoutMs: 25000
      },

      validation: {
        validateFHIR: true,
        validateNPHIES: config.nphiesCompliant || false,
        strictValidation: config.strictValidation || false,
        requiredFields: ['resourceType']
      },

      encryptSensitiveData: true,

      ...config
    };
  }

  /**
   * Audit System Connector Template
   * For connecting to healthcare audit and logging systems
   */
  static getAuditTemplate (config = {}) {
    return {
      type: 'audit_system',
      name: config.name || 'Audit System',
      description: 'Healthcare audit and compliance logging system',
      endpoint: config.endpoint,

      authentication: {
        type: config.authType || 'apikey',
        ...config.authentication
      },

      healthcareCompliance: {
        hipaa: true,
        nphies: config.nphiesCompliant || false,
        auditRequired: false, // This IS the audit system
        encryptionRequired: true
      },

      capabilities: [
        'audit_log_creation',
        'audit_log_query',
        'compliance_reporting',
        'access_monitoring',
        'breach_detection',
        'user_activity_tracking',
        'data_access_logging',
        'system_event_logging'
      ],

      dataMapping: {
        createAuditLog: '/api/v1/audit-logs',
        queryAuditLogs: '/api/v1/audit-logs/search',
        getComplianceReport: '/api/v1/reports/compliance',
        getUserActivity: '/api/v1/reports/user-activity',
        getAccessReport: '/api/v1/reports/access',
        getBreachReport: '/api/v1/reports/breach',
        systemEvents: '/api/v1/system-events',
        userSessions: '/api/v1/user-sessions'
      },

      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Audit-Version': '1.0',
        'X-Compliance-Level': 'HIPAA'
      },

      errorHandling: {
        retryAttempts: 5, // Higher retry for audit systems
        retryDelay: 1000,
        timeoutMs: 15000
      },

      validation: {
        validateAuditEvent: true,
        requiredFields: ['timestamp', 'eventType', 'userId', 'action']
      },

      encryptSensitiveData: true,

      ...config
    };
  }

  /**
   * Laboratory Information System (LIS) Connector Template
   */
  static getLISTemplate (config = {}) {
    return {
      type: 'lis_system',
      name: config.name || 'Laboratory Information System',
      description: 'Laboratory Information System integration',
      endpoint: config.endpoint,

      authentication: {
        type: config.authType || 'oauth2',
        ...config.authentication
      },

      healthcareCompliance: {
        hipaa: true,
        nphies: config.nphiesCompliant || false,
        clia: true, // Clinical Laboratory Improvement Amendments
        auditRequired: true,
        encryptionRequired: true
      },

      capabilities: [
        'lab_order_management',
        'result_retrieval',
        'specimen_tracking',
        'quality_control',
        'reference_ranges',
        'lab_report_generation',
        'critical_value_alerts',
        'test_catalog_management'
      ],

      dataMapping: {
        labOrders: '/api/v1/lab-orders',
        labResults: '/api/v1/lab-results',
        specimens: '/api/v1/specimens',
        testCatalog: '/api/v1/test-catalog',
        referenceRanges: '/api/v1/reference-ranges',
        qualityControl: '/api/v1/quality-control',
        criticalValues: '/api/v1/critical-values',
        labReports: '/api/v1/reports'
      },

      headers: {
        Accept: 'application/fhir+json',
        'Content-Type': 'application/fhir+json',
        'X-LIS-Version': config.lisVersion || '1.0',
        'X-Lab-Standard': 'HL7-FHIR'
      },

      errorHandling: {
        retryAttempts: 3,
        retryDelay: 2500,
        timeoutMs: 35000
      },

      validation: {
        validateFHIR: true,
        validateCLIA: true,
        requiredFields: ['resourceType', 'identifier', 'status']
      },

      encryptSensitiveData: true,

      ...config
    };
  }

  /**
   * Radiology Information System (RIS) Connector Template
   */
  static getRISTemplate (config = {}) {
    return {
      type: 'ris_system',
      name: config.name || 'Radiology Information System',
      description: 'Radiology Information System integration',
      endpoint: config.endpoint,

      authentication: {
        type: config.authType || 'oauth2',
        ...config.authentication
      },

      healthcareCompliance: {
        hipaa: true,
        nphies: config.nphiesCompliant || false,
        dicom: true,
        auditRequired: true,
        encryptionRequired: true
      },

      capabilities: [
        'imaging_order_management',
        'study_scheduling',
        'image_retrieval',
        'report_management',
        'dicom_integration',
        'modality_worklist',
        'radiation_dose_tracking',
        'image_sharing'
      ],

      dataMapping: {
        imagingOrders: '/api/v1/imaging-orders',
        studies: '/api/v1/studies',
        images: '/api/v1/images',
        reports: '/api/v1/reports',
        modalityWorklist: '/api/v1/modality-worklist',
        radiationDose: '/api/v1/radiation-dose',
        dicomMetadata: '/api/v1/dicom/metadata',
        imageSharing: '/api/v1/image-sharing'
      },

      headers: {
        Accept: 'application/dicom+json',
        'Content-Type': 'application/dicom+json',
        'X-RIS-Version': config.risVersion || '1.0',
        'X-DICOM-Standard': config.dicomVersion || '3.0'
      },

      errorHandling: {
        retryAttempts: 2, // Lower retry for large image data
        retryDelay: 3000,
        timeoutMs: 60000 // Higher timeout for image data
      },

      validation: {
        validateDICOM: true,
        validateFHIR: true,
        requiredFields: ['studyInstanceUID', 'seriesInstanceUID']
      },

      encryptSensitiveData: true,

      ...config
    };
  }

  /**
   * Pharmacy Information System (PIS) Connector Template
   */
  static getPISTemplate (config = {}) {
    return {
      type: 'pis_system',
      name: config.name || 'Pharmacy Information System',
      description: 'Pharmacy Information System integration',
      endpoint: config.endpoint,

      authentication: {
        type: config.authType || 'oauth2',
        ...config.authentication
      },

      healthcareCompliance: {
        hipaa: true,
        nphies: config.nphiesCompliant || false,
        dea: true, // Drug Enforcement Administration
        auditRequired: true,
        encryptionRequired: true
      },

      capabilities: [
        'prescription_management',
        'drug_interaction_checking',
        'inventory_management',
        'dispensing_records',
        'formulary_management',
        'prior_authorization',
        'medication_therapy_management',
        'controlled_substance_tracking'
      ],

      dataMapping: {
        prescriptions: '/api/v1/prescriptions',
        medications: '/api/v1/medications',
        drugInteractions: '/api/v1/drug-interactions',
        inventory: '/api/v1/inventory',
        dispensing: '/api/v1/dispensing',
        formulary: '/api/v1/formulary',
        priorAuth: '/api/v1/prior-authorization',
        controlledSubstances: '/api/v1/controlled-substances'
      },

      headers: {
        Accept: 'application/fhir+json',
        'Content-Type': 'application/fhir+json',
        'X-PIS-Version': config.pisVersion || '1.0',
        'X-Pharmacy-Standard': 'NCPDP'
      },

      errorHandling: {
        retryAttempts: 3,
        retryDelay: 2000,
        timeoutMs: 20000
      },

      validation: {
        validateFHIR: true,
        validateNCPDP: true,
        validateDEA: true,
        requiredFields: ['resourceType', 'identifier', 'medicationReference']
      },

      encryptSensitiveData: true,

      ...config
    };
  }

  /**
   * Health Information Exchange (HIE) Connector Template
   */
  static getHIETemplate (config = {}) {
    return {
      type: 'hie_system',
      name: config.name || 'Health Information Exchange',
      description: 'Health Information Exchange system integration',
      endpoint: config.endpoint,

      authentication: {
        type: config.authType || 'oauth2',
        ...config.authentication
      },

      healthcareCompliance: {
        hipaa: true,
        nphies: config.nphiesCompliant || false,
        directTrust: config.directTrust || false,
        auditRequired: true,
        encryptionRequired: true
      },

      capabilities: [
        'patient_discovery',
        'document_query',
        'document_retrieve',
        'care_summary_exchange',
        'clinical_data_sharing',
        'consent_management',
        'provider_directory',
        'cross_enterprise_sharing'
      ],

      dataMapping: {
        patientDiscovery: '/api/v1/patient-discovery',
        documentQuery: '/api/v1/document-query',
        documentRetrieve: '/api/v1/document-retrieve',
        careSummary: '/api/v1/care-summary',
        clinicalData: '/api/v1/clinical-data',
        consent: '/api/v1/consent',
        providerDirectory: '/api/v1/provider-directory',
        crossEnterprise: '/api/v1/cross-enterprise'
      },

      headers: {
        Accept: 'application/fhir+json',
        'Content-Type': 'application/fhir+json',
        'X-HIE-Version': config.hieVersion || '1.0',
        'X-Exchange-Standard': 'IHE-FHIR'
      },

      errorHandling: {
        retryAttempts: 2,
        retryDelay: 5000,
        timeoutMs: 45000
      },

      validation: {
        validateFHIR: true,
        validateIHE: true,
        validateConsent: true,
        requiredFields: ['resourceType', 'identifier']
      },

      encryptSensitiveData: true,

      ...config
    };
  }

  /**
   * Get all available template types
   */
  static getAvailableTemplates () {
    return [
      {
        type: 'ehr_system',
        name: 'Electronic Health Record System',
        description: 'Connect to EHR systems for patient data management'
      },
      {
        type: 'fhir_server',
        name: 'FHIR R4 Server',
        description: 'Connect to FHIR R4 compliant healthcare servers'
      },
      {
        type: 'audit_system',
        name: 'Audit and Compliance System',
        description: 'Connect to healthcare audit and logging systems'
      },
      {
        type: 'lis_system',
        name: 'Laboratory Information System',
        description: 'Connect to laboratory systems for test results'
      },
      {
        type: 'ris_system',
        name: 'Radiology Information System',
        description: 'Connect to radiology systems for imaging data'
      },
      {
        type: 'pis_system',
        name: 'Pharmacy Information System',
        description: 'Connect to pharmacy systems for medication data'
      },
      {
        type: 'hie_system',
        name: 'Health Information Exchange',
        description: 'Connect to HIE systems for cross-enterprise data sharing'
      }
    ];
  }

  /**
   * Create connector template by type
   */
  static createTemplate (type, config = {}) {
    switch (type) {
      case 'ehr_system':
        return this.getEHRTemplate(config);
      case 'fhir_server':
        return this.getFHIRTemplate(config);
      case 'audit_system':
        return this.getAuditTemplate(config);
      case 'lis_system':
        return this.getLISTemplate(config);
      case 'ris_system':
        return this.getRISTemplate(config);
      case 'pis_system':
        return this.getPISTemplate(config);
      case 'hie_system':
        return this.getHIETemplate(config);
      default:
        throw new WebConnectorError(`Unknown template type: ${type}`);
    }
  }

  /**
   * Validate template configuration
   */
  static validateTemplate (template) {
    const required = ['type', 'endpoint', 'authentication', 'healthcareCompliance'];

    for (const field of required) {
      if (!template[field]) {
        throw new WebConnectorError(`Missing required template field: ${field}`);
      }
    }

    // Validate healthcare compliance requirements
    const compliance = template.healthcareCompliance;
    if (!compliance.hipaa && !compliance.nphies) {
      throw new WebConnectorError('Template must specify HIPAA or NPHIES compliance');
    }

    return true;
  }
}

export default HealthcareConnectorTemplates;
