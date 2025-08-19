# 🏥 BrainSAIT Healthcare MCP Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![FHIR R4](https://img.shields.io/badge/FHIR-R4-blue.svg)](https://hl7.org/fhir/R4/)
[![HIPAA](https://img.shields.io/badge/HIPAA-Compliant-red.svg)](https://www.hhs.gov/hipaa/)
[![NPHIES](https://img.shields.io/badge/NPHIES-Compatible-green.svg)](https://nphies.sa/)

A comprehensive **HIPAA/NPHIES compliant** Model Context Protocol (MCP) extension for healthcare applications with FHIR R4 support, clinical decision support, and bilingual Arabic/English capabilities for the BrainSAIT platform.

## ✨ Features

### 🔒 Healthcare Compliance
- **HIPAA Compliance**: Full audit logging and PHI encryption
- **NPHIES Integration**: Saudi healthcare interoperability standards
- **Role-Based Access Control**: Healthcare-specific permission management
- **Audit Logging**: Comprehensive tracking for compliance reporting

### 🏥 Clinical Capabilities
- **FHIR R4 Validation**: Complete resource validation and compliance checking
- **Clinical Terminology**: ICD-10, CPT, LOINC code lookup and validation
- **Clinical Decision Support**: AI-powered clinical guidance and recommendations
- **PHI Encryption**: AES-256-GCM encryption for protected health information

### 🌐 **NEW: Web Connector Integration**
- **Remote Healthcare Systems**: EHR, FHIR servers, Audit systems connectivity
- **Healthcare Templates**: Pre-built connectors (LIS, RIS, PIS, HIE)
- **Compliance Validation**: All remote connections maintain HIPAA/NPHIES compliance
- **Secure Communication**: Encrypted endpoints with audit trails

### 🌍 Internationalization
- **Bilingual Support**: Arabic/English medical content translation
- **Cultural Adaptation**: Saudi healthcare market requirements
- **Clinical Terminology Translation**: Medical terms in both languages

### 🛠️ Technical Features
- **MCP Protocol**: Native Claude Desktop integration
- **DXT Packaging**: Ready-to-install extension format
- **Comprehensive Testing**: Unit, integration, and compliance test suites
- **Automated Building**: Complete CI/CD pipeline

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** latest version
- **Claude Desktop** (for extension installation)

## ⚠️ CRITICAL REQUIREMENTS

**This extension requires specific environment variables to function correctly.**

### 🚨 Required Environment Variables

The following environment variables are **MANDATORY** for proper operation:

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| `ENCRYPTION_KEY` | ✅ **YES** | PHI data encryption (AES-256) | 32+ character string |
| `AUDIT_LOG_ENDPOINT` | ✅ **YES** | HIPAA compliance logging | `https://audit.brainsait.io/api/v1/logs` |
| `FHIR_BASE_URL` | ✅ **YES** | Healthcare data validation | `https://fhir.brainsait.io/r4` |
| `COMPLIANCE_LEVEL` | ✅ **YES** | Compliance framework | `HIPAA,NPHIES` |

### ⚡ Quick Validation

Before using the extension, run the requirements validator:

```bash
npm run validate:requirements
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Fadil369/brainsait-mcp-dxt.git
   cd brainsait-mcp-dxt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (CRITICAL)**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   # IMPORTANT: Set all REQUIRED variables before proceeding
   ```

4. **Validate requirements**
   ```bash
   npm run validate:requirements
   # Must pass before extension will work
   ```

5. **Build the extension**
   ```bash
   npm run build
   npm run dxt:pack
   ```

6. **Install in Claude Desktop**
   - Drag the generated `.dxt` file to Claude Desktop Settings > Extensions

## 📋 Configuration

### Required Environment Variables

```bash
# FHIR Server Configuration
FHIR_BASE_URL=https://fhir.brainsait.io/r4
FHIR_VERSION=4.0.1

# Security and Encryption (REQUIRED)
ENCRYPTION_KEY=your-aes-256-encryption-key-here
PHI_ENCRYPTION_ALGORITHM=aes-256-gcm

# Audit and Compliance (REQUIRED)
AUDIT_LOG_ENDPOINT=https://audit.brainsait.io/api/v1/logs
AUDIT_TOKEN=your-audit-service-token
COMPLIANCE_LEVEL=HIPAA,NPHIES

# Localization
DEFAULT_LANGUAGE=ar
SUPPORTED_LANGUAGES=ar,en
TIMEZONE=Asia/Riyadh

# NPHIES Integration (Saudi Arabia)
NPHIES_ENDPOINT=https://nphies.sa.gov/api/v1
NPHIES_CLIENT_ID=your-nphies-client-id
NPHIES_PROVIDER_ID=your-provider-id
```

## 🧰 Available Tools

The extension provides **14 specialized healthcare tools** including **6 new web connector tools** for remote healthcare system integration:

### 🏥 Core Healthcare Tools (8)
| Tool | Description | Use Case |
|------|-------------|----------|
| `validate_fhir_resource` | Validate FHIR R4 resources | Resource compliance checking |
| `clinical_terminology_lookup` | Look up medical codes | ICD-10, CPT, LOINC validation |
| `audit_log_query` | Query compliance logs | Security monitoring |
| `nphies_interoperability_check` | NPHIES validation | Saudi standards compliance |
| `clinical_decision_support` | AI clinical guidance | Clinical decision making |
| `bilingual_content_translate` | Medical translation | Arabic/English content |
| `phi_encryption_handler` | PHI data encryption | Data protection |
| `role_based_access_control` | Permission validation | Access management |

### 🌐 **NEW: Web Connector Tools (6)**
| Tool | Description | Use Case |
|------|-------------|----------|
| `web_connector_register` | Register healthcare system connectors | EHR, FHIR, Audit system setup |
| `web_connector_execute` | Execute remote healthcare operations | Cross-system data exchange |
| `web_connector_list` | List registered connectors | System inventory management |
| `web_connector_status` | Get connector health information | System monitoring |
| `web_connector_unregister` | Remove connectors safely | System decommissioning |
| `web_connector_templates` | Access healthcare templates | EHR, FHIR, LIS, RIS, PIS, HIE |

## 🏗️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm start               # Start production server

# Testing
npm test                # Run all tests
npm run test:unit       # Run unit tests only
npm run test:integration # Run integration tests
npm run test:compliance # Run compliance tests

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues

# Building
npm run build           # Full build process
npm run dxt:validate    # Validate DXT manifest
npm run dxt:pack        # Build DXT package

# Setup Scripts
./quick_setup.sh        # Quick environment setup
./build_script.sh       # Complete build with validation
```

### Project Structure

```
brainsait-mcp-dxt/
├── server/
│   └── index.js              # Main MCP server implementation
├── tests/
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── compliance/           # HIPAA/NPHIES compliance tests
├── assets/
│   ├── icons/                # Extension icons
│   └── screenshots/          # Documentation images
├── manifest.json             # DXT manifest configuration
├── package.json              # Node.js dependencies
├── build_script.sh           # Automated build process
├── quick_setup.sh            # Development setup
├── deployment_guide.txt      # Production deployment guide
└── CLAUDE.md                 # Claude Code guidance
```

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests**: Core functionality validation
- **Integration Tests**: MCP server communication
- **Compliance Tests**: HIPAA/NPHIES requirements
- **Performance Tests**: Load and stress testing

```bash
# Run specific test suites
npm run test:unit           # Fast unit tests
npm run test:integration    # MCP integration tests
npm run test:compliance     # Healthcare compliance tests
```

## 📚 Documentation

- **[Development Guide](./CLAUDE.md)** - Detailed development instructions
- **[Deployment Guide](./deployment_guide.txt)** - Production deployment
- **[API Documentation](./docs/)** - Tool and prompt references
- **[Issues](https://github.com/Fadil369/brainsait-mcp-dxt/issues)** - Bug reports and feature requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow HIPAA compliance requirements
- Maintain comprehensive audit logging
- Support Arabic/English bilingual content
- Include appropriate test coverage
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏥 Healthcare Compliance

This extension is designed to meet:

- **HIPAA** (Health Insurance Portability and Accountability Act)
- **NPHIES** (National Platform for Health Information Exchange - Saudi Arabia)
- **FHIR R4** (Fast Healthcare Interoperability Resources)
- **HL7** (Health Level Seven International) standards

## 🌍 BrainSAIT Platform

Part of the comprehensive BrainSAIT healthcare technology ecosystem, providing:

- **Unified Healthcare Platform**: Integrated clinical workflows
- **OID Tree Integration**: Object identifier management
- **Multi-language Support**: Arabic and English localization
- **Compliance Framework**: Regional healthcare standards

## 📞 Support

- **Technical Issues**: [GitHub Issues](https://github.com/Fadil369/brainsait-mcp-dxt/issues)
- **Documentation**: [GitHub Wiki](https://github.com/Fadil369/brainsait-mcp-dxt/wiki)
- **BrainSAIT Platform**: [https://brainsait.io](https://brainsait.io)

---

**Note**: This extension handles protected health information (PHI) and requires proper configuration of compliance settings. Always test in a development environment before deploying to production systems handling real patient data.

🚀 **Ready to deploy healthcare-compliant AI assistance!**