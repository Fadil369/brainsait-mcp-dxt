import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Clock,
  MessageSquare,
  Calendar,
  Users,
  Building,
  Globe
} from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    title: '',
    phone: '',
    country: '',
    organizationType: '',
    message: '',
    planInterest: 'professional',
    contactReason: 'demo'
  });

  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error
  const [errors, setErrors] = useState({});

  const organizationTypes = [
    'Hospital System',
    'Clinic/Medical Practice',
    'Healthcare Technology Company',
    'Pharmaceutical Company',
    'Insurance Provider',
    'Research Institution',
    'Government Health Agency',
    'Other'
  ];

  const planOptions = [
    { value: 'developer', label: 'Developer ($49/month)' },
    { value: 'professional', label: 'Professional ($149/month)' },
    { value: 'enterprise', label: 'Enterprise ($499/month)' },
    { value: 'global', label: 'Global Enterprise (Custom)' }
  ];

  const contactReasons = [
    { value: 'demo', label: 'Schedule a Demo' },
    { value: 'trial', label: 'Start Free Trial' },
    { value: 'pricing', label: 'Custom Pricing' },
    { value: 'integration', label: 'Integration Support' },
    { value: 'compliance', label: 'Compliance Questions' },
    { value: 'partnership', label: 'Partnership Inquiry' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormStatus('submitting');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFormStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        title: '',
        phone: '',
        country: '',
        organizationType: '',
        message: '',
        planInterest: 'professional',
        contactReason: 'demo'
      });
    } catch (error) {
      setFormStatus('error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get in touch with our healthcare specialists',
      contact: 'healthcare@brainsait.io',
      action: 'mailto:healthcare@brainsait.io'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: '24/7 enterprise support hotline',
      contact: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Global Offices',
      description: 'Serving healthcare organizations worldwide',
      contact: 'USA • Saudi Arabia • UAE',
      action: null
    }
  ];

  return (
    <section className="relative py-24 px-6" id="contact">
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
            Get Started Today
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to transform your healthcare organization with enterprise-grade MCP integration? 
            Let's discuss your specific requirements and get you started.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {formStatus === 'success' ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
                <p className="text-gray-300 mb-6">
                  We've received your inquiry and will get back to you within 24 hours.
                </p>
                <motion.button
                  className="bg-brainsait-primary text-white px-6 py-3 rounded-lg font-semibold"
                  onClick={() => setFormStatus('idle')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Another Message
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Our Team</h3>

                {/* Contact Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    How can we help you?
                  </label>
                  <select
                    name="contactReason"
                    value={formData.contactReason}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-brainsait-primary focus:outline-none"
                  >
                    {contactReasons.map(reason => (
                      <option key={reason.value} value={reason.value} className="bg-black">
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:border-brainsait-primary focus:outline-none ${
                        errors.name ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:border-brainsait-primary focus:outline-none ${
                        errors.email ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="john@healthcare.com"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Company and Title */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company/Organization *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:border-brainsait-primary focus:outline-none ${
                        errors.company ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="Healthcare Corp"
                    />
                    {errors.company && (
                      <p className="text-red-400 text-sm mt-1">{errors.company}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-brainsait-primary focus:outline-none"
                      placeholder="Chief Technology Officer"
                    />
                  </div>
                </div>

                {/* Organization Type and Plan Interest */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Organization Type
                    </label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-brainsait-primary focus:outline-none"
                    >
                      <option value="" className="bg-black">Select type...</option>
                      {organizationTypes.map(type => (
                        <option key={type} value={type} className="bg-black">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Plan of Interest
                    </label>
                    <select
                      name="planInterest"
                      value={formData.planInterest}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-brainsait-primary focus:outline-none"
                    >
                      {planOptions.map(plan => (
                        <option key={plan.value} value={plan.value} className="bg-black">
                          {plan.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:border-brainsait-primary focus:outline-none resize-none ${
                      errors.message ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Tell us about your healthcare integration needs, current systems, and any specific requirements..."
                  />
                  {errors.message && (
                    <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className={`w-full py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    formStatus === 'submitting'
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-brainsait-primary to-brainsait-secondary text-white hover:shadow-lg hover:shadow-brainsait-primary/25'
                  }`}
                  whileHover={formStatus !== 'submitting' ? { scale: 1.02 } : {}}
                  whileTap={formStatus !== 'submitting' ? { scale: 0.98 } : {}}
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>

                {formStatus === 'error' && (
                  <motion.div
                    className="flex items-center gap-2 text-red-400 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    There was an error sending your message. Please try again.
                  </motion.div>
                )}
              </form>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm"
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: "rgba(124, 58, 237, 0.1)" 
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="p-3 bg-brainsait-primary rounded-lg">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{info.title}</h4>
                      <p className="text-gray-400 text-sm mb-2">{info.description}</p>
                      {info.action ? (
                        <a 
                          href={info.action}
                          className="text-brainsait-accent hover:text-brainsait-primary transition-colors"
                        >
                          {info.contact}
                        </a>
                      ) : (
                        <span className="text-brainsait-accent">{info.contact}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Response Time Information */}
            <div className="bg-gradient-to-br from-brainsait-primary/20 to-brainsait-secondary/20 border border-brainsait-primary/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Response Times</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-brainsait-accent" />
                  <span className="text-gray-300 text-sm">
                    <strong>Sales Inquiries:</strong> Within 2 hours
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-brainsait-accent" />
                  <span className="text-gray-300 text-sm">
                    <strong>Technical Support:</strong> Within 4 hours
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-brainsait-accent" />
                  <span className="text-gray-300 text-sm">
                    <strong>Demo Scheduling:</strong> Same day
                  </span>
                </div>
              </div>
            </div>

            {/* Enterprise Support */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h4 className="text-lg font-semibold text-white mb-4">Enterprise Support</h4>
              <p className="text-gray-300 text-sm mb-4">
                Need immediate assistance? Our enterprise customers get priority support 
                with dedicated account managers and 24/7 technical support.
              </p>
              <motion.button
                className="bg-brainsait-primary text-white px-4 py-2 rounded-lg font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn About Enterprise Support
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;