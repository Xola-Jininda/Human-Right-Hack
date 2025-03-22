"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera } from "@react-three/drei";
import { useRef, Suspense } from "react";

// Type definition for messages
interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

// Add type definitions for Botsonic
declare global {
  interface Window {
    botsonic_widget: string;
    Botsonic: (command: string, options: any, callback?: (response: any) => void) => void;
    [key: string]: any;
  }
}

export default function Home() {
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState("en");
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const fadeInUpVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12 
      } 
    }
  };

  const pulseVariants = {
    initial: {
      scale: 1,
      opacity: 1
    },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  // Botsonic configuration
  const BOTSONIC_SERVICE_BASE_URL = "https://api-azure.botsonic.ai";
  const BOTSONIC_TOKEN = "1ca6ae32-bb74-4141-bdf8-2f71c7e2a544";

  useEffect(() => {
    // Load Botsonic script dynamically
    (function (w: Window & typeof globalThis, d: Document, s: string, o: string, f: string) {
      let js: HTMLScriptElement;
      let fjs: Element | null;
      w["botsonic_widget"] = o;
      w[o] =
        w[o] ||
        function () {
          (w[o].q = w[o].q || []).push(arguments);
        };
      js = d.createElement(s) as HTMLScriptElement;
      fjs = d.getElementsByTagName(s)[0];
      js.id = o;
      js.src = f;
      js.async = true;
      fjs?.parentNode?.insertBefore(js, fjs);
    })(window, document, "script", "Botsonic", "https://widget.botsonic.com/CDN/botsonic.min.js");

    // Initialize Botsonic
    window.Botsonic("init", {
      serviceBaseUrl: BOTSONIC_SERVICE_BASE_URL,
      token: BOTSONIC_TOKEN,
    });

    // Optional: Sync messages with Botsonic if needed
    window.Botsonic("onMessage", (response: any) => {
      if (response && response.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data,
          sender: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    });

    const userLang = navigator.language.toLowerCase();
    if (userLang.startsWith("xh")) {
      setLanguage("xh");
    }
  }, []);

  const toggleEnlarge = () => {
    setIsEnlarged((prev: boolean) => !prev);
    // Optional: Adjust Botsonic widget size (if supported by Botsonic API)
    const widget = document.querySelector(".botsonic_widget_container") as HTMLElement;
    if (widget) {
      widget.style.width = isEnlarged ? "300px" : "100%";
      widget.style.height = isEnlarged ? "400px" : "80vh";
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 dark:from-blue-950 dark:via-indigo-900 dark:to-blue-900 p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] relative overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-red-300/20 dark:bg-red-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-40 left-20 w-[600px] h-[600px] bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-[90px]"></div>
      </div>

      {/* Replace 3D model section with a modern hero image/animation */}
      <motion.div 
        variants={fadeInUpVariants}
        className="w-full h-[400px] bg-gradient-to-r from-white/10 to-white/20 dark:from-gray-800/20 dark:to-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/30 dark:border-gray-700/30 relative my-12"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="relative w-64 h-64"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image
              src="/ambulance-modern.png" // Make sure to add this image to your public folder
              alt="Modern Ambulance Illustration"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
          
          {/* Animated circles */}
          <motion.div 
            className="absolute inset-0"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 border-2 border-red-500/30 rounded-full"></div>
            <div className="absolute inset-[15%] border-2 border-blue-500/30 rounded-full"></div>
            <div className="absolute inset-[30%] border-2 border-purple-500/30 rounded-full"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced feature cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
      >
        <motion.div 
          className="group relative bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-2xl p-8 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-xl overflow-hidden"
          whileHover={{ 
            y: -10,
            transition: { duration: 0.3 }
          }}
        >
          {/* Add hover effect gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-800/60 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-200 dark:group-hover:bg-red-700/60 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Rapid Response</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Our AI-powered dispatch system reduces response times by up to 30% in rural communities, ensuring critical care reaches patients faster.
            </p>
            <motion.a
              href="#learn-more"
              className="inline-flex items-center text-red-600 dark:text-red-400 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors"
              whileHover={{ x: 5 }}
            >
              Learn more <span className="ml-2">→</span>
            </motion.a>
          </div>
        </motion.div>

        <motion.div 
          className="group relative bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-2xl p-8 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-xl overflow-hidden"
          whileHover={{ 
            y: -10,
            transition: { duration: 0.3 }
          }}
        >
          {/* Add hover effect gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/60 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-700/60 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Remote Diagnostics</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Advanced telemedicine capabilities allow EMTs to connect with specialists for remote diagnostics and treatment guidance in the field.
            </p>
            <motion.a
              href="#features"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
              whileHover={{ x: 5 }}
            >
              Explore features <span className="ml-2">→</span>
            </motion.a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={fadeInUpVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
      >
        <motion.div 
          className="bg-white/30 dark:bg-gray-800/30 rounded-xl p-6 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-lg relative overflow-hidden group"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/60 flex items-center justify-center mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </motion.div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">GPS Mapping</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Advanced routing algorithms find the fastest path even in remote areas.</p>
        </motion.div>

        <motion.div 
          className="bg-white/30 dark:bg-gray-800/30 rounded-xl p-6 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-lg relative overflow-hidden group"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800/60 flex items-center justify-center mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Medical AI</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">AI assistance for first responders to guide emergency procedures.</p>
        </motion.div>

        <motion.div 
          className="bg-white/30 dark:bg-gray-800/30 rounded-xl p-6 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-lg relative overflow-hidden group"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800/60 flex items-center justify-center mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Satellite Communication</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Maintain connections even in areas with no cellular coverage.</p>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="flex gap-6 flex-col sm:flex-row justify-center w-full max-w-lg mx-auto"
      >
        <motion.a
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden flex-1 rounded-xl flex items-center justify-center bg-gradient-to-r from-red-600 to-blue-600 text-white gap-3 font-medium text-base h-14 px-7 shadow-lg group"
          href="#contact"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center gap-3">
            <motion.div 
              animate={{ 
                y: [0, -3, 0],
                rotate: [0, 5, 0, -5, 0] 
              }} 
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </motion.div>
            Request Demo
          </span>
        </motion.a>
        
        <motion.a
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden flex-1 rounded-xl flex items-center justify-center bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white gap-3 font-medium text-base h-14 px-7 shadow-md group"
          href="#documentation"
        >
          <span className="absolute inset-0 w-full h-full bg-white dark:bg-gray-800 opacity-0 group-hover:opacity-40 transition-opacity duration-300"></span>
          <span className="relative flex items-center gap-3">
            <motion.div animate={{ rotate: [0, 10, 0, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </motion.div>
            Documentation
          </span>
        </motion.a>
      </motion.div>
      
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="max-w-5xl mx-auto mt-24 relative z-10"
      >
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-lg">
          <h3 className="text-lg font-semibold mb-6 text-center text-gray-800 dark:text-white">EMS Rural Solutions</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <motion.a
              whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
              className="flex flex-col items-center gap-4 p-6 rounded-xl bg-white/20 dark:bg-gray-700/20 border border-white/30 dark:border-gray-600/30 transition-colors"
              href="#training"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/60 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <span className="text-gray-800 dark:text-gray-200 font-medium">Training</span>
            </motion.a>
            
            <motion.a
              whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
              className="flex flex-col items-center gap-4 p-6 rounded-xl bg-white/20 dark:bg-gray-700/20 border border-white/30 dark:border-gray-600/30 transition-colors"
              href="#case-studies"
            >
              <div className="w-10 h-10 bg-red-100 dark:bg-red-800/60 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-gray-800 dark:text-gray-200 font-medium">Case Studies</span>
            </motion.a>
            
            <motion.a
              whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
              className="flex flex-col items-center gap-4 p-6 rounded-xl bg-white/20 dark:bg-gray-700/20 border border-white/30 dark:border-gray-600/30 transition-colors"
              href="#contact-us"
            >
              <div className="w-10 h-10 bg-green-100 dark:bg-green-800/60 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-gray-800 dark:text-gray-200 font-medium">Contact Us</span>
            </motion.a>
          </div>
          
          <div className="mt-8 flex justify-center">
            <motion.p 
              className="text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Saving lives through technology ❤️
            </motion.p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
} 