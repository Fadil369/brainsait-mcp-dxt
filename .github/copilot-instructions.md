# BrainSAIT Copilot Configuration Framework

🔧 CODE STANDARDS & PATTERNS

Architecture
- Domain-Driven Design (DDD) with structured directories: apps, packages, services, workers, infrastructure.

Naming Conventions
- Swift: PascalCase (types), camelCase (vars), MVVM.
- Python: snake_case, type hints required, FastAPI style.
- TypeScript: camelCase, strict typing, functional React.
- Healthcare: FHIR R4 resource naming, clinical terminology compliance.

Security (Mandatory)
- HIPAA & NPHIES compliance with full audit logging.
- Role-based permissions and access controls.
- End-to-end encryption for PHI.

⸻

🎨 UI & DESIGN SYSTEM

Branding
- Colors: Midnight Blue (#1a365d), Medical Blue (#2b6cb8), Signal Teal (#0ea5e9), Deep Orange (#ea580c), Professional Gray (#64748b).
- Glass morphism UI with adaptive RTL/LTR layouts.

UI Animations & Effects
- Library: @paper-design/shaders-react.
- MeshGradient Setup:
  1. Two stacked MeshGradient components.
  2. Speed differential → Primary (0.3) vs. Wireframe (0.2).
  3. Color anchors → Black + violet/purple accents + selective white.
  4. Wireframe opacity → 60% overlay for depth.
  5. Container → Black fallback with overflow: hidden.
- Additional Animations: motion/react for smooth transitions (60fps).

⸻

📦 DEPENDENCIES & TECH STACK

Frontend: SwiftUI (iOS), Next.js/React/Tailwind (web), React Native/Expo (cross-platform).
Backend: FastAPI, Cloudflare Workers, LangChain with OpenAI/Anthropic.
Infrastructure: Docker, Kubernetes, Cloudflare Tunnel, PostgreSQL, Redis.

Medical Libraries
- Python: fhir.resources, cryptography, audit-logger.
- TypeScript: @types/fhir, date-fns-tz, react-query.
- Swift: HealthKit, CryptoKit, Combine.

Bilingual UX
- Fonts: IBM Plex Sans Arabic, Inter.
- Tools: react-i18next, styled-components-rtl.

Environment Variables (Required)
- API tokens, encryption keys, DB URLs, compliance endpoints.

⸻

🧠 KNOWLEDGE BASE & DOMAIN EXPERTISE

Healthcare Compliance
- HIPAA: encryption, access controls, audit logs.
- NPHIES: Saudi interoperability, Arabic terminology.
- FHIR R4: strict validation, HL7 & DICOM integration.

Medical Domain Focus
- Specialties: Radiology, Laboratory, CDS.
- Standards: ICD-10, CPT, LOINC, DICOM.
- Saudi Context: Arabic clinical coding + NPHIES integration.

BrainSAIT Agents
- MASTERLINC: orchestration.
- HEALTHCARELINC: workflows.
- TTLINC: translation/localization.
- CLINICALLINC: decision support.
- COMPLIANCELINC: audit & compliance.

Business Context
- Users: Providers, patients, auditors, insurers.
- Scale: Enterprise-grade (1000+ concurrent users).
- Model: SaaS + API licensing.
- Region: Saudi → MENA → global.

⸻

💬 RESPONSE & OUTPUT STANDARDS

Code Generation Rules
- Always: role-based access, audit logging, bilingual support.
- Security-first: Encrypt PHI, validate permissions, log all access.
- Branding: BrainSAIT colors, mesh gradient, glass morphism.
- Performance: <2.5s load, 60fps UI, <100MB memory use.

Documentation Standards
- Detailed docstrings (args, returns, raises, examples).
- Bilingual examples (Arabic/English).

Comment Tags
- BRAINSAIT: HIPAA + Arabic RTL.
- MEDICAL: FHIR/clinical validation.
- NEURAL: Brand colors + morphism.
- BILINGUAL: Dual-language UI/UX.
- AGENT: AI workflow with guardrails.

Error Handling
- Comprehensive try/except with audit logging.
- Custom errors: ComplianceError, HealthcareAPIError.

Testing Requirements
- Unit tests for FHIR logic + clinical workflows.
- Integration tests for APIs.
- Accessibility (WCAG + RTL).
- Performance & security benchmarks.

UI Component Pattern
- Props: userRole, bilingualContent, complianceLevel.
- Built-in role validation + audit logs.
- RTL/LTR adaptive layouts.
