// app/products/[id]/not-found.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { PackageX, ArrowLeft } from "lucide-react"

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      {/* Animated icon */}
      <motion.div
        initial={{ scale: 0, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="bg-muted rounded-full p-6 mb-6"
      >
        <PackageX className="w-16 h-16 text-primary" />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-2"
      >
        Product Not Found
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground max-w-md mb-6"
      >
        It seems the product you’re looking for doesn’t exist or was removed.  
        Don’t worry, we’ve got plenty of other awesome items waiting for you!
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3"
      >
        <Link href="/products">
          <Button className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Button>
        </Link>

        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </motion.div>

      {/* Floating decorative shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1, y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1, y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full"
      />
    </div>
  )
}
