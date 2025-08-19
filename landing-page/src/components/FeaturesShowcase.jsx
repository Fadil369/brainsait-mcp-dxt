import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Database, 
  Zap, 
  Globe, 
  Lock, 
  Activity, 
  Code, 
  Users,
  CheckCircle2,
  ArrowRight,
  Monitor,
  Server,
  Cloud,
  Workflow,
  Settings,
  Bell
} from 'lucide-react';

const FeaturesShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 'security',
      name: 'Enterprise Security',
      icon: Shield,
      description: 'Military-grade encryption and compliance frameworks',
      color: 'from-emerald-500 to-teal-600',
      details: {
        title: 'HIPAA/NPHIES Compliant Security',
        subtitle: 'Zero-trust architecture with end-to-end encryption',
        capabilities: [
          'AES-256-GCM encryption for all data transmission',
          'OAuth2 and certificate-based authentication',
          'Comprehensive audit logging and monitoring',
          'SOC 2 Type II certified infrastructure',
          'Real-time threat detection and response',
          'Data residency compliance (US, EU, KSA)'
        ],
        metrics: [
          { label: 'Encryption Standard', value: 'AES-256-GCM' },
          { label: 'Compliance Frameworks', value: '6+' },
          { label: 'Security Certifications', value: 'SOC 2 Type II' },
          { label: 'Audit Retention', value: '7 Years' }
        ]
      }
    },
    {
      id: 'connectors',
      name: 'Web Connectors',
      icon: Globe,
      description: 'Seamless integration with healthcare systems worldwide',
      color: 'from-blue-500 to-indigo-600',
      details: {
        title: 'Advanced Healthcare Integration',
        subtitle: 'Connect to any healthcare system with pre-built templates',
        capabilities: [
          '7 pre-built healthcare system templates',
          'EHR, FHIR, LIS, RIS, PIS, HIE, and Audit connectors',
          'Real-time bidirectional data synchronization',
          'Custom connector development support',
          'Automatic failover and load balancing',
          'Multi-region deployment capabilities'
        ],
        metrics: [
          { label: 'System Templates', value: '7' },
          { label: 'Healthcare Standards', value: 'FHIR R4' },
          { label: 'Response Time', value: '<100ms' },
          { label: 'Uptime SLA', value: '99.99%' }
        ]
      }
    },
    {
      id: 'performance',
      name: 'High Performance',
      icon: Zap,
      description: 'Lightning-fast processing with enterprise scalability',
      color: 'from-yellow-500 to-orange-600',
      details: {
        title: 'Enterprise-Grade Performance',
        subtitle: 'Optimized for high-volume healthcare data processing',
        capabilities: [
          'Sub-100ms response times for critical operations',
          'Horizontal scaling across multiple regions',
          'Intelligent caching and data optimization',
          'Load balancing with automatic failover',
          'Real-time monitoring and alerting',
          'Performance analytics and insights'
        ],
        metrics: [
          { label: 'Response Time', value: '<100ms' },
          { label: 'Throughput', value: '10K+ req/sec' },
          { label: 'Availability', value: '99.99%' },
          { label: 'Data Processing', value: '1TB+/day' }
        ]
      }
    },
    {
      id: 'analytics',
      name: 'Advanced Analytics',
      icon: Activity,
      description: 'Real-time insights and comprehensive reporting',
      color: 'from-purple-500 to-violet-600',
      details: {
        title: 'Healthcare Data Intelligence',
        subtitle: 'Transform healthcare data into actionable insights',
        capabilities: [
          'Real-time dashboard with key metrics',
          'Custom report generation and scheduling',
          'Predictive analytics for patient outcomes',
          'Compliance monitoring and alerting',
          'Usage analytics and optimization recommendations',
          'Integration with BI tools and data warehouses'
        ],
        metrics: [
          { label: 'Data Points Tracked', value: '100+' },
          { label: 'Report Generation', value: 'Real-time' },
          { label: 'Analytics Retention', value: '2 Years' },
          { label: 'Dashboard Updates', value: 'Live' }
        ]
      }
    },
    {
      id: 'integration',
      name: 'Easy Integration',
      icon: Code,
      description: 'Simple APIs and comprehensive SDK support',
      color: 'from-pink-500 to-rose-600',
      details: {
        title: 'Developer-Friendly Integration',
        subtitle: 'Get up and running in minutes with our comprehensive tools',
        capabilities: [
          'RESTful APIs with OpenAPI 3.0 documentation',
          'SDKs for popular programming languages',
          'Webhook support for real-time notifications',
          'Sandbox environment for testing and development',
          'Code examples and integration guides',
          'Postman collections and API testing tools'
        ],
        metrics: [
          { label: 'API Endpoints', value: '50+' },
          { label: 'SDK Languages', value: '8' },
          { label: 'Documentation Pages', value: '200+' },
          { label: 'Integration Time', value: '<30 min' }
        ]
      }
    },
    {
      id: 'scalability',
      name: 'Enterprise Scalability',
      icon: Server,
      description: 'Built for global healthcare organizations',
      color: 'from-cyan-500 to-blue-600',
      details: {
        title: 'Global Healthcare Infrastructure',
        subtitle: 'Scale from small clinics to enterprise health systems',
        capabilities: [
          'Multi-tenant architecture with data isolation',
          'Auto-scaling based on demand and usage patterns',
          'Global CDN for optimal performance worldwide',
          'Disaster recovery with cross-region replication',
          'White-label deployment options',
          'Custom branding and domain configuration'
        ],
        metrics: [
          { label: 'Global Regions', value: '15+' },
          { label: 'Concurrent Users', value: '100K+' },
          { label: 'Data Centers', value: '50+' },
          { label: 'Recovery Time', value: '<5 min' }
        ]
      }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
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
            Enterprise Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the powerful capabilities that make BrainSAIT Healthcare MCP the 
            preferred choice for healthcare organizations worldwide.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Feature Navigation */}
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                  activeFeature === index
                    ? 'border-brainsait-primary bg-gradient-to-r from-brainsait-primary/20 to-brainsait-secondary/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
                variants={itemVariants}
                onClick={() => setActiveFeature(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color}`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {feature.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                  
                  <ArrowRight className={`w-5 h-5 transition-transform ${
                    activeFeature === index 
                      ? 'text-brainsait-primary transform rotate-90' 
                      : 'text-gray-400'
                  }`} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Details */}
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-8">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${features[activeFeature].color} mb-6`}>
                    {React.createElement(features[activeFeature].icon, { 
                      className: "w-8 h-8 text-white" 
                    })}
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {features[activeFeature].details.title}
                  </h3>
                  <p className="text-xl text-gray-300">
                    {features[activeFeature].details.subtitle}
                  </p>
                </div>

                {/* Capabilities */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Key Capabilities</h4>
                  <div className="space-y-3">
                    {features[activeFeature].details.capabilities.map((capability, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-brainsait-accent mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{capability}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  {features[activeFeature].details.metrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: "rgba(124, 58, 237, 0.1)" 
                      }}
                    >
                      <div className="text-2xl font-bold text-white mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-400">
                        {metric.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.div
                  className="mt-8 pt-6 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    className="w-full bg-gradient-to-r from-brainsait-primary to-brainsait-secondary text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn More About {features[activeFeature].name}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Additional Stats */}
        <motion.div
          className="mt-24 grid md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {[
            { icon: Users, label: "Healthcare Organizations", value: "500+" },
            { icon: Database, label: "Data Points Processed", value: "1B+" },
            { icon: Monitor, label: "System Integrations", value: "10K+" },
            { icon: Globe, label: "Countries Supported", value: "50+" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(124, 58, 237, 0.1)",
                borderColor: "rgba(124, 58, 237, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <stat.icon className="w-8 h-8 text-brainsait-accent mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;