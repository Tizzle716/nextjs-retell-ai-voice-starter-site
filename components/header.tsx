'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Phone, LayoutDashboard, Menu, X } from "lucide-react"
import SparklesText from "@/components/ui/sparkle-text"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full py-4 px-4 lg:px-6 bg-black/50 backdrop-blur-sm border-b border-[#00ff8f]/10 shadow-[0_0_15px_rgba(0,255,143,0.1)]">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <div className="flex items-center">
          <h1 className="text-sm lg:text-xl font-bold [&>div]:!text-sm lg:[&>div]:!text-xl">
            <SparklesText text="[YOURLOGO]" />
          </h1>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-gray-300 hover:text-[#00ff8f] transition-colors p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="#features" className="text-gray-300 hover:text-[#00ff8f] transition-colors">Features</Link>
          <Link href="#gallery" className="text-gray-300 hover:text-[#00ff8f] transition-colors">Gallery</Link>
          <Link href="#technology" className="text-gray-300 hover:text-[#00ff8f] transition-colors">Our Process</Link>
          <Link href="#faqs" className="text-gray-300 hover:text-[#00ff8f] transition-colors">FAQs</Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-[#00ff8f] transition-colors">
            <LayoutDashboard className="w-5 h-5" />
          </Link>
        </nav>
      </div>

      {/* Mobile navigation */}
      <nav className={`${isMenuOpen ? 'flex' : 'hidden'} lg:hidden flex-col items-center gap-4 pt-4 w-full`}>
        <Link href="#features" className="w-full text-center py-2 text-gray-300 hover:text-[#00ff8f] transition-colors">Features</Link>
        <Link href="#gallery" className="w-full text-center py-2 text-gray-300 hover:text-[#00ff8f] transition-colors">Gallery</Link>
        <Link href="#technology" className="w-full text-center py-2 text-gray-300 hover:text-[#00ff8f] transition-colors">Our Process</Link>
        <Link href="#faqs" className="w-full text-center py-2 text-gray-300 hover:text-[#00ff8f] transition-colors">FAQs</Link>
        <Link href="/dashboard" className="w-full text-center py-2 text-gray-300 hover:text-[#00ff8f] transition-colors">
          <LayoutDashboard className="w-5 h-5 mx-auto" />
        </Link>
      </nav>
    </header>
  )
}
