"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax and animation values
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  // Floating animations
  const [floatingY1, setFloatingY1] = useState(0);
  const [floatingY2, setFloatingY2] = useState(0);
  const [floatingX1, setFloatingX1] = useState(0);
  const [floatingX2, setFloatingX2] = useState(0);
  const [rotation1, setRotation1] = useState(0);
  const [rotation2, setRotation2] = useState(0);
  const [emergencyButtonPulse, setEmergencyButtonPulse] = useState(false);

  // Animation for floating background elements
  useEffect(() => {
    const interval1 = setInterval(() => {
      setFloatingY1(Math.sin(Date.now() / 2000) * 30);
      setFloatingX1(Math.sin(Date.now() / 3000) * 20);
      setRotation1(Math.sin(Date.now() / 4000) * 5);
    }, 50);

    const interval2 = setInterval(() => {
      setFloatingY2(Math.sin(Date.now() / 2500) * 25);
      setFloatingX2(Math.sin(Date.now() / 3500) * 15);
      setRotation2(Math.sin(Date.now() / 4500) * 3);
    }, 50);

    // Pulse emergency button periodically
    const interval3 = setInterval(() => {
      setEmergencyButtonPulse(true);
      setTimeout(() => setEmergencyButtonPulse(false), 1000);
    }, 5000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-white dark:from-gray-950 dark:via-indigo-950 dark:to-blue-950 font-sans relative overflow-hidden">
      {/* Dynamic background elements with parallax */}
      <motion.div 
        style={{ y: floatingY1, x: floatingX1, rotate: rotation1 }} 
        className="absolute top-0 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/10 to-indigo-400/10 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-full blur-3xl"
      />
      <motion.div 
        style={{ y: floatingY2, x: floatingX2, rotate: rotation2 }} 
        className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-red-300/10 to-pink-300/10 dark:from-red-500/10 dark:to-pink-500/10 rounded-full blur-3xl"
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center gap-2" 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-md bg-red-600 text-white flex items-center justify-center font-bold text-xl">
              E
            </div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">EMS-AI</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/dashboard" className="px-4 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard/ambulances" className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors text-white text-sm font-medium">
            Emergency Services
          </Link>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-16 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto">
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            AI-Powered <span className="text-red-600">Emergency</span> Response System
          </motion.h1>
          <motion.p 
            className="mt-4 text-lg text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Revolutionizing emergency medical services with cutting-edge AI technology. Faster response times, intelligent dispatch, and life-saving predictions.
          </motion.p>
          <motion.div 
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <motion.button 
              className={`px-6 py-3 rounded-full bg-red-600 text-white font-medium text-lg shadow-lg hover:shadow-red-500/20 transition-all hover:-translate-y-1 ${emergencyButtonPulse ? 'animate-pulse' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request Emergency Assistance
            </motion.button>
            <motion.button 
              className="px-6 py-3 rounded-full border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn How It Works
            </motion.button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex-1 relative h-[400px] w-full max-w-[500px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="relative h-full w-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-1">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-800/50 dark:to-indigo-800/50 z-0" />
              
              {/* Animated heart monitor line */}
              <motion.div 
                className="absolute top-1/2 left-0 right-0 h-1 bg-red-500 z-10"
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: [0, 0.2, 0.4, 1, 0.9, 0.3, 0.6, 0.5, 0.7, 0.4, 0.2, 0.1, 0],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: "loop",
                  times: [0, 0.1, 0.2, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
                }}
              />
              
              {/* Animated heart */}
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-9xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                ❤️
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="relative z-10 px-6 md:px-16 py-16 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Advanced Features for Life-Saving Response
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚑",
                title: "AI-Powered Dispatch",
                description: "Intelligent algorithms that optimize ambulance routing and reduce response time by up to 30%."
              },
              {
                icon: "🧠",
                title: "Predictive Analytics",
                description: "Machine learning systems that predict emergency hotspots before they occur."
              },
              {
                icon: "🏥",
                title: "Hospital Integration",
                description: "Seamless coordination with hospitals to prepare for incoming patients."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="text-4xl mb-4"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl flex items-center justify-center z-50"
        whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.4)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setChatbotOpen(true)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          delay: 1, 
          type: "spring", 
          stiffness: 400, 
          damping: 10 
        }}
      >
        <motion.span
          animate={{ scale: emergencyButtonPulse ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </motion.span>
      </motion.button>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {chatbotOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setChatbotOpen(false)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md h-[600px] max-h-[90vh] flex flex-col overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Chatbot Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">EMS Assistant</h3>
                    <p className="text-xs text-white/80">Online | Quick Response</p>
                  </div>
                </div>
                <button 
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  onClick={() => setChatbotOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Chatbot Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="max-w-[75%] bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      Hello! I'm your EMS assistance bot. Do you need emergency medical services?
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start flex-row-reverse gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <span className="text-sm font-semibold">Y</span>
                  </div>
                  <div className="max-w-[75%] bg-blue-500 text-white rounded-lg p-3">
                    <p className="text-sm">
                      I need information about your ambulance services.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="max-w-[75%] bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      Our ambulance services are available 24/7 with an average response time of 8 minutes. We have advanced life support capabilities and AI-powered dispatch. Would you like to book a non-emergency transport or report an emergency?
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quick action buttons */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 flex gap-2 overflow-x-auto">
                <motion.button
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-3 flex flex-col items-center min-w-[80px] border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-red-500 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">Emergency</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-3 flex flex-col items-center min-w-[80px] border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-blue-500 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">Schedule</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-3 flex flex-col items-center min-w-[80px] border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-green-500 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">Call</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-3 flex flex-col items-center min-w-[80px] border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-purple-500 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">FAQ</span>
                </motion.button>
              </div>
              
              {/* Chatbot Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
