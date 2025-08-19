# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Commands

### Development
- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `./quick_setup.sh` - Quick setup for new environments
- `chmod +x build_script.sh && ./build_script.sh` - Full build process

### Testing
- `npm test` - Run all tests (unit, integration, compliance)
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests
- `npm run test:compliance` - Run HIPAA/NPHIES compliance tests

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run build` - Run lint + tests (build validation)

### DXT Extension Management
- `npm run dxt:init` - Initialize DXT configuration
- `npm run dxt:validate` - Validate manifest.json
- `npm run dxt:pack` - Build .dxt package for Claude Desktop

### Build Scripts
- `./build_script.sh` - Complete build with compliance validation
- `./build_script.sh test` - Run tests only
- `./build_script.sh lint` - Run linting only
- `./build_script.sh security` - Run security audit
- `./build_script.sh pack` - Build DXT package only

## Architecture

### BrainSAIT Healthcare MCP Extension
This is a Model Context Protocol (MCP) extension for healthcare applications with HIPAA/NPHIES compliance.

**Key Components:**
- **MCP Server** (`brainsait_mcp_server.js`) - Main server implementing healthcare-specific tools
- **FHIR R4 Validation** - Clinical resource validation with terminology support
- **Audit Logging** - HIPAA-compliant audit trails for all healthcare data access
- **PHI Encryption** - AES-256 encryption for protected health information
- **Bilingual Support** - Arabic/English medical content translation
- **NPHIES Integration** - Saudi healthcare interoperability standards

**Healthcare Tools Available:**
1. `validate_fhir_resource` - FHIR R4 resource validation
2. `clinical_terminology_lookup` - ICD-10, CPT, LOINC code lookup
3. `audit_log_query` - Compliance audit log querying
4. `nphies_interoperability_check` - NPHIES validation
5. `clinical_decision_support` - AI-powered clinical guidance
6. `bilingual_content_translate` - Medical content translation
7. `phi_encryption_handler` - PHI data encryption/decryption
8. `role_based_access_control` - Healthcare permission validation

### Environment Configuration
Required environment variables (see `.env.example`):
- `FHIR_BASE_URL` - FHIR R4 server endpoint
- `ENCRYPTION_KEY` - AES-256 key for PHI protection (REQUIRED)
- `AUDIT_LOG_ENDPOINT` - Compliance audit service (REQUIRED)
- `DEFAULT_LANGUAGE` - ar (Arabic) or en (English)
- `COMPLIANCE_LEVEL` - HIPAA,NPHIES (REQUIRED)

### File Structure
```
brainsait_mcp_server.js - Main MCP server with healthcare tools
brainsait_manifest.json - DXT manifest configuration
package_json.json - Node.js dependencies and scripts
build_script.sh - Automated build with compliance validation
quick_setup.sh - Development environment setup
test_suite.js - Comprehensive test suite (unit, integration, compliance)
deployment_guide.txt - Production deployment instructions
```

## Development Guidelines

### Healthcare Compliance
- All patient data must be encrypted with PHI encryption tools
- Audit logging is mandatory for all healthcare data access
- FHIR R4 resources must be validated before processing
- Arabic content support is required for NPHIES compliance

### Testing Requirements
- Unit tests for all FHIR validation functions
- Integration tests for MCP tool calls
- Compliance tests for HIPAA/NPHIES requirements
- Performance tests for concurrent healthcare data processing

### Security Considerations
- Never hardcode encryption keys or sensitive credentials
- Use role-based access control for all healthcare operations
- Validate all clinical terminology against standard code systems
- Implement comprehensive audit trails for compliance

### Code Patterns
- Use `ComplianceError` for HIPAA/NPHIES violations
- Use `HealthcareAPIError` for clinical API failures
- All tool calls must include `userId` for audit logging
- Bilingual content should support Arabic/English translation

## Integration with OID Portal System
This MCP extension integrates with the BrainSAIT OID portal system at `/Users/fadil369/02_BRAINSAIT_ECOSYSTEM/Unified_Platform/UNIFICATION_SYSTEM/brainSAIT-oid-system/oid-portal/src/pages/OidTree.jsx`. When working on healthcare features, ensure compatibility with the existing OID tree visualization and data structure.

## Special Considerations
- This is a healthcare-focused codebase requiring HIPAA compliance
- All changes must maintain audit logging capabilities
- FHIR R4 validation is critical for clinical interoperability
- Bilingual Arabic/English support is mandatory for Saudi market
- Performance testing is required for clinical workflow efficiency