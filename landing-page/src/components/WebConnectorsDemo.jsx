import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Activity, 
  FileText, 
  Microscope, 
  Scan, 
  Users, 
  Shield,
  Terminal,
  Play,
  CheckCircle,
  ArrowRight,
  Code,
  Globe
} from 'lucide-react';

const WebConnectorsDemo = () => {
  const [activeConnector, setActiveConnector] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [demoResults, setDemoResults] = useState([]);

  const connectors = [
    {
      id: 'ehr',
      name: 'EHR System',
      icon: Database,
      description: 'Electronic Health Records integration with Epic, Cerner, and Allscripts',
      endpoint: 'https://api.ehr-demo.brainsait.com',
      color: 'from-emerald-500 to-teal-600',
      features: ['Patient Records', 'Appointment Scheduling', 'Clinical Notes', 'Medication History'],
      demoCode: `// EHR Patient Data Retrieval
const patientData = await mcp.tools.ehr_patient_lookup({
  patientId: "P12345",
  includeHistory: true,
  compliance: "HIPAA"
});

console.log(patientData.demographics);
// → { name: "John Doe", age: 45, mrn: "MRN001" }`
    },
    {
      id: 'fhir',
      name: 'FHIR R4 Server',
      icon: Activity,
      description: 'Fast Healthcare Interoperability Resources standard compliance',
      endpoint: 'https://api.fhir-demo.brainsait.com',
      color: 'from-blue-500 to-indigo-600',
      features: ['Resource Bundles', 'SMART on FHIR', 'CDS Hooks', 'Bulk Data Export'],
      demoCode: `// FHIR Resource Query
const bundle = await mcp.tools.fhir_search({
  resourceType: "Patient",
  parameters: {
    name: "Smith",
    birthdate: "ge1980-01-01"
  }
});

console.log(\`Found \${bundle.total} patients\`);`
    },
    {
      id: 'lis',
      name: 'Laboratory System',
      icon: Microscope,
      description: 'Laboratory Information System for test results and analysis',
      endpoint: 'https://api.lis-demo.brainsait.com',
      color: 'from-purple-500 to-violet-600',
      features: ['Lab Results', 'Test Orders', 'Quality Control', 'Reference Ranges'],
      demoCode: `// Lab Results Query
const labResults = await mcp.tools.lis_results_query({
  patientId: "P12345",
  testType: "CBC",
  dateRange: "last-30-days"
});

console.log(labResults.criticalValues);
// → { hemoglobin: { value: 8.2, status: "LOW" } }`
    },
    {
      id: 'ris',
      name: 'Radiology System',
      icon: Scan,
      description: 'Radiology Information System for imaging studies and reports',
      endpoint: 'https://api.ris-demo.brainsait.com',
      color: 'from-orange-500 to-red-600',
      features: ['DICOM Images', 'Study Reports', 'Modality Worklist', 'PACS Integration'],
      demoCode: `// Radiology Study Search
const studies = await mcp.tools.ris_study_search({
  patientId: "P12345",
  modality: "CT",
  studyDate: "2024-01-15"
});

console.log(studies[0].findings);
// → "No acute findings. Normal chest CT."`
    },
    {
      id: 'pis',
      name: 'Pharmacy System',
      icon: FileText,
      description: 'Pharmacy Information System for medication management',
      endpoint: 'https://api.pis-demo.brainsait.com',
      color: 'from-pink-500 to-rose-600',
      features: ['Prescription Management', 'Drug Interactions', 'Inventory Control', 'Dosage Calculations'],
      demoCode: `// Medication History
const medications = await mcp.tools.pis_medication_history({
  patientId: "P12345",
  activeOnly: true
});

medications.forEach(med => {
  console.log(\`\${med.name}: \${med.dosage}\`);
});`
    },
    {
      id: 'hie',
      name: 'Health Information Exchange',
      icon: Globe,
      description: 'HIE for seamless data sharing across healthcare organizations',
      endpoint: 'https://api.hie-demo.brainsait.com',
      color: 'from-cyan-500 to-blue-600',
      features: ['Cross-Platform Data', 'Care Coordination', 'Provider Networks', 'Patient Consent'],
      demoCode: `// HIE Data Exchange
const exchangeData = await mcp.tools.hie_patient_summary({
  patientId: "P12345",
  organizationIds: ["ORG001", "ORG002"],
  dataTypes: ["allergies", "medications", "conditions"]
});

console.log(exchangeData.summary);`
    },
    {
      id: 'audit',
      name: 'Audit System',
      icon: Shield,
      description: 'Comprehensive audit logging for compliance and security monitoring',
      endpoint: 'https://api.audit-demo.brainsait.com',
      color: 'from-yellow-500 to-amber-600',
      features: ['Access Logging', 'Compliance Reports', 'Security Events', 'Risk Assessment'],
      demoCode: `// Audit Log Query
const auditLogs = await mcp.tools.audit_log_search({
  userId: "USER123",
  action: "PATIENT_ACCESS",
  timeframe: "last-24-hours"
});

console.log(\`\${auditLogs.length} access events logged\`);`
    }
  ];

  const runDemo = async () => {
    setIsRunning(true);
    setDemoResults([]);
    
    const connector = connectors[activeConnector];
    
    // Simulate API calls with realistic delays
    const steps = [
      { step: 'Initializing web connector...', delay: 500 },
      { step: `Connecting to ${connector.name}...`, delay: 800 },
      { step: 'Validating HIPAA compliance...', delay: 600 },
      { step: 'Authenticating with OAuth2...', delay: 700 },
      { step: 'Executing healthcare query...', delay: 900 },
      { step: 'Processing encrypted response...', delay: 400 },
      { step: 'Audit logging completed...', delay: 300 },
      { step: '✅ Demo completed successfully!', delay: 500 }
    ];

    for (const { step, delay } of steps) {
      await new Promise(resolve => setTimeout(resolve, delay));
      setDemoResults(prev => [...prev, { 
        text: step, 
        timestamp: new Date().toLocaleTimeString(),
        success: step.includes('✅')
      }]);
    }
    
    setIsRunning(false);
  };

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-brainsait-accent bg-clip-text text-transparent mb-6">
            Web Connectors Demo
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience seamless integration with healthcare systems through our advanced web connectors.
            Each connector provides secure, compliant access to critical healthcare data.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Connector Selection */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-white mb-6">Healthcare System Connectors</h3>
            
            {connectors.map((connector, index) => (
              <motion.div
                key={connector.id}
                className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                  activeConnector === index
                    ? 'border-brainsait-primary bg-brainsait-primary/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                onClick={() => setActiveConnector(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${connector.color}`}>
                    <connector.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{connector.name}</h4>
                    <p className="text-gray-400 text-sm mb-3">{connector.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {connector.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-white/10 text-gray-300 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {activeConnector === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="p-2"
                    >
                      <CheckCircle className="w-5 h-5 text-brainsait-primary" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Demo Interface */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Live Demo Console</h4>
                <motion.button
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    isRunning
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-brainsait-primary text-white hover:bg-brainsait-secondary'
                  }`}
                  onClick={runDemo}
                  disabled={isRunning}
                  whileHover={!isRunning ? { scale: 1.05 } : {}}
                  whileTap={!isRunning ? { scale: 0.95 } : {}}
                >
                  {isRunning ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Demo
                    </>
                  )}
                </motion.button>
              </div>

              {/* Demo Output */}
              <div className="bg-black/60 rounded-lg p-4 min-h-[300px] font-mono text-sm">
                <div className="text-green-400 mb-2">
                  $ brainsait-mcp demo --connector={connectors[activeConnector].id}
                </div>
                
                <AnimatePresence>
                  {demoResults.map((result, index) => (
                    <motion.div
                      key={index}
                      className={`mb-1 ${result.success ? 'text-green-400' : 'text-gray-300'}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-gray-500">[{result.timestamp}]</span> {result.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {!isRunning && demoResults.length === 0 && (
                  <div className="text-gray-500 text-center py-12">
                    Click "Run Demo" to test the {connectors[activeConnector].name} connector
                  </div>
                )}
              </div>
            </div>

            {/* Code Preview */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-brainsait-accent" />
                <h4 className="text-lg font-semibold text-white">Sample Integration Code</h4>
              </div>
              
              <div className="bg-black/60 rounded-lg p-4 font-mono text-sm">
                <pre className="text-gray-300 overflow-x-auto">
                  <code>{connectors[activeConnector].demoCode}</code>
                </pre>
              </div>
            </div>

            {/* Connector Details */}
            <motion.div
              className="bg-gradient-to-br from-brainsait-primary/10 to-brainsait-secondary/10 border border-brainsait-primary/30 rounded-xl p-6"
              key={activeConnector}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="text-lg font-semibold text-white mb-3">
                {connectors[activeConnector].name} Features
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                {connectors[activeConnector].features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brainsait-accent" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Terminal className="w-4 h-4" />
                  <span>Endpoint: {connectors[activeConnector].endpoint}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WebConnectorsDemo;