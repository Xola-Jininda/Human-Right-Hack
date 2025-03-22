"use client";

import { HeartPulse, Phone, ArrowRight, Upload, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Type definition for Message
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
    // Default images for slideshow
    const defaultImages = [
        "/pic 1.jpg",
        "/pic 2.jpg",
        "/pexels-pavel-danilyuk-6754163.jpg",
        "https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?auto=format&fit=crop&q=80&w=2000",
        "/pic3.jpg",
    ];

    const [images, setImages] = useState<string[]>(defaultImages);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isEnlarged, setIsEnlarged] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [language, setLanguage] = useState("en");
    const [chatOpen, setChatOpen] = useState(false);

    // Botsonic configuration
    const BOTSONIC_SERVICE_BASE_URL = "https://api-azure.botsonic.ai";
    const BOTSONIC_TOKEN = "1ca6ae32-bb74-4141-bdf8-2f71c7e2a544";

    // Handle custom image upload
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImages((prev) => [...prev, imageUrl]);
            setCurrentIndex(images.length); // Switch to the newly added image
        }
    };

    // Auto-advance slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change slide every 3 seconds

        return () => {
            clearInterval(interval);
            // Clean up any blob URLs when component unmounts
            images.forEach((img) => {
                if (img.startsWith("blob:")) {
                    URL.revokeObjectURL(img);
                }
            });
        };
    }, [images]);

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
    setIsEnlarged((prev) => !prev);
    // Optional: Adjust Botsonic widget size (if supported by Botsonic API)
    const widget = document.querySelector(".botsonic_widget_container") as HTMLElement;
    if (widget) {
      widget.style.width = isEnlarged ? "300px" : "100%";
      widget.style.height = isEnlarged ? "400px" : "80vh";
    }
  };


    return (
        <>
            {/* Rest of the component */}
            <div className="h-screen">
                {/* Hero Section */}
                <header className="relative h-screen w-full overflow-hidden">
                <div id="botsonic_widget_container" className="w-full h-full" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                height: "100vh",
                                width: "100vw",
                                backgroundImage: `url('${images[currentIndex]}')`,
                            }}
                        />
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-black/40" />

                    {/* Slide navigation dots */}
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${
                                    index === currentIndex ? "bg-white scale-125" : "bg-white/50"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                        
                    </div>

                    <div className="relative">
                        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <HeartPulse className="h-8 w-8 text-red-600" strokeWidth={1.5} />
                                    <span className="ml-2 text-2xl font-bold text-white tracking-tight">Pulse AI</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Button variant="ghost" className="text-white hover:bg-white/20">Services</Button>
                                    <Button variant="ghost" className="text-white hover:bg-white/20">About</Button>
                                    <Button variant="ghost" className="text-white hover:bg-white/20">Contact</Button>
                                    <Button className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 ml-4 shadow-lg border border-white/30">
                                        <Phone className="h-4 w-4 mr-2" />
                                        911
                                    </Button>
                                </div>
                            </div>
                        </nav>
                        <div id="botsonic_widget_container" className="w-full h-full" />
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <h1 className="text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
                                        Swift Response.<br />Expert Care.
                                    </h1>
                                    <motion.p
                                        className="text-2xl text-white/90 mb-8 leading-relaxed backdrop-blur-sm bg-black/10 p-6 rounded-2xl "
                                        whileHover={{
                                            scale: 1.02,
                                            borderColor: "rgba(255, 255, 255, 0.3)",
                                            boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
                                            backgroundColor: "rgba(0, 0, 0, 0.2)"
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        State-of-the-art emergency medical services with AI-powered dispatch and highly trained professionals available 24/7.
                                    </motion.p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button size="lg" className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/30 shadow-xl rounded-lg">
                                            Get Started
                                            <Phone className="ml-2 h-4 w-4" />  
                                        </Button>
                                        <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 backdrop-blur-md rounded-lg">
                                            Learn More
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        </>
    );
}