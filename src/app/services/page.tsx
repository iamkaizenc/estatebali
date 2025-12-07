"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Shield, FileText, Building2, Scale, Users, MessageCircle, Mail, 
  Phone, CheckCircle2, ArrowRight, Clock, FileCheck, Award, HeadphonesIcon
} from "lucide-react";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "17423798954";
const EMAIL = "info@estatebali.app";

const services = [
  {
    id: "visa",
    icon: Shield,
    title: "Visa Services",
    description: "Complete visa application assistance for your Bali stay",
    features: [
      "Tourist Visa Extension",
      "Business Visa Processing",
      "Social-Cultural Visa",
      "Visa-on-Arrival Assistance",
      "Visa Renewal Services"
    ],
    color: "from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400"
  },
  {
    id: "residency",
    icon: FileText,
    title: "Residency Permits",
    description: "Long-term residency solutions for expats and investors",
    features: [
      "KITAS (Temporary Stay Permit)",
      "KITAP (Permanent Stay Permit)",
      "Residency Documentation",
      "Sponsor Services",
      "Permit Renewal"
    ],
    color: "from-green-500/20 to-green-600/20",
    borderColor: "border-green-500/30",
    iconColor: "text-green-400"
  },
  {
    id: "company",
    icon: Building2,
    title: "Company Setup",
    description: "Establish your business presence in Indonesia",
    features: [
      "PT PMA Registration",
      "Local Company Setup",
      "Business License (SIUP)",
      "Tax Registration (NPWP)",
      "Corporate Bank Account"
    ],
    color: "from-purple-500/20 to-purple-600/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400"
  },
  {
    id: "legal",
    icon: Scale,
    title: "Legal Documentation",
    description: "Comprehensive legal services for property and business",
    features: [
      "Property Title Verification",
      "Legal Document Translation",
      "Contract Review & Drafting",
      "Notary Services",
      "Legal Consultation"
    ],
    color: "from-orange-500/20 to-orange-600/20",
    borderColor: "border-orange-500/30",
    iconColor: "text-orange-400"
  },
  {
    id: "relocation",
    icon: Users,
    title: "Relocation Support",
    description: "Smooth transition to your new life in Bali",
    features: [
      "Airport Pickup Service",
      "Temporary Accommodation",
      "School Enrollment Support",
      "Healthcare Registration",
      "Local Area Orientation"
    ],
    color: "from-pink-500/20 to-pink-600/20",
    borderColor: "border-pink-500/30",
    iconColor: "text-pink-400"
  }
];

const steps = [
  {
    number: "1",
    title: "Contact Us",
    description: "Reach out via WhatsApp or email",
    icon: MessageCircle
  },
  {
    number: "2",
    title: "Consultation",
    description: "Free initial consultation to understand your needs",
    icon: HeadphonesIcon
  },
  {
    number: "3",
    title: "Documentation",
    description: "We handle all paperwork and requirements",
    icon: FileCheck
  },
  {
    number: "4",
    title: "Completion",
    description: "Your service is processed and completed",
    icon: Award
  }
];

const handleWhatsApp = (serviceTitle?: string) => {
  const message = serviceTitle
    ? `Hi! I'm interested in ${serviceTitle}. Can you provide more information?`
    : "Hi! I would like to get information about your services in Bali.";
  
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="card p-8 bg-gradient-to-br from-dark-100 to-dark-200 border-2 border-orange-500/30 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium border border-orange-500/30">
                🚧 Coming Soon
              </span>
            </div>
            
            <div className="flex items-start gap-6 mb-6">
              <div className="p-4 bg-primary/20 rounded-xl">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3">Your Gateway to Living in Bali</h1>
                <p className="text-gray-300 text-lg mb-6">
                  Comprehensive visa, residency, and business setup services to make your Bali transition seamless.
                  Full service launching soon!
                </p>
                <button
                  onClick={() => handleWhatsApp()}
                  className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
                >
                  <MessageCircle className="h-5 w-5" />
                  Get Info on WhatsApp
                </button>
                <div className="mt-4 flex items-center gap-2 text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>+1 (742) 379-8954</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card p-6 bg-gradient-to-br ${service.color} border ${service.borderColor} hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 bg-${service.iconColor.replace('text-', '')}/20 rounded-xl`}>
                  <service.icon className={`h-6 w-6 ${service.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    {service.description}
                  </p>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleWhatsApp(service.title)}
                className="w-full px-4 py-2 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium border border-dark-300"
              >
                <MessageCircle className="h-4 w-4" />
                Ask About This
              </button>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">How It Works</h2>
            <p className="text-gray-400">Simple 4-step process to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="card p-6 text-center relative"
              >
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-600 z-10" />
                )}
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                </div>
                <div className="p-3 bg-dark-200 rounded-xl mb-4 inline-block">
                  <step.icon className="h-6 w-6 text-primary mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card p-8 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Ready to Get Started?</h2>
            <p className="text-gray-300">
              Contact us today to discuss your needs and get a personalized quote
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleWhatsApp()}
              className="btn-primary flex items-center gap-2 px-8 py-4"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </button>
            <a
              href={`mailto:${EMAIL}`}
              className="px-8 py-4 bg-dark-200 hover:bg-dark-300 rounded-xl transition-colors flex items-center gap-2 border border-dark-300"
            >
              <Mail className="h-5 w-5" />
              Send Email
            </a>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+1 (742) 379-8954</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{EMAIL}</span>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

