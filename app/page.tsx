'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, MessageSquare, BarChart, Star, CheckCircle } from "lucide-react"
import Link from "next/link"
import LiveCallSection from "@/components/home/live-call-section"
import Header from "@/components/header"
import Image from 'next/image'
import { Shadows_Into_Light } from 'next/font/google'
import handwriting from "./handwriting.module.css"
import Footer from "@/components/Footer"
import SparklesText from "@/components/ui/sparkle-text"

const handwritingFont = Shadows_Into_Light({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-handwriting',
})

export default function Home() {
  return (
    <div className="flex flex-col bg-black max-w-[30rem] sm:max-w-none min-h-screen mx-auto">
      <Header />
      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative min-h-[calc(100vh-4rem)] pb-12 md:pb-24">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="https://unsplash.it/1800/800?image=893"
              alt="Background Image"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/25 to-black/5" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-transparent to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              {/* Left side - LiveCallSection */}
              <h3 className={`${handwritingFont.className} text-xs md:hidden lg:hidden text-center text-gray-300 tracking-wider leading-none whitespace-nowrap mb-0`}>
                Want to turn your website visitors into booked appointments?
              </h3>
              <h1 className="block lg:hidden text-2xl text-center sm:text-3xl font-bold leading-tight mt-[-1rem] md:mt-[-3rem] lg:mt-0">
                <span className="bg-gradient-to-r from-[#4e00ff] via-[#00baff] to-[#ff0099] text-transparent bg-clip-text animate-gradient drop-shadow-[0_0_10px_rgba(78,0,255,0.5)]">
                  Transform Your Website<br/>
                  Into An AI-Powered<br/>
                  Sales Machine           
                </span>
              </h1>
              <div className="w-full lg:w-1/2">
                <LiveCallSection />
              </div>
              
              {/* Right side - Text Content */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
          
                <h1 className="hidden lg:block text-1xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 md:mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-[#4e00ff] via-[#00baff] to-[#ff0099] text-transparent bg-clip-text animate-gradient drop-shadow-[0_0_10px_rgba(78,0,255,0.5)]">
                    Turn Your Website Into<br/>
                    An AI Sales Agent That<br/>
                    Books Appointments 24/7                    
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 mb-6 md:mb-8">
                  Deploy our AI Voice Agent to handle customer conversations naturally, qualify leads, and schedule appointments automatically. Perfect for home service businesses ready to scale.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Link href="/dashboard">
                      Get Started Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

                
                
              </div>
            </div>
          </section>

                      {/* Features Section */}
          <section className="relative py-12 sm:py-16 lg:py-20 bg-black" id="features">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#4e00ff] via-[#00baff] to-[#ff0099] text-transparent bg-clip-text animate-gradient">
                  Why Choose Our AI Boilerplate?
                </h2>
                <p className="mt-4 text-lg text-gray-400">
                  Everything you need to transform your website into an AI-powered sales machine
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Natural Conversations</h3>
                  </div>
                  <p className="text-gray-400">Our AI engages visitors in human-like dialogue, building trust and guiding them through the sales process naturally.</p>
                </div>

                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Always Available</h3>
                  </div>
                  <p className="text-gray-400">Never miss a lead with 24/7 availability. Our AI handles inquiries and books appointments around the clock.</p>
                </div>

                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <BarChart className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Smart Lead Scoring</h3>
                  </div>
                  <p className="text-gray-400">Automatically qualify and score leads based on conversation data, ensuring you focus on high-value prospects.</p>
                </div>

                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Easy Setup</h3>
                  </div>
                  <p className="text-gray-400">Get up and running in minutes with our simple copy-paste installation process. No complex integrations needed.</p>
                </div>

                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Fully Customizable</h3>
                  </div>
                  <p className="text-gray-400">Tailor the AI&apos;s personality, responses, and booking flow to match your brand and business requirements.</p>
                </div>

                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Calendar Integration</h3>
                  </div>
                  <p className="text-gray-400">Seamlessly sync with your calendar to automatically schedule appointments without double-booking.</p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 text-lg">
                  <Link href="/dashboard">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black to-[#0a0514]" id="technology">
            <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Advanced Starter Template
                </h2>
                <p className="text-lg text-gray-400">
                  Built with modern technologies and ready-to-use integrations for rapid deployment
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white mb-2">NextJS Framework</h3>
                    <p className="text-gray-400">
                      Built on Next.js 13 with App Router, Server Components, and optimized for performance
                    </p>
                  </div>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      TypeScript & TailwindCSS
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      Server-side Rendering
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      API Routes & Middleware
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white mb-2">Retell AI Integration</h3>
                    <p className="text-gray-400">
                      Complete voice AI implementation with Retell&apos;s powerful conversation engine
                    </p>
                  </div>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      Real-time Voice Processing
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      Natural Language Understanding
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      Custom Voice Configuration
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white mb-2">Cal.com Scheduling</h3>
                    <p className="text-gray-400">
                      Seamless calendar integration with Cal.com&apos;s scheduling platform
                    </p>
                  </div>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      Automated Booking System
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      Multi-calendar Support
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      Timezone Management
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 text-lg">
                  <Link href="/dashboard">
                    Start Building Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-8 sm:py-12 lg:py-20 bg-gradient-to-b from-[#0a0514] to-black">
            <div className="w-full max-w-[15rem] sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">
                Ready to <SparklesText text="Transform Your Sales?" colors={{ first: "#00ff8f", second: "#2196f3" }} />
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 lg:mb-12 max-w-[90%] sm:max-w-2xl mx-auto">
                Join the future of AI-powered sales. Get started today and watch your conversion rates soar.
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 text-lg">
                <Link href="/dashboard">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
  );
}
