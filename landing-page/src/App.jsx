import React from 'react';
import { motion } from 'framer-motion';
import MeshBackground from './components/MeshBackground';
import HeroSection from './components/HeroSection';
import FeaturesShowcase from './components/FeaturesShowcase';
import WebConnectorsDemo from './components/WebConnectorsDemo';
import PricingSection from './components/PricingSection';
import ContactSection from './components/ContactSection';
import './styles/globals.css';

function App() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Mesh Background */}
      <MeshBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav 
          className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-brainsait-primary to-brainsait-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-brainsait-accent bg-clip-text text-transparent">
                  BrainSAIT MCP
                </span>
              </motion.div>
              
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#demo" className="text-gray-300 hover:text-white transition-colors">Demo</a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                <motion.button
                  className="bg-brainsait-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-brainsait-secondary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <HeroSection />

        {/* Features Showcase */}
        <div id="features">
          <FeaturesShowcase />
        </div>

        {/* Web Connectors Demo */}
        <div id="demo">
          <WebConnectorsDemo />
        </div>

        {/* Pricing Section */}
        <div id="pricing">
          <PricingSection />
        </div>

        {/* Contact Section */}
        <ContactSection />

        {/* Footer */}
        <motion.footer 
          className="relative py-16 px-6 border-t border-white/10 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-brainsait-primary to-brainsait-secondary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <span className="text-xl font-bold text-white">BrainSAIT Healthcare MCP</span>
                </div>
                <p className="text-gray-400 mb-6 max-w-md">
                  Enterprise-grade healthcare MCP extension with advanced web connectors, 
                  HIPAA/NPHIES compliance, and seamless integration capabilities.
                </p>
                <div className="flex gap-4">
                  <motion.button
                    className="bg-brainsait-primary text-white px-6 py-3 rounded-lg font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Start Free Trial
                  </motion.button>
                  <motion.button
                    className="border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:border-brainsait-primary/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Docs
                  </motion.button>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#demo" className="hover:text-white transition-colors">Web Connectors</a></li>
                  <li><a href="#features" className="hover:text-white transition-colors">Healthcare Tools</a></li>
                  <li><a href="#features" className="hover:text-white transition-colors">Compliance</a></li>
                  <li><a href="#demo" className="hover:text-white transition-colors">Integrations</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 BrainSAIT. All rights reserved.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;