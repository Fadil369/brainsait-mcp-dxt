/**
 * MEDICAL: NPHIES Saudi interoperability validation tests
 */

import { describe, test, expect } from '@jest/globals';
import { FHIRValidator } from '../../server/index.js';

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
            code: 'NI',
            display: 'National identifier'
          }]
        },
        system: 'http://nphies.sa/identifier/national-id',
        value: '1234567890'
      }],
      name: [{
        use: 'official',
        family: 'الأحمد',
        given: ['محمد', 'عبدالله'],
        extension: [{
          url: 'http://nphies.sa/fhir/StructureDefinition/name-arabic',
          valueString: 'محمد عبدالله الأحمد'
        }]
      }],
      gender: 'male',
      birthDate: '1985-03-15',
      address: [{
        use: 'home',
        type: 'physical',
        city: 'الرياض',
        district: 'الملز',
        state: 'الرياض',
        country: 'SA',
        extension: [{
          url: 'http://nphies.sa/fhir/StructureDefinition/address-arabic',
          valueString: 'المملكة العربية السعودية، الرياض، الملز'
        }]
      }]
    };

    expect(() => {
      FHIRValidator.validateResource(saudiPatient, 'Patient');
    }).not.toThrow();
  });

  test('should validate Saudi coverage resource', () => {
    const saudiCoverage = {
      resourceType: 'Coverage',
      id: 'saudi-coverage-001',
      meta: {
        profile: ['http://nphies.sa/fhir/StructureDefinition/Saudi-Coverage']
      },
      identifier: [{
        system: 'http://nphies.sa/identifier/coverage',
        value: 'COV-001-2024'
      }],
      status: 'active',
      type: {
        coding: [{
          system: 'http://nphies.sa/CodeSystem/coverage-type',
          code: 'EHCP',
          display: 'Essential Health Care Package'
        }]
      },
      beneficiary: {
        reference: 'Patient/saudi-patient-001'
      },
      payor: [{
        reference: 'Organization/saudi-insurance-001'
      }]
    };

    expect(() => {
      FHIRValidator.validateResource(saudiCoverage, 'Coverage');
    }).not.toThrow();
  });

  test('should validate Saudi organization resource', () => {
    const saudiOrganization = {
      resourceType: 'Organization',
      id: 'saudi-hospital-001',
      meta: {
        profile: ['http://nphies.sa/fhir/StructureDefinition/Saudi-Organization']
      },
      identifier: [{
        use: 'official',
        system: 'http://nphies.sa/identifier/organization',
        value: 'ORG-RIYADH-001'
      }],
      active: true,
      type: [{
        coding: [{
          system: 'http://nphies.sa/CodeSystem/organization-type',
          code: 'HOSP',
          display: 'Hospital'
        }]
      }],
      name: 'مستشفى الملك فهد',
      alias: ['King Fahd Hospital'],
      address: [{
        use: 'work',
        type: 'physical',
        city: 'الرياض',
        state: 'الرياض',
        country: 'SA'
      }]
    };

    expect(() => {
      FHIRValidator.validateResource(saudiOrganization, 'Organization');
    }).not.toThrow();
  });

  test('should validate Arabic clinical terminology', () => {
    // Test Arabic ICD-10 codes
    expect(() => {
      FHIRValidator.validateClinicalTerminology('I25.9', 'ICD-10');
    }).not.toThrow();

    // Test Arabic procedure codes
    expect(() => {
      FHIRValidator.validateClinicalTerminology('0016T', 'CPT');
    }).not.toThrow();
  });

  test('should handle bilingual resource validation', () => {
    const bilingualPractitioner = {
      resourceType: 'Practitioner',
      id: 'saudi-practitioner-001',
      identifier: [{
        system: 'http://nphies.sa/identifier/practitioner-license',
        value: 'LIC-12345'
      }],
      name: [{
        use: 'official',
        family: 'الطبيب',
        given: ['أحمد', 'محمد'],
        text: 'د. أحمد محمد الطبيب'
      }, {
        use: 'usual',
        family: 'Al-Tabib',
        given: ['Ahmed', 'Mohammed'],
        text: 'Dr. Ahmed Mohammed Al-Tabib'
      }],
      qualification: [{
        code: {
          coding: [{
            system: 'http://nphies.sa/CodeSystem/practitioner-qualification',
            code: 'MD',
            display: 'دكتور في الطب'
          }]
        }
      }]
    };

    expect(() => {
      FHIRValidator.validateResource(bilingualPractitioner, 'Practitioner');
    }).not.toThrow();
  });
});