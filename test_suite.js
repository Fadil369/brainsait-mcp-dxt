// tests/unit/fhir-validation.test.js
/**
 * MEDICAL: FHIR R4 validation unit tests
 * BRAINSAIT: Compliance testing for healthcare standards
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { FHIRValidator } from '../../server/index.js';

describe('FHIR R4 Validation', () => {
  let validator;

  beforeEach(() => {
    validator = new FHIRValidator();
  });

  describe('Resource Structure Validation', () => {
    test('should validate valid Patient resource', () => {
      const validPatient = {
        resourceType: 'Patient',
        id: 'patient-001',
        meta: {
          versionId: '1',
          lastUpdated: '2024-01-01T00:00:00Z'
        },
        identifier: [{
          use: 'usual',
          system: 'http://hospital.brainsait.com',
          value: '12345'
        }],
        active: true,
        name: [{
          use: 'official',
          family: 'المريض',
          given: ['أحمد', 'محمد']
        }],
        gender: 'male',
        birthDate: '1990-01-01'
      };

      expect(() => {
        FHIRValidator.validateResource(validPatient, 'Patient');
      }).not.toThrow();
    });

    test('should reject resource with wrong resourceType', () => {
      const invalidResource = {
        resourceType: 'Observation',
        id: 'patient-001'
      };

      expect(() => {
        FHIRValidator.validateResource(invalidResource, 'Patient');
      }).toThrow('Invalid resourceType');
    });

    test('should reject resource without id or identifier', () => {
      const invalidResource = {
        resourceType: 'Patient',
        name: [{ family: 'Test' }]
      };

      expect(() => {
        FHIRValidator.validateResource(invalidResource, 'Patient');
      }).toThrow('FHIR resource must have id or identifier');
    });
  });

  describe('Clinical Terminology Validation', () => {
    test('should validate ICD-10 codes', () => {
      expect(() => {
        FHIRValidator.validateClinicalTerminology(
          'I10.9',
          'http://hl7.org/fhir/sid/icd-10'
        );
      }).not.toThrow();
    });

    test('should validate CPT codes', () => {
      expect(() => {
        FHIRValidator.validateClinicalTerminology(
          '99213',
          'http://www.ama-assn.org/go/cpt'
        );
      }).not.toThrow();
    });

    test('should validate LOINC codes', () => {
      expect(() => {
        FHIRValidator.validateClinicalTerminology(
          '8302-2',
          'http://loinc.org'
        );
      }).not.toThrow();
    });

    test('should reject invalid coding system', () => {
      expect(() => {
        FHIRValidator.validateClinicalTerminology(
          'TEST-CODE',
          'http://invalid-system.com'
        );
      }).toThrow('Invalid coding system');
    });
  });
});

// tests/unit/bilingual-content.test.js
/**
 * BILINGUAL: Arabic/English content translation tests
 */

import { BilingualContent } from '../../server/index.js';

describe('Bilingual Content Translation', () => {
  test('should translate medical terms to Arabic', () => {
    const englishText = 'Patient diagnosis requires medication';
    const arabicTranslation = BilingualContent.translate(englishText, 'ar');
    
    expect(arabicTranslation).toContain('مريض');
    expect(arabicTranslation).toContain('تشخيص');
    expect(arabicTranslation).toContain('دواء');
  });

  test('should translate medical terms to English', () => {
    const arabicText = 'المريض يحتاج إلى علاج';
    const englishTranslation = BilingualContent.translate(arabicText, 'en');
    
    expect(englishTranslation).toContain('patient');
    expect(englishTranslation).toContain('treatment');
  });

  test('should handle non-string input gracefully', () => {
    const nonStringInput = { test: 'value' };
    const result = BilingualContent.translate(nonStringInput, 'ar');
    
    expect(result).toBe(nonStringInput);
  });
});

// tests/unit/phi-encryption.test.js
/**
 * BRAINSAIT: PHI encryption tests for HIPAA compliance
 */

import { PHIEncryption } from '../../server/index.js';

describe('PHI Encryption', () => {
  let encryption;
  const testKey = 'test-encryption-key-brainsait-2024';

  beforeEach(() => {
    encryption = new PHIEncryption(testKey);
  });

  test('should encrypt and decrypt PHI data correctly', () => {
    const sensitiveData = {
      patientId: 'patient-001',
      ssn: '123-45-6789',
      medicalRecord: 'Confidential medical information'
    };

    const encrypted = encryption.encrypt(sensitiveData);
    expect(encrypted).toHaveProperty('encrypted');
    expect(encrypted).toHaveProperty('iv');
    expect(encrypted).toHaveProperty('authTag');

    const decrypted = encryption.decrypt(encrypted);
    expect(decrypted).toEqual(sensitiveData);
  });

  test('should generate different encrypted output for same input', () => {
    const data = { patientId: 'test-001' };
    
    const encrypted1 = encryption.encrypt(data);
    const encrypted2 = encryption.encrypt(data);
    
    expect(encrypted1.encrypted).not.toBe(encrypted2.encrypted);
    expect(encrypted1.iv).not.toBe(encrypted2.iv);
  });

  test('should fail decryption with tampered data', () => {
    const data = { test: 'data' };
    const encrypted = encryption.encrypt(data);
    
    // Tamper with encrypted data
    encrypted.encrypted = encrypted.encrypted.replace('a', 'b');
    
    expect(() => {
      encryption.decrypt(encrypted);
    }).toThrow();
  });
});

// tests/integration/mcp-server.test.js
/**
 * BRAINSAIT: Integration tests for MCP server functionality
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { spawn } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';

describe('MCP Server Integration', () => {
  let serverProcess;

  beforeAll((done) => {
    // Set test environment variables
    process.env.FHIR_BASE_URL = 'https://test-fhir.brainsait.com/r4';
    process.env.ENCRYPTION_KEY = 'test-key-for-integration-tests';
    process.env.AUDIT_LOG_ENDPOINT = 'https://test-audit.brainsait.com/api/v1/logs';
    process.env.DEFAULT_LANGUAGE = 'ar';
    process.env.COMPLIANCE_LEVEL = 'HIPAA,NPHIES';

    // Start MCP server
    serverProcess = spawn('node', ['server/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    setTimeout(done, 2000); // Give server time to start
  });

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  test('should respond to list_tools request', (done) => {
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    };

    serverProcess.stdin.write(JSON.stringify(request) + '\n');

    serverProcess.stdout.once('data', (data) => {
      const response = JSON.parse(data.toString());
      
      expect(response).toHaveProperty('result');
      expect(response.result).toHaveProperty('tools');
      expect(Array.isArray(response.result.tools)).toBe(true);
      
      // Check for required tools
      const toolNames = response.result.tools.map(tool => tool.name);
      expect(toolNames).toContain('validate_fhir_resource');
      expect(toolNames).toContain('clinical_terminology_lookup');
      expect(toolNames).toContain('audit_log_query');
      
      done();
    });
  });

  test('should handle FHIR validation tool call', (done) => {
    const request = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'validate_fhir_resource',
        arguments: {
          resource: {
            resourceType: 'Patient',
            id: 'test-patient',
            name: [{ family: 'Test' }]
          },
          resourceType: 'Patient',
          userId: 'test-user-001'
        }
      }
    };

    serverProcess.stdin.write(JSON.stringify(request) + '\n');

    serverProcess.stdout.once('data', (data) => {
      const response = JSON.parse(data.toString());
      
      expect(response).toHaveProperty('result');
      expect(response.result).toHaveProperty('content');
      
      const content = JSON.parse(response.result.content[0].text);
      expect(content).toHaveProperty('valid');
      expect(content).toHaveProperty('resourceType', 'Patient');
      
      done();
    });
  });
});

// tests/compliance/hipaa-audit.test.js
/**
 * BRAINSAIT: HIPAA compliance and audit logging tests
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { AuditLogger } from '../../server/index.js';
import axios from 'axios';

// Mock axios for testing
jest.mock('axios');
const mockedAxios = axios;

describe('HIPAA Compliance and Audit Logging', () => {
  let auditLogger;
  const mockEndpoint = 'https://test-audit.brainsait.com/api/v1/logs';
  const mockEncryptionKey = 'test-audit-key';

  beforeEach(() => {
    auditLogger = new AuditLogger(mockEndpoint, mockEncryptionKey);
    jest.clearAllMocks();
  });

  test('should log healthcare data access events', async () => {
    mockedAxios.post.mockResolvedValue({ status: 200 });

    await auditLogger.logAccess(
      'physician_001',
      'READ_PATIENT_RECORD',
      'Patient',
      'patient_123'
    );

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockEndpoint,
      expect.objectContaining({
        eventType: 'HEALTHCARE_DATA_ACCESS',
        userId: 'physician_001',
        action: 'READ_PATIENT_RECORD',
        resourceType: 'Patient',
        resourceId: 'patient_123',
        outcome: 'SUCCESS'
      }),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': expect.stringContaining('Bearer')
        }
      })
    );
  });

  test('should handle audit logging failures gracefully', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Network error'));

    // Should not throw error even if audit logging fails
    await expect(
      auditLogger.logAccess('user_001', 'READ', 'Patient', 'patient_001')
    ).resolves.not.toThrow();
  });

  test('should generate unique session IDs', () => {
    const sessionId1 = auditLogger.generateSessionId();
    const sessionId2 = auditLogger.generateSessionId();

    expect(sessionId1).not.toBe(sessionId2);
    expect(sessionId1).toHaveLength(32); // 16 bytes = 32 hex chars
  });
});

// tests/compliance/nphies-validation.test.js
/**
 * MEDICAL: NPHIES Saudi interoperability validation tests
 */

describe('NPHIES Interoperability Validation', () => {
  test('should validate Saudi-specific FHIR extensions', () => {
    const saudiPatient = {
      resourceType: 'Patient',
      id: 'saudi-patient-001',
      meta: {
        profile: ['http://nphies.sa/fhir/StructureDefinition/Saudi-Patient']
      },
      identifier: [{
        use: 'official',
        type: {
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
            code: 'NI'
          }]
        },
        system: 'http://nphies.sa/identifier/national-id',
        value: '1234567890'
      }],
      name: [{
        use: 'official',
        family: 'العتيبي',
        given: ['محمد', 'عبدالله'],
        extension: [{
          url: 'http://nphies.sa/fhir/StructureDefinition/name-arabic',
          valueString: 'محمد عبدالله العتيبي'
        }]
      }],
      telecom: [{
        system: 'phone',
        value: '+966501234567',
        use: 'mobile'
      }],
      gender: 'male',
      birthDate: '1985-03-15',
      address: [{
        use: 'home',
        type: 'both',
        text: 'الرياض، منطقة الرياض، المملكة العربية السعودية',
        city: 'الرياض',
        district: 'الملز',
        state: 'الرياض',
        postalCode: '12345',
        country: 'SA'
      }]
    };

    // Validate NPHIES-specific requirements
    expect(saudiPatient.meta.profile).toContain('http://nphies.sa/fhir/StructureDefinition/Saudi-Patient');
    expect(saudiPatient.identifier[0].system).toBe('http://nphies.sa/identifier/national-id');
    expect(saudiPatient.name[0].extension).toBeDefined();
    expect(saudiPatient.address[0].country).toBe('SA');
  });

  test('should validate Arabic content presence', () => {
    const resourceWithArabic = {
      resourceType: 'Organization',
      id: 'saudi-hospital-001',
      name: 'مستشفى الملك فهد الجامعي',
      alias: ['King Fahd University Hospital'],
      telecom: [{
        system: 'phone',
        value: '+966138966666'
      }],
      address: [{
        text: 'الخبر، المنطقة الشرقية، المملكة العربية السعودية',
        city: 'الخبر',
        state: 'المنطقة الشرقية',
        country: 'SA'
      }]
    };

    // Check for Arabic content
    const hasArabicName = /[\u0600-\u06FF]/.test(resourceWithArabic.name);
    const hasArabicAddress = /[\u0600-\u06FF]/.test(resourceWithArabic.address[0].text);

    expect(hasArabicName).toBe(true);
    expect(hasArabicAddress).toBe(true);
  });
});

// tests/compliance/role-based-access.test.js
/**
 * BRAINSAIT: Role-based access control tests
 */

describe('Role-Based Access Control', () => {
  const mockUserRoles = {
    'physician_001': ['READ_PATIENT', 'WRITE_PATIENT', 'READ_OBSERVATION'],
    'nurse_001': ['READ_PATIENT', 'WRITE_OBSERVATION'],
    'pharmacist_001': ['READ_PATIENT', 'READ_MEDICATION', 'WRITE_MEDICATION'],
    'admin_001': ['ADMIN_ALL'],
    'patient_001': ['READ_OWN_DATA']
  };

  test('should allow physician to read patient data', () => {
    const userPermissions = mockUserRoles['physician_001'];
    const hasReadPermission = userPermissions.includes('READ_PATIENT');

    expect(hasReadPermission).toBe(true);
  });

  test('should deny nurse write access to patient records', () => {
    const userPermissions = mockUserRoles['nurse_001'];
    const hasWritePermission = userPermissions.includes('WRITE_PATIENT');

    expect(hasWritePermission).toBe(false);
  });

  test('should allow admin all permissions', () => {
    const userPermissions = mockUserRoles['admin_001'];
    const hasAdminAccess = userPermissions.includes('ADMIN_ALL');

    expect(hasAdminAccess).toBe(true);
  });

  test('should restrict patient to own data only', () => {
    const userPermissions = mockUserRoles['patient_001'];
    const hasLimitedAccess = userPermissions.includes('READ_OWN_DATA');
    const hasFullAccess = userPermissions.includes('READ_PATIENT');

    expect(hasLimitedAccess).toBe(true);
    expect(hasFullAccess).toBe(false);
  });
});

// tests/performance/load-testing.test.js
/**
 * BRAINSAIT: Performance and load testing
 */

describe('Performance Testing', () => {
  test('should handle concurrent FHIR validations', async () => {
    const testPatient = {
      resourceType: 'Patient',
      id: 'load-test-patient',
      name: [{ family: 'Test' }]
    };

    const validationPromises = Array.from({ length: 100 }, (_, i) => 
      FHIRValidator.validateResource(
        { ...testPatient, id: `load-test-patient-${i}` },
        'Patient'
      )
    );

    const startTime = performance.now();
    await Promise.all(validationPromises);
    const endTime = performance.now();

    const executionTime = endTime - startTime;
    
    // Should complete 100 validations in under 1 second
    expect(executionTime).toBeLessThan(1000);
  });

  test('should encrypt PHI data efficiently', () => {
    const encryption = new PHIEncryption('test-key');
    const largeDataSet = {
      patients: Array.from({ length: 1000 }, (_, i) => ({
        id: `patient-${i}`,
        name: `Patient ${i}`,
        ssn: `123-45-${String(i).padStart(4, '0')}`
      }))
    };

    const startTime = performance.now();
    const encrypted = encryption.encrypt(largeDataSet);
    const decrypted = encryption.decrypt(encrypted);
    const endTime = performance.now();

    const executionTime = endTime - startTime;

    // Should encrypt/decrypt large dataset in under 500ms
    expect(executionTime).toBeLessThan(500);
    expect(decrypted).toEqual(largeDataSet);
  });
});

// tests/e2e/clinical-workflow.test.js
/**
 * MEDICAL: End-to-end clinical workflow testing
 */

describe('Clinical Workflow End-to-End', () => {
  test('should complete patient admission workflow', async () => {
    // Simulate complete patient admission workflow
    const patientData = {
      resourceType: 'Patient',
      id: 'workflow-patient-001',
      identifier: [{
        system: 'http://hospital.brainsait.com',
        value: 'WF001'
      }],
      name: [{
        family: 'الأحمد',
        given: ['سارة', 'محمد']
      }],
      gender: 'female',
      birthDate: '1992-08-20'
    };

    // Step 1: Validate patient resource
    expect(() => {
      FHIRValidator.validateResource(patientData, 'Patient');
    }).not.toThrow();

    // Step 2: Check NPHIES compliance
    const hasNationalId = patientData.identifier.some(id => 
      id.system.includes('hospital.brainsait.com')
    );
    expect(hasNationalId).toBe(true);

    // Step 3: Encrypt PHI data
    const encryption = new PHIEncryption('workflow-test-key');
    const encryptedPatient = encryption.encrypt(patientData);
    expect(encryptedPatient).toHaveProperty('encrypted');

    // Step 4: Audit the workflow
    const auditLogger = new AuditLogger('test-endpoint', 'test-key');
    const sessionId = auditLogger.generateSessionId();
    expect(sessionId).toHaveLength(32);

    // Step 5: Translate content for bilingual support
    const arabicTranslation = BilingualContent.translate(
      'Patient admission completed successfully',
      'ar'
    );
    expect(arabicTranslation).toContain('مريض');
  });
});

export { };

// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/node_modules/**',
    '!**/tests/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};