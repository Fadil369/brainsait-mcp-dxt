# 🔧 BrainSAIT Healthcare MCP Extension - Troubleshooting Guide

## 🚨 "Extension may not work correctly" Error

This error appears when **critical environment variables are missing**. The extension cannot function without these requirements.

### Quick Fix Steps

1. **Run the requirements validator**
   ```bash
   npm run validate:requirements
   ```

2. **Check the validation output** for specific missing variables

3. **Set missing environment variables** in your `.env` file

### Common Issues

## ❌ Missing ENCRYPTION_KEY

**Error**: `ENCRYPTION_KEY is required for PHI protection`

**Solution**:
```bash
# Generate a secure encryption key
node -e "console.log('ENCRYPTION_KEY=' + crypto.randomBytes(32).toString('hex'))"
```

**Add to `.env`**:
```bash
ENCRYPTION_KEY=your-generated-key-here
```

## ❌ Missing AUDIT_LOG_ENDPOINT

**Error**: `AUDIT_LOG_ENDPOINT is required for HIPAA compliance`

**Solution**:
```bash
# Add to .env file
AUDIT_LOG_ENDPOINT=https://audit.brainsait.io/api/v1/logs
AUDIT_TOKEN=your-audit-token
```

## ❌ Missing FHIR_BASE_URL

**Error**: `FHIR_BASE_URL is required for healthcare operations`

**Solution**:
```bash
# Add to .env file
FHIR_BASE_URL=https://fhir.brainsait.io/r4
FHIR_VERSION=4.0.1
```

## ❌ Missing COMPLIANCE_LEVEL

**Error**: `COMPLIANCE_LEVEL is required`

**Solution**:
```bash
# Add to .env file
COMPLIANCE_LEVEL=HIPAA,NPHIES
```

## ⚠️ SSL/HTTPS Issues

**Error**: `AUDIT_LOG_ENDPOINT must use HTTPS for security`

**Solution**: Ensure all endpoints use HTTPS:
```bash
AUDIT_LOG_ENDPOINT=https://audit.brainsait.io/api/v1/logs  # ✅ Good
FHIR_BASE_URL=https://fhir.brainsait.io/r4                # ✅ Good
```

## 🔐 Encryption Issues

**Error**: `Encryption validation failed`

**Causes & Solutions**:

1. **Key too short**: Must be 32+ characters
   ```bash
   # Generate proper key
   node -e "console.log(crypto.randomBytes(32).toString('hex'))"
   ```

2. **Invalid characters**: Use only hex characters (0-9, a-f)

3. **Missing crypto module**: Ensure Node.js >= 18.0.0

## 📡 Service Connectivity Issues

**Error**: `Could not validate FHIR server connectivity`

**Solutions**:
1. **Check network connectivity**
2. **Verify FHIR server is running**
3. **Check firewall settings**
4. **Validate FHIR endpoint URL**

## 🌐 Language Configuration Issues

**Error**: `DEFAULT_LANGUAGE should be "ar" or "en"`

**Solution**:
```bash
# Add to .env file
DEFAULT_LANGUAGE=ar          # For Arabic
# OR
DEFAULT_LANGUAGE=en          # For English
SUPPORTED_LANGUAGES=ar,en
```

## 🏥 Healthcare Compliance Issues

**Error**: `COMPLIANCE_LEVEL must include HIPAA for healthcare use`

**Solution**:
```bash
# Correct compliance configuration
COMPLIANCE_LEVEL=HIPAA,NPHIES
```

## 📋 Complete Environment Template

Create a `.env` file with all required variables:

```bash
# === REQUIRED FOR BASIC OPERATION ===
ENCRYPTION_KEY=your-32-character-encryption-key-here
AUDIT_LOG_ENDPOINT=https://audit.brainsait.io/api/v1/logs
AUDIT_TOKEN=your-audit-service-token
FHIR_BASE_URL=https://fhir.brainsait.io/r4
COMPLIANCE_LEVEL=HIPAA,NPHIES

# === OPTIONAL CONFIGURATION ===
DEFAULT_LANGUAGE=ar
FHIR_VERSION=4.0.1
SUPPORTED_LANGUAGES=ar,en
TIMEZONE=Asia/Riyadh
NODE_ENV=production
LOG_LEVEL=info
```

## 🧪 Testing Your Configuration

After setting up your environment:

1. **Validate requirements**:
   ```bash
   npm run validate:requirements
   ```

2. **Run tests**:
   ```bash
   npm test
   ```

3. **Test extension loading**:
   - Install the `.dxt` file in Claude Desktop
   - Check for any error messages
   - Try using healthcare tools

## 🔍 Debug Mode

Enable debug logging:
```bash
LOG_LEVEL=debug
NODE_ENV=development
```

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the validation output** with `npm run validate:requirements`
2. **Review the logs** for specific error messages
3. **File an issue** at [GitHub Issues](https://github.com/Fadil369/brainsait-mcp-dxt/issues)
4. **Include the validation output** and error messages in your issue

## 🚀 Success Indicators

You'll know everything is working when:

✅ `npm run validate:requirements` shows **all green checkmarks**

✅ Extension loads without errors in Claude Desktop

✅ Healthcare tools respond correctly

✅ Audit logs are being generated

✅ FHIR validation works properly

---

💡 **Remember**: This is a healthcare extension requiring HIPAA compliance. All requirements exist for security and regulatory compliance reasons.