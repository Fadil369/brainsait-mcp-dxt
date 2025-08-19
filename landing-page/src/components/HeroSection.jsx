import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Globe, Database, Activity, Code } from 'lucide-react';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const floatVariants = {
    animate: {
      y: [-20, 20, -20],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const features = [
    { icon: Shield, text: "HIPAA/NPHIES Compliant", color: "text-emerald-400" },
    { icon: Zap, text: "14 Advanced Tools", color: "text-yellow-400" },
    { icon: Globe, text: "Web Connectors", color: "text-blue-400" },
    { icon: Database, text: "FHIR R4 Ready", color: "text-purple-400" }
  ];

  return (
    <motion.section 
      className="relative min-h-screen flex items-center justify-center px-6 py-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto text-center">
        {/* Main Hero Content */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brainsait-primary/10 border border-brainsait-primary/30 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Activity className="w-4 h-4 text-brainsait-primary" />
            <span className="text-sm font-medium text-white">Healthcare MCP Extension v2.0.0</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-br from-white via-brainsait-accent to-brainsait-primary bg-clip-text text-transparent leading-tight">
            BrainSAIT
            <br />
            <span className="text-5xl md:text-7xl">Healthcare MCP</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Enterprise-grade Model Context Protocol extension with advanced web connectors, 
            HIPAA/NPHIES compliance, and seamless healthcare system integration.
          </p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm"
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: "rgba(255,255,255,0.05)",
                borderColor: "rgba(124, 58, 237, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <feature.icon className={`w-4 h-4 ${feature.color}`} />
              <span className="text-sm font-medium text-white">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <motion.button
            className="group relative px-8 py-4 bg-gradient-to-r from-brainsait-primary to-brainsait-secondary rounded-lg font-semibold text-white text-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-brainsait-secondary to-brainsait-primary"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <motion.button
            className="group px-8 py-4 border-2 border-white/20 rounded-lg font-semibold text-white text-lg hover:border-brainsait-primary/50 transition-colors backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              View Demo
            </span>
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { number: "14", label: "Healthcare Tools", suffix: "" },
            { number: "7", label: "System Templates", suffix: "" },
            { number: "100", label: "Test Success", suffix: "%" },
            { number: "256", label: "AES Encryption", suffix: "-bit" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
              variants={floatVariants}
              animate="animate"
              style={{ animationDelay: `${index * 0.5}s` }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(124, 58, 237, 0.1)",
                borderColor: "rgba(124, 58, 237, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-3xl font-bold text-white mb-2">
                {stat.number}<span className="text-brainsait-accent">{stat.suffix}</span>
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          variants={itemVariants}
          animate={{
            y: [0, 10, 0],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;