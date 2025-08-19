import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  Globe, 
  MapPin, 
  CreditCard, 
  Shield, 
  Zap, 
  Users,
  Building,
  Crown,
  ArrowRight
} from 'lucide-react';

const PricingSection = () => {
  const [currency, setCurrency] = useState('USD'); // USD or SAR
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // monthly or annual

  const exchangeRate = 3.75; // 1 USD = 3.75 SAR (approximate)

  const formatPrice = (usdPrice) => {
    if (currency === 'SAR') {
      return `${(usdPrice * exchangeRate).toFixed(0)} ر.س`;
    }
    return `$${usdPrice}`;
  };

  const getAnnualDiscount = (monthlyPrice) => {
    const annualPrice = monthlyPrice * 10; // 2 months free
    return billingPeriod === 'annual' ? annualPrice : monthlyPrice;
  };

  const plans = [
    {
      name: 'Developer',
      description: 'Perfect for individual developers and small projects',
      monthlyPrice: 49,
      popular: false,
      icon: Zap,
      features: [
        '5 Web Connectors',
        'Basic HIPAA Compliance',
        'Standard Support',
        '10K API Calls/month',
        'Basic Analytics',
        'Email Support',
        'Community Access'
      ],
      limits: {
        connectors: 5,
        apiCalls: '10K',
        support: 'Email',
        sla: 'Best Effort'
      }
    },
    {
      name: 'Professional',
      description: 'Ideal for growing healthcare organizations',
      monthlyPrice: 149,
      popular: true,
      icon: Users,
      features: [
        '25 Web Connectors',
        'Full HIPAA/NPHIES Compliance',
        'Priority Support',
        '100K API Calls/month',
        'Advanced Analytics',
        'Phone & Email Support',
        'Custom Templates',
        'Audit Logging',
        'Multi-region Deployment'
      ],
      limits: {
        connectors: 25,
        apiCalls: '100K',
        support: 'Phone + Email',
        sla: '99.9% Uptime'
      }
    },
    {
      name: 'Enterprise',
      description: 'For large healthcare systems and enterprise deployments',
      monthlyPrice: 499,
      popular: false,
      icon: Building,
      features: [
        'Unlimited Web Connectors',
        'Enterprise HIPAA/NPHIES',
        'Dedicated Support Manager',
        '1M+ API Calls/month',
        'Real-time Analytics',
        '24/7 Phone Support',
        'Custom Development',
        'Advanced Audit & Compliance',
        'Multi-cloud Deployment',
        'White-label Options',
        'SLA Guarantees',
        'Training & Onboarding'
      ],
      limits: {
        connectors: 'Unlimited',
        apiCalls: '1M+',
        support: 'Dedicated Manager',
        sla: '99.99% Uptime'
      }
    },
    {
      name: 'Global Enterprise',
      description: 'For multinational healthcare organizations with custom requirements',
      monthlyPrice: null, // Custom pricing
      popular: false,
      icon: Crown,
      features: [
        'Everything in Enterprise',
        'Global Data Residency',
        'Custom Compliance Frameworks',
        'Dedicated Cloud Infrastructure',
        'Custom Integration Development',
        'Executive Support',
        'Regulatory Consulting',
        'Custom SLAs',
        'On-premise Deployment',
        'Advanced Security Features',
        'Compliance Certifications',
        'Global Support Coverage'
      ],
      limits: {
        connectors: 'Custom',
        apiCalls: 'Custom',
        support: 'Executive Level',
        sla: 'Custom SLA'
      }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
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
            Enterprise Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your healthcare organization. All plans include HIPAA compliance, 
            secure web connectors, and enterprise-grade support.
          </p>

          {/* Currency & Billing Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Currency Selector */}
            <div className="flex items-center gap-3 p-1 bg-white/10 rounded-lg border border-white/20">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  currency === 'USD'
                    ? 'bg-brainsait-primary text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setCurrency('USD')}
              >
                <Globe className="w-4 h-4" />
                USD ($)
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  currency === 'SAR'
                    ? 'bg-brainsait-primary text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setCurrency('SAR')}
              >
                <MapPin className="w-4 h-4" />
                SAR (ر.س)
              </button>
            </div>

            {/* Billing Period */}
            <div className="flex items-center gap-3 p-1 bg-white/10 rounded-lg border border-white/20">
              <button
                className={`px-4 py-2 rounded-md transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-brainsait-primary text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${
                  billingPeriod === 'annual'
                    ? 'bg-brainsait-primary text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setBillingPeriod('annual')}
              >
                Annual
                <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid lg:grid-cols-4 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative p-8 rounded-2xl border backdrop-blur-sm ${
                plan.popular
                  ? 'border-brainsait-primary bg-gradient-to-br from-brainsait-primary/20 to-brainsait-secondary/20'
                  : 'border-white/10 bg-white/5'
              }`}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              {plan.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-1 bg-gradient-to-r from-brainsait-primary to-brainsait-secondary px-4 py-2 rounded-full text-white text-sm font-medium">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </motion.div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  plan.popular ? 'bg-brainsait-primary' : 'bg-white/10'
                }`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8">
                {plan.monthlyPrice ? (
                  <>
                    <div className="text-4xl font-bold text-white mb-2">
                      {formatPrice(getAnnualDiscount(plan.monthlyPrice))}
                      <span className="text-lg text-gray-400 font-normal">
                        /{billingPeriod === 'annual' ? 'year' : 'month'}
                      </span>
                    </div>
                    {billingPeriod === 'annual' && (
                      <div className="text-sm text-green-400">
                        Save {formatPrice(plan.monthlyPrice * 2)} annually
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-4xl font-bold text-white mb-2">
                    Custom
                    <div className="text-lg text-gray-400 font-normal">
                      Contact Sales
                    </div>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brainsait-accent mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Plan Limits */}
              <div className="border-t border-white/10 pt-6 mb-8">
                <h4 className="text-sm font-semibold text-white mb-4">Plan Limits</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Connectors:</span>
                    <span className="text-white">{plan.limits.connectors}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">API Calls:</span>
                    <span className="text-white">{plan.limits.apiCalls}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Support:</span>
                    <span className="text-white">{plan.limits.support}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">SLA:</span>
                    <span className="text-white">{plan.limits.sla}</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-brainsait-primary to-brainsait-secondary text-white hover:shadow-lg hover:shadow-brainsait-primary/25'
                    : plan.monthlyPrice
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/25'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.monthlyPrice ? (
                  <span className="flex items-center justify-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Contact Sales
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3">
              <Shield className="w-8 h-8 text-brainsait-accent" />
              <h4 className="font-semibold text-white">Enterprise Security</h4>
              <p className="text-sm text-gray-400 text-center">
                SOC 2 Type II, HIPAA, and NPHIES compliant infrastructure
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <CreditCard className="w-8 h-8 text-brainsait-accent" />
              <h4 className="font-semibold text-white">Flexible Billing</h4>
              <p className="text-sm text-gray-400 text-center">
                Monthly or annual billing. Cancel anytime. No hidden fees.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <Users className="w-8 h-8 text-brainsait-accent" />
              <h4 className="font-semibold text-white">Expert Support</h4>
              <p className="text-sm text-gray-400 text-center">
                Dedicated healthcare IT specialists available 24/7
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-brainsait-primary/10 to-brainsait-secondary/10 border border-brainsait-primary/30 rounded-xl">
            <h4 className="text-xl font-semibold text-white mb-2">Need a Custom Solution?</h4>
            <p className="text-gray-300 mb-4">
              For healthcare organizations with unique requirements, we offer custom deployment options, 
              dedicated infrastructure, and specialized compliance frameworks.
            </p>
            <motion.button
              className="bg-brainsait-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brainsait-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Consultation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;