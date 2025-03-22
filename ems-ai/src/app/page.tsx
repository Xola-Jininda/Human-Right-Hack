"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Phone, Clock, MessageCircle, X, Send, ChevronDown, AlertTriangle } from 'lucide-react';

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can we assist you today?", sender: "bot" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Simple section detection
      const homeSection = document.getElementById('home');
      const servicesSection = document.getElementById('services');
      const emergencySection = document.getElementById('emergency');
      const aboutSection = document.getElementById('about');
      
      const scrollPosition = window.scrollY + 100;
      
      if (aboutSection && scrollPosition >= aboutSection.offsetTop) {
        setActiveSection('about');
      } else if (emergencySection && scrollPosition >= emergencySection.offsetTop) {
        setActiveSection('emergency');
      } else if (servicesSection && scrollPosition >= servicesSection.offsetTop) {
        setActiveSection('services');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    
    // Add user message
    const userMsgId = messages.length + 1;
    setMessages([...messages, { id: userMsgId, text: newMessage, sender: "user" }]);
    setNewMessage("");
    
    // Simulate bot response
    setTimeout(() => {
      let botResponse = "Thank you for your message. Our team will get back to you shortly.";
      
      if (newMessage.toLowerCase().includes("emergency")) {
        botResponse = "For medical emergencies, please call 911 immediately. Do not wait for a chat response.";
      } else if (newMessage.toLowerCase().includes("appointment") || newMessage.toLowerCase().includes("schedule")) {
        botResponse = "To schedule an appointment, please provide your preferred date, time, and the type of service needed.";
      } else if (newMessage.toLowerCase().includes("location") || newMessage.toLowerCase().includes("address")) {
        botResponse = "Our main facility is located at 123 Medical Center Drive. We also have satellite locations throughout the city.";
      }
      
      setMessages(prev => [...prev, { id: prev.length + 1, text: botResponse, sender: "bot" }]);
    }, 1000);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>LifeLine EMS - Emergency Medical Services</title>
        <meta name="description" content="Professional emergency medical services available 24/7" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation Bar */}
      <motion.nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-md py-2' 
            : 'bg-transparent py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-red-600 font-bold text-2xl mr-2">LifeLine</span>
            <span className="text-blue-600 font-bold text-2xl">EMS</span>
          </motion.div>
          
          <ul className="hidden md:flex space-x-8">
            {['home', 'services', 'emergency', 'about'].map((section) => (
              <motion.li 
                key={section}
                className={`cursor-pointer ${activeSection === section ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                whileHover={{ scale: 1.1 }}
                onClick={() => scrollToSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.li>
            ))}
          </ul>
          
          <motion.button
            className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center"
            whileHover={{ scale: 1.05, backgroundColor: "#e53e3e" }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone size={16} className="mr-2" />
            <span className="font-medium">Emergency: 911</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-red-900/10 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        ></motion.div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-blue-500/20"
              initial={{ 
                x: Math.random() * 100 - 50, 
                y: Math.random() * 100 - 50,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ 
                repeat: Infinity,
                duration: Math.random() * 10 + 10,
                ease: "linear" 
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center relative z-10">
          <motion.div 
            className="lg:w-1/2 mb-10 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Emergency Care When <span className="text-red-600">You Need It Most</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-lg">
              Professional emergency medical services available 24/7. Our team of certified professionals is ready to respond to any medical emergency.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <motion.button
                className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center"
                whileHover={{ scale: 1.05, backgroundColor: "#3182ce" }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone size={18} className="mr-2" />
                <span className="font-medium">Contact Us</span>
              </motion.button>
              <motion.button
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-full shadow-lg flex items-center"
                whileHover={{ scale: 1.05, borderColor: "#3182ce", color: "#3182ce" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('services')}
              >
                <span className="font-medium">Our Services</span>
                <ChevronDown size={18} className="ml-2" />
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div 
              className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <img 
                src="/api/placeholder/600/400" 
                alt="Emergency Medical Service" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-white font-medium">Units Available Now</span>
                </div>
                <h2 className="text-white text-2xl font-bold">Rapid Response Team</h2>
                <p className="text-gray-200 mt-2">Average response time: 8 minutes</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating Stats */}
        <div className="container mx-auto px-4 mt-16">
          <motion.div 
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {[
              { icon: <Clock className="text-blue-600" size={32} />, stat: "24/7", text: "Emergency Service" },
              { icon: <Heart className="text-red-600" size={32} />, stat: "98%", text: "Patient Satisfaction" },
              { icon: <AlertTriangle className="text-yellow-500" size={32} />, stat: "8 min", text: "Average Response Time" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="mr-4">{item.icon}</div>
                <div>
                  <div className="text-3xl font-bold text-gray-800">{item.stat}</div>
                  <div className="text-gray-600">{item.text}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-blue-200/30 blur-3xl"
            animate={{ 
              x: [0, 30, 0],
              y: [0, 15, 0],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut" 
            }}
            style={{ top: '10%', right: '5%' }}
          />
          <motion.div
            className="absolute w-64 h-64 rounded-full bg-red-200/20 blur-3xl"
            animate={{ 
              x: [0, -20, 0],
              y: [0, 10, 0],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 10,
              ease: "easeInOut" 
            }}
            style={{ bottom: '5%', left: '10%' }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Emergency Services</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive emergency medical services with state-of-the-art equipment and highly trained professionals.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Emergency Response", desc: "Rapid response to medical emergencies with fully equipped ambulances and trained paramedics." },
              { title: "Critical Care Transport", desc: "Specialized transport for critically ill patients between medical facilities." },
              { title: "Advanced Life Support", desc: "Expert care for cardiac arrests, severe injuries, and other life-threatening conditions." },
              { title: "Medical Standby", desc: "On-site medical support for events, sporting activities, and public gatherings." },
              { title: "Disaster Response", desc: "Coordinated emergency services during natural disasters and major incidents." },
              { title: "Community Training", desc: "CPR, first aid, and emergency preparedness training for community members." }
            ].map((service, index) => (
              <motion.div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "rgba(255, 255, 255, 0.95)"
                }}
              >
                <motion.div 
                  className="h-3 bg-blue-600"
                  whileHover={{ height: "6px" }}
                ></motion.div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                  <motion.button
                    className="mt-4 text-blue-600 font-medium flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    Learn more
                    <ChevronDown size={16} className="ml-1 transform rotate-270" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Call To Action */}
      <section id="emergency" className="py-20 bg-gradient-to-r from-red-600 to-red-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full bg-black/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full bg-white/5"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 8 + i,
                delay: i * 0.5,
                ease: "easeInOut" 
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="flex flex-col lg:flex-row items-center justify-between"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="lg:w-2/3 mb-10 lg:mb-0">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                In Case of Emergency <br />Call <span className="text-4xl md:text-5xl">911</span> Immediately
              </motion.h2>
              <motion.p 
                className="mt-4 text-lg max-w-2xl opacity-90"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Our emergency response team is available 24/7. For non-urgent inquiries, 
                use our contact form or chat assistant below.
              </motion.p>
              
              <motion.div 
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="bg-white text-red-600 px-6 py-3 rounded-full shadow-lg flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone size={18} className="mr-2" />
                  <span className="font-medium">Call Now: 911</span>
                </motion.div>
                <motion.div 
                  className="border-2 border-white text-white px-6 py-3 rounded-full shadow-lg flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setChatOpen(true)}
                >
                  <MessageCircle size={18} className="mr-2" />
                  <span className="font-medium">Chat with Support</span>
                </motion.div>
              </motion.div>
            </div>
            
            <motion.div 
              className="lg:w-1/3 flex justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-ping-slow"></div>
                <div className="absolute inset-4 bg-white opacity-20 rounded-full animate-ping-medium"></div>
                <div className="absolute inset-8 bg-white opacity-20 rounded-full animate-ping-fast"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white text-red-600 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl">
                    <Phone size={64} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">About LifeLine EMS</h2>
              <p className="text-lg text-gray-600 mb-6">
                LifeLine EMS has been providing exceptional emergency medical services to our community for over 25 years. 
                Our mission is to deliver rapid, professional, and compassionate care when you need it most.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our team consists of certified paramedics, emergency medical technicians, and support staff who undergo 
                continuous training to stay at the forefront of emergency medical care.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold text-xl">25+</span>
                  </div>
                  <div>
                    <span className="block text-gray-800 font-medium">Years of Experience</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-red-600 font-bold text-xl">50+</span>
                  </div>
                  <div>
                    <span className="block text-gray-800 font-medium">Certified Professionals</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i}
                    className="rounded-xl overflow-hidden shadow-lg"
                    whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 1 : -1 }}
                  >
                    <img 
                      src={`/api/placeholder/300/300`} 
                      alt={`Emergency Service Image ${i}`} 
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LifeLine EMS</h3>
              <p className="text-gray-400 mb-4">
                Professional emergency medical services available 24/7.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram'].map((social) => (
                  <motion.a 
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center"
                    whileHover={{ y: -3, backgroundColor: "#3182ce" }}
                  >
                    <span className="sr-only">{social}</span>
                    {/* Icon placeholders */}
                    <div className="w-5 h-5 bg-white rounded-sm"></div>
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Services</h3>
              <ul className="space-y-2">
                {['Emergency Response', 'Critical Care', 'Medical Standby', 'Training Programs'].map((item) => (
                  <motion.li key={item} whileHover={{ x: 3 }}>
                    <a href="#" className="text-gray-400 hover:text-white">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>123 Medical Center Drive</li>
                <li>Cityville, State 12345</li>
                <li>Emergency: 911</li>
                <li>Non-emergency: (555) 123-4567</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for health tips and updates.
              </p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-lg w-full focus:outline-none text-gray-800"
                />
                <motion.button
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg"
                  whileHover={{ backgroundColor: "#3182ce" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={16} />
                </motion.button>
              </form>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} LifeLine EMS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            className="fixed bottom-6 right-6 bg-blue-600/90 backdrop-blur-sm text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
            onClick={() => setChatOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "rgba(49, 130, 206, 0.9)",
              boxShadow: "0 0 20px rgba(49, 130, 206, 0.5)"
            }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
        
        {chatOpen && (
          <motion.div
            className="fixed bottom-6 right-6 w-80 md:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ height: "500px" }}
          >
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                  <MessageCircle size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold">LifeLine Support</h3>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-white hover:bg-blue-700 p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div 
                      className={`max-w-3/4 rounded-2xl px-4 py-2 ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 shadow rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                      <div 
                        className={`text-xs mt-1 ${
                          msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                        }`}
                      >
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t">
              {messages.some(msg => msg.sender === 'bot' && msg.text.includes('emergency')) && (
                <motion.div 
                  className="text-red-600 text-sm mb-2 flex items-center"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertTriangle size={16} className="mr-1" />
                  For emergencies, please call 911 immediately.
                </motion.div>
              )}
              <form 
                className="flex items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <motion.button
                  className="bg-blue-600 text-white p-2 rounded-r-full"
                  whileHover={{ backgroundColor: "#3182ce" }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                >
                  <Send size={20} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes ping-slow {
          0% { transform: scale(0.95); opacity: 1; }
          50% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 1; }
        }
        @keyframes ping-medium {
          0% { transform: scale(0.85); opacity: 1; }
          50% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(0.85); opacity: 1; }
        }
        @keyframes ping-fast {
          0% { transform: scale(0.75); opacity: 1; }
          50% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(0.75); opacity: 1; }
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-ping-medium {
          animation: ping-medium 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-ping-fast {
          animation: ping-fast 2s cubic-bezier(00, 0.2, 1) infinite;
        }
      `}</style>

      {/* Animation keyframes for custom animations */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        body {
          overflow-x: hidden;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        
        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
    </div>
  );
}

// Add the following to your global CSS file or styles/globals.css
/* 
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
*/

// Add to next.config.js for image optimization
/*
module.exports = {
  images: {
    domains: ['images.unsplash.com'],
  },
};
*/

// pages/_app.js
/*
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
*/