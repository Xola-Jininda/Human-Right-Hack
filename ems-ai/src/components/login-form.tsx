"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { HeartPulse } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    
    // Simulate loading time before redirecting
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <>
      {/* Full screen loader - moved outside the form for true fullscreen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="relative w-40 h-40" 
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "linear" 
              }}
            >
              <HeartPulse className="h-full w-full text-red-500 absolute" strokeWidth={1.2} />
              <span className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-32 h-2 bg-red-500 rounded-full"
                  animate={{
                    scaleX: [1, 1.5, 0.5, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </span>
            </motion.div>
            <motion.p 
              className="text-white mt-8 text-2xl font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Preparing Dashboard...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)} 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        {...props}
      >
        <motion.div
          whileHover={{ 
            scale: 1.05, 
            z: 50, 
            boxShadow: "0 0 30px 5px rgba(59, 130, 246, 0.3)",
            transition: { 
              type: "spring", 
              stiffness: 300, 
              damping: 15 
            }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="w-full"
        >
          <Card className="overflow-hidden border-2 border-gray-300 shadow-xl bg-white dark:bg-gray-950 rounded-2xl">
            <motion.div
              initial={{ }}
              whileHover={{ 
                background: "linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))",
                transition: { duration: 0.3 }
              }}
              className="rounded-t-xl"
            >
              <CardHeader className="bg-white dark:bg-gray-950 rounded-t-xl pt-6">
                <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
            </motion.div>
            <CardContent className="bg-white dark:bg-gray-950 p-6 rounded-b-xl">
              <form>
                <div className="flex flex-col gap-6">
                  <motion.div 
                    className="grid gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className="rounded-full border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </motion.div>
                  <motion.div 
                    className="grid gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        href="#"
                        className="ml-auto inline-block text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </motion.a>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      className="rounded-full border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </motion.div>
                  <motion.div 
                    className="flex flex-col gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button 
                        type="button" 
                        className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium py-2.5 transition-all duration-200 shadow-md hover:shadow-xl hover:scale-102"
                        onClick={handleLogin}
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>
                    </motion.div>
                  
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button variant="outline" className="w-full rounded-full border-2 border-gray-300 py-2.5 text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow hover:border-gray-400">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Login with Google
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
                <motion.div 
                  className="mt-6 text-center text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Don&apos;t have an account?{" "}
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    href="#" 
                    className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-4"
                  >
                    Sign up
                  </motion.a>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  )
}
