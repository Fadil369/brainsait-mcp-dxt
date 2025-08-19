#!/bin/bash

# BrainSAIT Healthcare MCP Extension - Quick Setup Script
# BRAINSAIT: Automated setup for healthcare compliance

set -e

echo "🏥 BrainSAIT Healthcare MCP Extension - Quick Setup"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

# Function to check command availability
check_command() {
    if command -v $1 &> /dev/null; then
        print_status "$1 is available"
        return 0
    else
        print_error "$1 is not installed"
        return 1
    fi
}

# Function to check Node.js version
check_node_version() {
    if check_command node; then
        NODE_VERSION=$(node --version | sed 's/v//')
        REQUIRED_MAJOR=18
        CURRENT_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
        
        if [ "$CURRENT_MAJOR" -ge "$REQUIRED_MAJOR" ]; then
            print_status "Node.js version $NODE_VERSION meets requirements (>= 18.0.0)"
        else
            print_error "Node.js version $NODE_VERSION is too old. Please upgrade to >= 18.0.0"
            print_info "Visit: https://nodejs.org/en/download/"
            exit 1
        fi
    else
        print_error "Node.js is required but not installed"
        print_info "Visit: https://nodejs.org/en/download/"
        exit 1
    fi
}

# Function to install DXT CLI
install_dxt_cli() {
    print_info "Installing DXT CLI..."
    if npm list -g @anthropic-ai/dxt &> /dev/null; then
        print_status "DXT CLI already installed"
    else
        npm install -g @anthropic-ai/dxt
        print_status "DXT CLI installed successfully"
    fi
}

# Function to create project structure
create_project_structure() {
    print_info "Creating project structure..."
    
    # Create main directories
    mkdir -p server/lib
    mkdir -p tests/{unit,integration,compliance,e2e}
    mkdir -p assets/{icons,screenshots}
    mkdir -p docs
    mkdir -p config
    
    print_status "Project structure created"
}

# Function to create environment file template
create_env_template() {
    print_info "Creating environment configuration template..."
    
    cat > .env.example << 'EOF'
# BrainSAIT Healthcare MCP Extension - Environment Configuration
# BRAINSAIT: HIPAA/NPHIES compliance configuration

# FHIR Server Configuration
FHIR_BASE_URL=https://fhir.brainsait.com/r4
FHIR_VERSION=4.0.1

# Security and Encryption (REQUIRED)
ENCRYPTION_KEY=your-aes-256-encryption-key-here-32-chars
PHI_ENCRYPTION_ALGORITHM=aes-256-gcm

# Audit and Compliance (REQUIRED)
AUDIT_LOG_ENDPOINT=https://audit.brainsait.com/api/v1/logs
AUDIT_TOKEN=your-audit-service-token
AUDIT_RETENTION_DAYS=2555

# NPHIES Integration (Saudi Arabia)
NPHIES_ENDPOINT=https://nphies.sa.gov/api/v1
NPHIES_CLIENT_ID=your-nphies-client-id
NPHIES_CLIENT_SECRET=your-nphies-client-secret

# Localization
DEFAULT_LANGUAGE=ar
SUPPORTED_LANGUAGES=ar,en
TIMEZONE=Asia/Riyadh

# Compliance Levels (REQUIRED)
COMPLIANCE_LEVEL=HIPAA,NPHIES
HIPAA_COVERED_ENTITY=true
NPHIES_PROVIDER_ID=your-provider-id

# Performance and Limits
MAX_CONCURRENT_REQUESTS=100
REQUEST_TIMEOUT_MS=30000
MAX_AUDIT_BATCH_SIZE=1000

# Environment
NODE_ENV=development
LOG_LEVEL=info
DEBUG_MODE=false
EOF

    print_status "Environment template created (.env.example)"
    print_warning "Copy .env.example to .env and configure your settings"
}

# Function to initialize package.json if it doesn't exist
init_package_json() {
    if [ ! -f "package.json" ]; then
        print_info "Initializing package.json..."
        npm init -y
        print_status "package.json created"
    else
        print_status "package.json already exists"
    fi
}

# Function to install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    
    # Core dependencies
    npm install --save \
        @modelcontextprotocol/sdk \
        axios \
        uuid \
        zod
    
    # Development dependencies
    npm install --save-dev \
        @anthropic-ai/dxt \
        @types/jest \
        @types/node \
        eslint \
        eslint-config-standard \
        jest \
        supertest
    
    print_status "Dependencies installed"
}

# Function to create basic package.json scripts
add_npm_scripts() {
    print_info "Adding npm scripts..."
    
    # Create a temporary package.json with scripts
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.type = 'module';
    pkg.scripts = {
        'start': 'node server/index.js',
        'dev': 'node --watch server/index.js',
        'test': 'jest',
        'test:unit': 'jest --testPathPattern=tests/unit',
        'test:integration': 'jest --testPathPattern=tests/integration',
        'test:compliance': 'jest --testPathPattern=tests/compliance',
        'lint': 'eslint server/ --ext .js',
        'lint:fix': 'eslint server/ --ext .js --fix',
        'build': 'npm run lint && npm run test',
        'dxt:init': 'dxt init',
        'dxt:pack': 'dxt pack',
        'dxt:validate': 'dxt validate'
    };
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
    
    print_status "npm scripts added"
}

# Function to create basic ESLint config
create_eslint_config() {
    print_info "Creating ESLint configuration..."
    
    cat > .eslintrc.js << 'EOF'
module.exports = {
  env: {
    es2022: true,
    node: true,
    jest: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'no-console': 'warn',
    'no-unused-vars': 'error'
  }
};
EOF

    print_status "ESLint configuration created"
}

# Function to create Jest config
create_jest_config() {
    print_info "Creating Jest configuration..."
    
    cat > jest.config.js << 'EOF'
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
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
  ]
};
EOF

    print_status "Jest configuration created"
}

# Function to create gitignore
create_gitignore() {
    print_info "Creating .gitignore..."
    
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Build outputs
dist/
build/
*.dxt

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary files
tmp/
temp/

# Test files
test-results/

# DXT build artifacts
manifest.json.backup
EOF

    print_status ".gitignore created"
}

# Function to display next steps
show_next_steps() {
    echo ""
    print_info "🎉 Setup completed successfully!"
    echo ""
    print_info "Next steps:"
    echo "1. Copy .env.example to .env and configure your settings:"
    echo "   cp .env.example .env"
    echo "   nano .env  # Edit configuration"
    echo ""
    echo "2. Place your manifest.json and server files in the project"
    echo ""
    echo "3. Install and test the extension:"
    echo "   npm run dxt:init    # Initialize DXT configuration"
    echo "   npm run build       # Build and test"
    echo "   npm run dxt:pack    # Create .dxt package"
    echo ""
    echo "4. Install in Claude Desktop:"
    echo "   - Drag the .dxt file to Claude Desktop Settings > Extensions"
    echo ""
    print_info "Documentation: https://docs.brainsait.com/mcp-extensions"
    print_info "Support: https://support.brainsait.com"
}

# Main setup process
main() {
    print_info "Starting BrainSAIT Healthcare MCP Extension setup..."
    echo ""
    
    # System checks
    print_info "Checking system requirements..."
    check_node_version
    check_command npm
    check_command git
    
    # Install global tools
    install_dxt_cli
    
    # Project setup
    create_project_structure
    init_package_json
    add_npm_scripts
    install_dependencies
    
    # Configuration files
    create_env_template
    create_eslint_config
    create_jest_config
    create_gitignore
    
    # Show next steps
    show_next_steps
}

# Run setup
main "$@"
