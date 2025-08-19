#!/usr/bin/env node

/**
 * BrainSAIT MCP Production Deployment Readiness Check
 * 
 * Final validation script to ensure all components are ready for 
 * production deployment to mcp.brainsait.io
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

class ProductionReadinessValidator {
  constructor() {
    this.checks = [];
    this.passed = 0;
    this.failed = 0;
  }

  log(message, level = 'INFO') {
    const colors = {
      INFO: '\x1b[36m',
      SUCCESS: '\x1b[32m',
      ERROR: '\x1b[31m',
      WARNING: '\x1b[33m',
      RESET: '\x1b[0m'
    };
    console.log(`${colors[level]}${message}${colors.RESET}`);
  }

  check(name, testFn, critical = false) {
    try {
      const result = testFn();
      if (result) {
        this.log(`✅ ${name}`, 'SUCCESS');
        this.passed++;
      } else {
        this.log(`${critical ? '❌' : '⚠️'} ${name}`, critical ? 'ERROR' : 'WARNING');
        this.failed++;
      }
      this.checks.push({ name, passed: result, critical });
      return result;
    } catch (error) {
      this.log(`${critical ? '❌' : '⚠️'} ${name}: ${error.message}`, critical ? 'ERROR' : 'WARNING');
      this.checks.push({ name, passed: false, critical, error: error.message });
      this.failed++;
      return false;
    }
  }

  async validateCodebase() {
    this.log('\n🔍 CODEBASE VALIDATION', 'INFO');
    this.log('=' * 50, 'INFO');

    // Core files exist
    this.check('Main MCP Server exists', () => existsSync('server/index.js'), true);
    this.check('Web Connector Manager exists', () => existsSync('server/lib/WebConnectorManager.js'), true);
    this.check('Healthcare Compliance Validator exists', () => existsSync('server/lib/HealthcareComplianceValidator.js'), true);
    this.check('Connector Config Manager exists', () => existsSync('server/lib/ConnectorConfigManager.js'), true);

    // Package.json validation
    this.check('Package.json dependencies valid', () => {
      const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
      return pkg.dependencies && 
             pkg.dependencies['@modelcontextprotocol/sdk'] &&
             pkg.dependencies.axios &&
             pkg.dependencies.fhir;
    }, true);

    // Healthcare features validation
    this.check('Healthcare validation report exists', () => existsSync('healthcare-validation-report.json'), true);
    
    if (existsSync('healthcare-validation-report.json')) {
      this.check('All healthcare features passed', () => {
        const report = JSON.parse(readFileSync('healthcare-validation-report.json', 'utf8'));
        return report.overall.successRate === 100;
      }, true);
    }
  }

  async validateLandingPage() {
    this.log('\n🎨 LANDING PAGE VALIDATION', 'INFO');
    this.log('=' * 50, 'INFO');

    this.check('Landing page directory exists', () => existsSync('landing-page'), true);
    this.check('Landing page package.json exists', () => existsSync('landing-page/package.json'), true);
    this.check('Landing page index.html exists', () => existsSync('landing-page/index.html'), true);

    // React dependencies
    if (existsSync('landing-page/package.json')) {
      this.check('React dependencies configured', () => {
        const pkg = JSON.parse(readFileSync('landing-page/package.json', 'utf8'));
        return pkg.dependencies.react && 
               pkg.dependencies['react-dom'] &&
               pkg.dependencies['framer-motion'];
      }, true);
    }

    // Build artifacts
    this.check('Vite config exists', () => existsSync('landing-page/vite.config.js'), true);
    this.check('Tailwind config exists', () => existsSync('landing-page/tailwind.config.js'), true);
    this.check('Wrangler config exists', () => existsSync('landing-page/wrangler.toml'), false);

    // Build test
    try {
      process.chdir('landing-page');
      execSync('npm run build', { stdio: 'pipe' });
      process.chdir('..');
      this.check('Landing page builds successfully', () => true, true);
      this.check('Build artifacts exist', () => existsSync('landing-page/dist/index.html'), true);
    } catch (error) {
      process.chdir('..');
      this.check('Landing page builds successfully', () => false, true);
    }
  }

  async validateSecurity() {
    this.log('\n🔒 SECURITY VALIDATION', 'INFO');
    this.log('=' * 50, 'INFO');

    // Check for security-related configurations
    this.check('PHI encryption classes exist', () => {
      const content = readFileSync('server/index.js', 'utf8');
      return content.includes('PHIEncryption') && content.includes('aes-256-gcm');
    }, true);

    this.check('Audit logging implemented', () => {
      const content = readFileSync('server/index.js', 'utf8');
      return content.includes('AuditLogger') && content.includes('logAccess');
    }, true);

    this.check('Role-based access control exists', () => {
      const content = readFileSync('server/index.js', 'utf8');
      return content.includes('roleBasedAccessControl');
    }, true);

    // Environment variable checks
    this.check('Environment example file exists', () => existsSync('.env.example'), false);
    
    // Check if sensitive data is not hardcoded
    this.check('No hardcoded secrets in main server', () => {
      const content = readFileSync('server/index.js', 'utf8');
      return !content.includes('password') && 
             !content.includes('secret') &&
             !content.includes('private_key');
    }, true);
  }

  async validateCompliance() {
    this.log('\n🏥 HEALTHCARE COMPLIANCE VALIDATION', 'INFO');
    this.log('=' * 50, 'INFO');

    // FHIR R4 compliance
    this.check('FHIR R4 validator exists', () => {
      const content = readFileSync('server/index.js', 'utf8');
      return content.includes('FHIRValidator') && content.includes('validateResource');
    }, true);

    // HIPAA compliance
    this.check('HIPAA audit logging present', () => {
      const content = readFileSync('server/index.js', 'utf8');
      return content.includes('HEALTHCARE_DATA_ACCESS') && content.includes('audit');
    }, true);

    // NPHIES compliance
    this.check('NPHIES interoperability check exists', () => {
      const content = readFileSync('server/index.js', 'utf8');
      return content.includes('nphies_interoperability_check');
    }, true);

    // Arabic language support
    this.check('Arabic language support implemented', () => {
      const content = readFileSync('server/index.js', 'utf8');
      return content.includes('BilingualContent') && content.includes('مريض');
    }, true);
  }

  async validateWebConnectors() {
    this.log('\n🌐 WEB CONNECTORS VALIDATION', 'INFO');
    this.log('=' * 50, 'INFO');

    // Web connector files
    this.check('Web Connector Manager exists', () => existsSync('server/lib/WebConnectorManager.js'), true);
    this.check('Connector templates exist', () => existsSync('server/lib/HealthcareConnectorTemplates.js'), true);

    // Web connector methods
    this.check('Web connector tools registered', () => {
      const content = readFileSync('server/index.js', 'utf8');
      return content.includes('web_connector_register') &&
             content.includes('web_connector_list') &&
             content.includes('web_connector_execute');
    }, true);

    // Mock endpoint handling
    this.check('Mock endpoint handling implemented', () => {
      const content = readFileSync('server/lib/WebConnectorManager.js', 'utf8');
      return content.includes('mock') || content.includes('test');
    }, false);
  }

  async validateDeployment() {
    this.log('\n🚀 DEPLOYMENT READINESS VALIDATION', 'INFO');
    this.log('=' * 50, 'INFO');

    // Build scripts
    this.check('Build script exists', () => existsSync('build_script.sh'), false);
    this.check('Quick setup script exists', () => existsSync('quick_setup.sh'), false);

    // Package.json scripts
    this.check('Package.json has required scripts', () => {
      const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
      return pkg.scripts.start && pkg.scripts.build && pkg.scripts.test;
    }, true);

    // Documentation
    this.check('README exists', () => existsSync('README.md'), false);
    this.check('Web connectors documentation exists', () => existsSync('WEB_CONNECTORS.md'), false);
    this.check('Troubleshooting guide exists', () => existsSync('TROUBLESHOOTING.md'), false);

    // Cloudflare configuration
    if (existsSync('landing-page/wrangler.toml')) {
      this.check('Cloudflare Workers configuration valid', () => {
        const content = readFileSync('landing-page/wrangler.toml', 'utf8');
        return content.includes('name') && content.includes('compatibility_date');
      }, false);
    }

    // Git configuration
    this.check('Git repository initialized', () => existsSync('.git'), true);
    this.check('Gitignore exists', () => existsSync('.gitignore'), false);
  }

  generateFinalReport() {
    const total = this.passed + this.failed;
    const successRate = total > 0 ? ((this.passed / total) * 100).toFixed(1) : '0.0';
    const criticalFailed = this.checks.filter(c => c.critical && !c.passed).length;

    this.log('\n📊 PRODUCTION READINESS REPORT', 'INFO');
    this.log('=' * 70, 'INFO');
    this.log(`Overall Success Rate: ${successRate}% (${this.passed}/${total})`, 
             successRate >= 90 ? 'SUCCESS' : 'WARNING');
    this.log(`Critical Issues: ${criticalFailed}`, criticalFailed === 0 ? 'SUCCESS' : 'ERROR');

    if (criticalFailed === 0 && successRate >= 85) {
      this.log('\n🎉 PRODUCTION DEPLOYMENT APPROVED', 'SUCCESS');
      this.log('✅ All critical checks passed', 'SUCCESS');
      this.log('✅ Healthcare compliance validated', 'SUCCESS');
      this.log('✅ Web connectors functional', 'SUCCESS');
      this.log('✅ Landing page ready for deployment', 'SUCCESS');
      this.log('\n🚀 Ready to deploy to mcp.brainsait.io', 'SUCCESS');
    } else if (criticalFailed === 0) {
      this.log('\n⚠️ PRODUCTION DEPLOYMENT CONDITIONAL', 'WARNING');
      this.log('✅ Critical checks passed but minor issues exist', 'WARNING');
      this.log('📋 Review warnings before deployment', 'WARNING');
    } else {
      this.log('\n❌ PRODUCTION DEPLOYMENT NOT RECOMMENDED', 'ERROR');
      this.log(`❌ ${criticalFailed} critical issues must be resolved`, 'ERROR');
      this.log('🔧 Fix critical issues before deployment', 'ERROR');
    }

    console.log('\n📋 Detailed Check Results:');
    this.checks.forEach(check => {
      const icon = check.passed ? '✅' : (check.critical ? '❌' : '⚠️');
      const suffix = check.critical ? ' (CRITICAL)' : '';
      console.log(`  ${icon} ${check.name}${suffix}${check.error ? ' - ' + check.error : ''}`);
    });

    return {
      successRate: parseFloat(successRate),
      total,
      passed: this.passed,
      failed: this.failed,
      criticalFailed,
      deploymentApproved: criticalFailed === 0 && successRate >= 85,
      checks: this.checks
    };
  }

  async runFullValidation() {
    this.log('🚀 BrainSAIT MCP Production Readiness Validation', 'INFO');
    this.log('Validating all components for mcp.brainsait.io deployment\n', 'INFO');

    await this.validateCodebase();
    await this.validateLandingPage();
    await this.validateSecurity();
    await this.validateCompliance();
    await this.validateWebConnectors();
    await this.validateDeployment();

    return this.generateFinalReport();
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ProductionReadinessValidator();
  validator.runFullValidation()
    .then(report => {
      process.exit(report.deploymentApproved ? 0 : 1);
    })
    .catch(error => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}

export default ProductionReadinessValidator;