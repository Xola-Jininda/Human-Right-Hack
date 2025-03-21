import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
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

  const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2 }
  };

  return (
    <div className="min-h-screen bg-gray-via-fuchsia-50 to-sky-100 dark:from-violet-950 dark:via-indigo-900 dark:to-blue-900 p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <motion.main 
        className="flex flex-col gap-[40px] items-center sm:items-start max-w-4xl mx-auto pt-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="w-full">
          <motion.div 
            whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
            className="flex justify-center sm:justify-start"
          >
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={200}
              height={42}
              priority
            />
          </motion.div>
        </motion.div>

        <motion.ol 
          variants={itemVariants}
          className="list-inside list-decimal text-base/7 text-center sm:text-left font-[family-name:var(--font-geist-mono)] bg-white/30 dark:bg-gray-800/30 p-6 rounded-xl shadow-sm backdrop-blur-sm border border-white/20 dark:border-gray-700/30 w-full"
        >
          <motion.li 
            className="mb-4 tracking-[-.01em]"
            whileHover={{ x: 5, transition: { duration: 0.2 } }}
          >
            Get started by editing{" "}
            <code className="bg-indigo-100 dark:bg-indigo-900/40 px-2 py-1 rounded-md font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </motion.li>
          <motion.li 
            className="tracking-[-.01em]"
            whileHover={{ x: 5, transition: { duration: 0.2 } }}
          >
            Save and see your changes instantly.
          </motion.li>
        </motion.ol>

        <motion.div variants={itemVariants} className="flex gap-5 items-center flex-col sm:flex-row w-full">
          <motion.a
            whileHover={buttonHover}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl border border-solid border-transparent transition-colors flex items-center justify-center bg-indigo-600 text-white gap-3 font-medium text-sm sm:text-base h-12 sm:h-14 px-5 sm:px-7 w-full sm:w-auto shadow-md hover:bg-indigo-700"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <Image
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
                className="invert"
              />
            </motion.div>
            Deploy now
          </motion.a>
          <motion.a
            whileHover={buttonHover}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl border border-solid border-indigo-200 dark:border-indigo-700 transition-colors flex items-center justify-center bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 backdrop-blur-sm font-medium text-sm sm:text-base h-12 sm:h-14 px-5 sm:px-7 w-full sm:w-auto shadow-sm"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </motion.a>
        </motion.div>
      </motion.main>
      
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="flex gap-[24px] flex-wrap items-center justify-center mt-20 text-gray-600 dark:text-gray-300"
      >
        <motion.a
          whileHover={{ y: -2, color: "#4F46E5" }}
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </motion.a>
        <motion.a
          whileHover={{ y: -2, color: "#4F46E5" }}
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </motion.a>
        <motion.a
          whileHover={{ y: -2, color: "#4F46E5" }}
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </motion.a>
      </motion.footer>
    </div>
  );
}
