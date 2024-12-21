'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black/90 text-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">AI Sales Agent</h3>
            <p className="text-gray-400 text-sm">
              Revolutionize your online sales with our AI-powered agents. Available 24/7, converting visitors into customers.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="#" className="hover:text-[#00ff8f] transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-[#00ff8f] transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-[#00ff8f] transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Features</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-[#00ff8f] transition-colors text-sm">24/7 Sales Support</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#00ff8f] transition-colors text-sm">Lead Qualification</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#00ff8f] transition-colors text-sm">Smart Analytics</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#00ff8f] transition-colors text-sm">Custom Training</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#00ff8f] transition-colors text-sm">API Integration</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-[#00ff8f] transition-colors text-sm">Documentation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#00ff8f] transition-colors text-sm">API Reference</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#00ff8f] transition-colors text-sm">Case Studies</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#00ff8f] transition-colors text-sm">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#00ff8f] transition-colors text-sm">Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">AI Sales Headquarters</li>
              <li className="text-gray-400 text-sm">100 Innovation Drive</li>
              <li className="text-gray-400 text-sm">San Francisco, CA 94105</li>
              <li className="text-gray-400 text-sm">Phone: (888) AI-SALES</li>
              <li className="text-gray-400 text-sm">Email: support@aisales.ai</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} AI Sales Agent. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-[#00ff8f] text-xs transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-[#00ff8f] text-xs transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-[#00ff8f] text-xs transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
