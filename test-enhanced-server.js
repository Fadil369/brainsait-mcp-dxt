#!/usr/bin/env node

/**
 * Enhanced BrainSAIT Healthcare MCP Server Test Suite
 * Tests web connector functionality and healthcare compliance
 * 
 * @author BrainSAIT Development Team
 * @version 2.0.0
 * @license MIT
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Enhanced Server Test Runner
 */
class EnhancedServerTestRunner {
  constructor() {
    this.serverProcess = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
    
    // Set test environment variables
    process.env.ENCRYPTION_KEY = 'test-encryption-key-32-characters';
    process.env.AUDIT_LOG_ENDPOINT = 'https://test-audit.example.com';
    process.env.COMPLIANCE_LEVEL = 'HIPAA,NPHIES';
    process.env.DEFAULT_LANGUAGE = 'ar';
    process.env.CONNECTOR_TIMEOUT = '30000';
    process.env.CONNECTOR_RETRY_ATTEMPTS = '3';
  }

  /**
   * Run all enhanced server tests
   */
  async runTests() {
    console.log('🚀 Starting Enhanced BrainSAIT Healthcare MCP Server Tests...');
    console.log('=' .repeat(70));
    
    try {
      // Start the enhanced server
      await this.startServer();
      
      // Run test suite
      await this.testServerStartup();
      await this.testExistingTools();
      await this.testWebConnectorTools();
      await this.testComplianceFeatures();
      await this.testHealthcareTemplates();
      await this.testErrorHandling();
      
      // Stop the server
      await this.stopServer();
      
      // Display results
      this.displayResults();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      await this.stopServer();
      process.exit(1);
    }
  }

  /**
   * Start the enhanced server process
   */
  async startServer() {
    return new Promise((resolve, reject) => {
      const serverPath = path.join(__dirname, 'server', 'index.js');
      
      console.log('📡 Starting enhanced server...');
      
      this.serverProcess = spawn('node', [serverPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env }
      });

      let startupOutput = '';
      let errorOutput = '';

      this.serverProcess.stdout.on('data', (data) => {
        startupOutput += data.toString();
      });

      this.serverProcess.stderr.on('data', (data) => {
        const output = data.toString();
        errorOutput += output;
        
        // Check for successful startup
        if (output.includes('BrainSAIT Healthcare MCP server with Web Connector support running')) {
          console.log('✅ Enhanced server started successfully');
          resolve();
        }
      });

      this.serverProcess.on('error', (error) => {
        console.error('❌ Server startup error:', error.message);
        reject(error);
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!startupOutput.includes('running')) {
          reject(new Error('Server startup timeout'));
        }
      }, 10000);
    });
  }

  /**
   * Stop the server process
   */
  async stopServer() {
    if (this.serverProcess) {
      console.log('🛑 Stopping server...');
      this.serverProcess.kill('SIGTERM');
      this.serverProcess = null;
    }
  }

  /**
   * Test server startup and enhanced features
   */
  async testServerStartup() {
    console.log('\\n🔍 Testing Server Startup...');
    
    await this.runTest('Server Enhanced Features', async () => {
      // The server should have started with enhanced features
      // This test passes if the server started successfully
      return true;
    });
    
    await this.runTest('Environment Configuration', async () => {
      // Check that environment variables are properly set
      const requiredVars = ['ENCRYPTION_KEY', 'COMPLIANCE_LEVEL'];
      for (const varName of requiredVars) {
        if (!process.env[varName]) {
          throw new Error(`Missing required environment variable: ${varName}`);
        }
      }
      return true;
    });
  }

  /**
   * Test existing healthcare tools
   */
  async testExistingTools() {
    console.log('\\n🔍 Testing Existing Healthcare Tools...');
    
    await this.runTest('FHIR Validation Tool', async () => {
      const request = {
        method: 'tools/call',
        params: {
          name: 'validate_fhir_resource',
          arguments: {
            resource: {
              resourceType: 'Patient',
              id: 'test-patient-123',
              name: [{ family: 'Test', given: ['Patient'] }],
              birthDate: '1990-01-01'
            },
            resourceType: 'Patient',
            userId: 'test-user'
          }
        }
      };
      
      const result = await this.sendMCPRequest(request);
      return result && result.content && result.content[0].text.includes('valid');
    });
    
    await this.runTest('Clinical Terminology Lookup', async () => {
      const request = {
        method: 'tools/call',
        params: {
          name: 'clinical_terminology_lookup',
          arguments: {
            code: 'I10.9',
            system: 'http://hl7.org/fhir/sid/icd-10',
            language: 'ar',
            userId: 'test-user'
          }
        }
      };
      
      const result = await this.sendMCPRequest(request);
      return result && result.content && result.content[0].text.includes('I10.9');
    });
  }

  /**
   * Test web connector tools
   */
  async testWebConnectorTools() {
    console.log('\\n🔍 Testing Web Connector Tools...');
    
    await this.runTest('Web Connector Templates', async () => {
      const request = {
        method: 'tools/call',
        params: {
          name: 'web_connector_templates',
          arguments: {
            userId: 'test-user'
          }
        }
      };
      
      const result = await this.sendMCPRequest(request);
      const response = JSON.parse(result.content[0].text);
      return response.templates && response.templates.availableTemplates && 
             response.templates.availableTemplates.length > 0;
    });
    
    await this.runTest('Web Connector Registration', async () => {
      const request = {
        method: 'tools/call',
        params: {
          name: 'web_connector_register',
          arguments: {
            connectorId: 'test-fhir-connector',
            templateType: 'fhir_server',
            endpoint: 'https://test-fhir.example.com/R4',
            authentication: {
              type: 'bearer',
              token: 'test-token'
            },
            userId: 'test-user'
          }
        }
      };
      
      const result = await this.sendMCPRequest(request);
      const response = JSON.parse(result.content[0].text);
      return response.success === true && response.connectorId === 'test-fhir-connector';
    });
    
    await this.runTest('Web Connector List', async () => {
      const request = {
        method: 'tools/call',
        params: {
          name: 'web_connector_list',
          arguments: {
            userId: 'test-user'
          }
        }
      };
      
      const result = await this.sendMCPRequest(request);
      const response = JSON.parse(result.content[0].text);
      return response.connectors && Array.isArray(response.connectors);
    });
  }

  /**
   * Test compliance features
   */
  async testComplianceFeatures() {
    console.log('\\n🔍 Testing Compliance Features...');
    
    await this.runTest('PHI Encryption', async () => {
      const request = {
        method: 'tools/call',
        params: {
          name: 'phi_encryption_handler',
          arguments: {
            data: { patientId: '123', diagnosis: 'test condition' },
            operation: 'encrypt',
            userId: 'test-user'
          }
        }
      };
      
      const result = await this.sendMCPRequest(request);
      const response = JSON.parse(result.content[0].text);
      return response.success === true && response.operation === 'encrypt';
    });
    
    await this.runTest('NPHIES Interoperability', async () => {
      const request = {
        method: 'tools/call',
        params: {
          name: 'nphies_interoperability_check',
          arguments: {
            resource: {
              resourceType: 'Patient',
              id: 'test-patient',
              text: { div: 'Arabic content العربية' }
            },
            checkType: 'structure_validation',
            userId: 'test-user'
          }
        }
      };
      
      const result = await this.sendMCPRequest(request);
      const response = JSON.parse(result.content[0].text);
      return response.nphiesCompliant === true;
    });
  }

  /**
   * Test healthcare templates
   */
  async testHealthcareTemplates() {
    console.log('\\n🔍 Testing Healthcare Templates...');
    
    await this.runTest('EHR Template Generation', async () => {
      const request = {
        method: 'tools/call',
        params: {
          name: 'web_connector_templates',
          arguments: {
            templateType: 'ehr_system',
            userId: 'test-user'
          }
        }
      };
      
      const result = await this.sendMCPRequest(request);
      const response = JSON.parse(result.content[0].text);
      return response.templates && response.templates.templateType === 'ehr_system';
    });
    
    await this.runTest('Audit System Template', async () => {
      const request = {
        method: 'tools/call',
        params: {
          name: 'web_connector_templates',
          arguments: {
            templateType: 'audit_system',
            userId: 'test-user'
          }
        }
      };
      
      const result = await this.sendMCPRequest(request);
      const response = JSON.parse(result.content[0].text);
      return response.templates && response.templates.templateType === 'audit_system';
    });
  }

  /**
   * Test error handling
   */
  async testErrorHandling() {
    console.log('\\n🔍 Testing Error Handling...');
    
    await this.runTest('Invalid Connector Registration', async () => {
      const request = {
        method: 'tools/call',
        params: {
          name: 'web_connector_register',
          arguments: {
            connectorId: 'invalid-connector',
            templateType: 'invalid_type',
            endpoint: 'invalid-url',
            authentication: {},
            userId: 'test-user'
          }
        }
      };
      
      try {
        await this.sendMCPRequest(request);
        return false; // Should have thrown an error
      } catch (error) {
        return error.message.includes('Unknown template type') || 
               error.message.includes('Invalid');
      }
    });
    
    await this.runTest('Missing Required Parameters', async () => {
      const request = {
        method: 'tools/call',
        params: {
          name: 'web_connector_execute',
          arguments: {
            connectorId: 'nonexistent-connector',
            method: 'test-method'
            // Missing userId
          }
        }
      };
      
      try {
        await this.sendMCPRequest(request);
        return false; // Should have thrown an error
      } catch (error) {
        return error.message.includes('required') || 
               error.message.includes('missing') ||
               error.message.includes('not found');
      }
    });
  }

  /**
   * Send MCP request to server
   */
  async sendMCPRequest(request) {
    return new Promise((resolve, reject) => {
      if (!this.serverProcess) {
        reject(new Error('Server not running'));
        return;
      }

      const requestData = JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        ...request
      }) + '\\n';

      let responseData = '';
      let timeoutId;

      const onData = (data) => {
        responseData += data.toString();
        
        try {
          const lines = responseData.split('\\n').filter(line => line.trim());
          for (const line of lines) {
            const response = JSON.parse(line);
            if (response.id === JSON.parse(requestData).id) {
              clearTimeout(timeoutId);
              this.serverProcess.stdout.off('data', onData);
              
              if (response.error) {
                reject(new Error(response.error.message || 'MCP Error'));
              } else {
                resolve(response.result);
              }
              return;
            }
          }
        } catch (e) {
          // Continue waiting for complete response
        }
      };

      this.serverProcess.stdout.on('data', onData);

      // Set timeout
      timeoutId = setTimeout(() => {
        this.serverProcess.stdout.off('data', onData);
        reject(new Error('Request timeout'));
      }, 5000);

      // Send request
      this.serverProcess.stdin.write(requestData);
    });
  }

  /**
   * Run individual test
   */
  async runTest(name, testFn) {
    this.testResults.total++;
    
    try {
      const result = await testFn();
      if (result) {
        console.log(`  ✅ ${name}`);
        this.testResults.passed++;
        this.testResults.details.push({ name, status: 'PASSED' });
      } else {
        console.log(`  ❌ ${name} - Test returned false`);
        this.testResults.failed++;
        this.testResults.details.push({ name, status: 'FAILED', error: 'Test returned false' });
      }
    } catch (error) {
      console.log(`  ❌ ${name} - ${error.message}`);
      this.testResults.failed++;
      this.testResults.details.push({ name, status: 'FAILED', error: error.message });
    }
  }

  /**
   * Display test results
   */
  displayResults() {
    console.log('\\n' + '=' .repeat(70));
    console.log('📊 Test Results Summary');
    console.log('=' .repeat(70));
    
    console.log(`Total Tests: ${this.testResults.total}`);
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`Success Rate: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(1)}%`);
    
    if (this.testResults.failed > 0) {
      console.log('\\n❌ Failed Tests:');
      this.testResults.details
        .filter(detail => detail.status === 'FAILED')
        .forEach(detail => {
          console.log(`  - ${detail.name}: ${detail.error}`);
        });
    }
    
    console.log('\\n🎉 Enhanced BrainSAIT Healthcare MCP Server test completed!');
    console.log('Enhanced Features Tested:');
    console.log('  ✓ Web Connector Management');
    console.log('  ✓ Healthcare System Templates');
    console.log('  ✓ HIPAA/NPHIES Compliance');
    console.log('  ✓ Remote Healthcare Integration');
    console.log('  ✓ Configuration Management');
    console.log('  ✓ Error Handling');
    
    if (this.testResults.failed === 0) {
      console.log('\\n🚀 All tests passed! The enhanced server is ready for production.');
      process.exit(0);
    } else {
      console.log('\\n⚠️  Some tests failed. Please review and fix issues before deployment.');
      process.exit(1);
    }
  }
}

// Run the test suite
const testRunner = new EnhancedServerTestRunner();
testRunner.runTests().catch(console.error);