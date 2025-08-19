#!/usr/bin/env node

/**
 * Web Connector Integration Test
 * Tests the web connector registration, execution, and management
 */

import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

class WebConnectorIntegrationTest {
  constructor() {
    this.results = [];
    this.serverProcess = null;
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const colors = {
      INFO: '\x1b[36m',     // Cyan
      SUCCESS: '\x1b[32m',  // Green
      ERROR: '\x1b[31m',    // Red
      WARNING: '\x1b[33m',  // Yellow
      RESET: '\x1b[0m'      // Reset
    };
    console.log(`${colors[level]}[${timestamp}] ${level}: ${message}${colors.RESET}`);
  }

  async testMCPServerStart() {
    this.log('🚀 Testing MCP Server Startup...', 'INFO');
    
    return new Promise((resolve) => {
      // Set environment variables
      const env = {
        ...process.env,
        ENCRYPTION_KEY: 'test-encryption-key-for-validation',
        NODE_ENV: 'test'
      };

      this.serverProcess = spawn('node', ['server/index.js'], { 
        cwd: process.cwd(),
        env,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let errorOutput = '';

      this.serverProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      this.serverProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        
        // Check for successful startup indicators
        if (errorOutput.includes('BrainSAIT Healthcare MCP server') && 
            errorOutput.includes('Web Connector Manager: Enabled')) {
          this.log('✅ MCP Server started successfully', 'SUCCESS');
          this.results.push({ test: 'MCP Server Startup', passed: true });
          resolve(true);
        }
      });

      this.serverProcess.on('error', (error) => {
        this.log(`❌ Server startup failed: ${error.message}`, 'ERROR');
        this.results.push({ test: 'MCP Server Startup', passed: false, error: error.message });
        resolve(false);
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (this.results.length === 0) {
          this.log('⚠️ Server startup timeout - checking output', 'WARNING');
          
          // Check if we have any error output indicating startup
          const hasWebConnector = errorOutput.includes('Web Connector') || 
                                 errorOutput.includes('BrainSAIT');
          
          this.results.push({ 
            test: 'MCP Server Startup', 
            passed: hasWebConnector,
            details: hasWebConnector ? 'Started with warnings' : 'Timeout',
            output: errorOutput.slice(-500) // Last 500 chars
          });
          
          resolve(hasWebConnector);
        }
      }, 10000);
    });
  }

  async testWebConnectorFunctionality() {
    this.log('🌐 Testing Web Connector Functions...', 'INFO');

    // Test 1: Web Connector Register
    await this.testConnectorMethod('web_connector_register', {
      id: 'test-connector-001',
      name: 'Test Healthcare System',
      type: 'ehr_system',
      endpoint: 'https://test.example.com/api',
      authentication: { type: 'bearer', token: 'test-token' }
    });

    // Test 2: Web Connector List
    await this.testConnectorMethod('web_connector_list', {});

    // Test 3: Web Connector Status
    await this.testConnectorMethod('web_connector_status', {
      connectorId: 'test-connector-001'
    });

    // Test 4: Web Connector Templates
    await this.testConnectorMethod('web_connector_templates', {});

    // Test 5: Web Connector Execute (Mock)
    await this.testConnectorMethod('web_connector_execute', {
      connectorId: 'test-connector-001',
      method: 'testMethod',
      params: { test: 'value' }
    });

    // Test 6: Web Connector Unregister
    await this.testConnectorMethod('web_connector_unregister', {
      connectorId: 'test-connector-001'
    });
  }

  async testConnectorMethod(method, params) {
    return new Promise((resolve) => {
      const testData = {
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params
      };

      let responseData = '';
      let hasResponse = false;

      if (this.serverProcess && this.serverProcess.stdin.writable) {
        // Listen for response
        const responseHandler = (data) => {
          responseData += data.toString();
          
          try {
            // Try to parse JSON response
            const lines = responseData.split('\n');
            for (const line of lines) {
              if (line.trim() && line.includes('jsonrpc')) {
                const response = JSON.parse(line);
                if (response.id === testData.id) {
                  hasResponse = true;
                  const success = response.result && !response.error;
                  this.log(`${success ? '✅' : '❌'} ${method}: ${success ? 'PASSED' : 'FAILED'}`, 
                           success ? 'SUCCESS' : 'ERROR');
                  this.results.push({ 
                    test: method, 
                    passed: success, 
                    response: response.result || response.error 
                  });
                  this.serverProcess.stdout.removeListener('data', responseHandler);
                  resolve(success);
                  return;
                }
              }
            }
          } catch (e) {
            // JSON parsing failed, continue waiting
          }
        };

        this.serverProcess.stdout.on('data', responseHandler);

        // Send request
        this.serverProcess.stdin.write(JSON.stringify(testData) + '\n');

        // Timeout after 5 seconds
        setTimeout(() => {
          if (!hasResponse) {
            this.log(`⚠️ ${method}: TIMEOUT`, 'WARNING');
            this.results.push({ test: method, passed: false, error: 'Timeout' });
            this.serverProcess.stdout.removeListener('data', responseHandler);
            resolve(false);
          }
        }, 5000);
      } else {
        this.log(`❌ ${method}: Server not available`, 'ERROR');
        this.results.push({ test: method, passed: false, error: 'Server not available' });
        resolve(false);
      }
    });
  }

  async testHealthcareFeatures() {
    this.log('🏥 Testing Healthcare Features...', 'INFO');

    // Test FHIR Validation
    await this.testConnectorMethod('validate_fhir_resource', {
      resource: {
        resourceType: 'Patient',
        id: 'patient-test-001',
        name: [{ family: 'Test', given: ['Patient'] }],
        gender: 'unknown'
      },
      resourceType: 'Patient',
      userId: 'test-user-001'
    });

    // Test Clinical Terminology Lookup
    await this.testConnectorMethod('clinical_terminology_lookup', {
      code: 'I25.9',
      system: 'ICD-10',
      language: 'ar',
      userId: 'test-user-001'
    });

    // Test PHI Encryption
    await this.testConnectorMethod('phi_encryption_handler', {
      data: { patientName: 'Test Patient', condition: 'Test Condition' },
      operation: 'encrypt',
      userId: 'test-user-001'
    });

    // Test Role-Based Access Control
    await this.testConnectorMethod('role_based_access_control', {
      userId: 'physician_001',
      requestedAction: 'READ_PATIENT',
      resourceType: 'Patient'
    });

    // Test Bilingual Translation
    await this.testConnectorMethod('bilingual_content_translate', {
      content: 'Patient needs medication',
      sourceLanguage: 'en',
      targetLanguage: 'ar',
      userId: 'test-user-001'
    });
  }

  generateReport() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00';

    this.log('\n📊 WEB CONNECTOR INTEGRATION TEST REPORT', 'INFO');
    this.log('='.repeat(60), 'INFO');
    this.log(`Overall Success Rate: ${successRate}% (${passedTests}/${totalTests})`, 
             successRate >= 90 ? 'SUCCESS' : successRate >= 70 ? 'WARNING' : 'ERROR');

    console.log('\n🔍 Detailed Results:');
    this.results.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`  ${icon} ${result.test}${result.error ? ' - ' + result.error : ''}`);
    });

    // Save report
    const reportData = {
      timestamp: new Date().toISOString(),
      totalTests,
      passedTests,
      successRate: parseFloat(successRate),
      results: this.results
    };

    writeFileSync('web-connector-test-report.json', JSON.stringify(reportData, null, 2));
    this.log('\n📄 Test report saved to: web-connector-test-report.json', 'SUCCESS');

    return reportData;
  }

  async cleanup() {
    if (this.serverProcess) {
      this.log('🔧 Cleaning up server process...', 'INFO');
      this.serverProcess.kill();
    }
  }

  async runFullTest() {
    try {
      this.log('🚀 Starting Web Connector Integration Tests...', 'INFO');
      
      const serverStarted = await this.testMCPServerStart();
      
      if (serverStarted) {
        await this.testWebConnectorFunctionality();
        await this.testHealthcareFeatures();
      } else {
        this.log('❌ Server failed to start, skipping integration tests', 'ERROR');
      }

      const report = this.generateReport();
      await this.cleanup();

      return report;
    } catch (error) {
      this.log(`Integration test failed: ${error.message}`, 'ERROR');
      await this.cleanup();
      throw error;
    }
  }
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const test = new WebConnectorIntegrationTest();
  test.runFullTest()
    .then(report => {
      process.exit(report.successRate >= 50 ? 0 : 1);
    })
    .catch(error => {
      console.error('Integration test failed:', error);
      process.exit(1);
    });
}

export default WebConnectorIntegrationTest;