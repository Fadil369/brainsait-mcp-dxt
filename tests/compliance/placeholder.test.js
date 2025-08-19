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

  test('should log PHI access with encryption details', async () => {
    mockedAxios.post.mockResolvedValue({ status: 200 });

    await auditLogger.logAccess(
      'nurse_001',
      'UPDATE_PATIENT_RECORD',
      'Patient',
      'patient_456',
      { containsPHI: true, encryptionUsed: true }
    );

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockEndpoint,
      expect.objectContaining({
        eventType: 'HEALTHCARE_DATA_ACCESS',
        userId: 'nurse_001',
        action: 'UPDATE_PATIENT_RECORD',
        resourceType: 'Patient',
        resourceId: 'patient_456',
        metadata: expect.objectContaining({
          containsPHI: true,
          encryptionUsed: true
        })
      }),
      expect.anything()
    );
  });

  test('should include timestamp and IP address in logs', async () => {
    mockedAxios.post.mockResolvedValue({ status: 200 });

    await auditLogger.logAccess(
      'admin_001',
      'DELETE_PATIENT_RECORD',
      'Patient',
      'patient_789'
    );

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockEndpoint,
      expect.objectContaining({
        timestamp: expect.any(String),
        sourceIp: expect.any(String),
        sessionId: expect.any(String)
      }),
      expect.anything()
    );
  });
});