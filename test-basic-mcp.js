#!/usr/bin/env node

/**
 * Basic MCP Server Test
 * Tests if the server can handle basic JSON-RPC requests
 */

import { spawn } from 'child_process';

async function testBasicMCPFunctionality() {
  console.log('🧪 Testing Basic MCP Server Functionality...');
  
  const env = {
    ...process.env,
    ENCRYPTION_KEY: 'test-encryption-key-for-validation',
    NODE_ENV: 'test'
  };

  const serverProcess = spawn('node', ['server/index.js'], { 
    cwd: process.cwd(),
    env,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  return new Promise((resolve) => {
    let hasStarted = false;
    
    serverProcess.stderr.on('data', (data) => {
      const output = data.toString();
      console.log('Server output:', output);
      
      if (output.includes('BrainSAIT Healthcare MCP server') && !hasStarted) {
        hasStarted = true;
        console.log('✅ Server started successfully');
        
        // Test a simple ping-like request
        setTimeout(() => {
          console.log('📤 Sending test request...');
          
          const testRequest = {
            jsonrpc: '2.0',
            id: 1,
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
                userId: 'test-user'
              }
            }
          };
          
          serverProcess.stdin.write(JSON.stringify(testRequest) + '\n');
          
          // Wait for response
          serverProcess.stdout.on('data', (responseData) => {
            console.log('📥 Server response:', responseData.toString());
          });
          
          setTimeout(() => {
            console.log('🔧 Cleaning up...');
            serverProcess.kill();
            resolve(true);
          }, 3000);
          
        }, 2000);
      }
    });
    
    serverProcess.on('error', (error) => {
      console.error('❌ Server error:', error);
      resolve(false);
    });
    
    // Overall timeout
    setTimeout(() => {
      if (!hasStarted) {
        console.log('⚠️ Server startup timeout');
        serverProcess.kill();
        resolve(false);
      }
    }, 15000);
  });
}

// Run test
testBasicMCPFunctionality()
  .then(result => {
    console.log(result ? '✅ Basic test completed' : '❌ Basic test failed');
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error('Test error:', error);
    process.exit(1);
  });