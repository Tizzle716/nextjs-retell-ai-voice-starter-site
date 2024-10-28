import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, MessageSquare, BarChart } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="container flex flex-col items-center justify-center max-w-6xl px-4 py-16 mx-auto sm:py-24 lg:py-32">
          {/* Hero Content */}
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Modern Call Center
                <span className="text-primary"> Dashboard</span>
              </h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Streamline your call center operations with advanced analytics, real-time monitoring, and intelligent call routing.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="min-w-[200px]">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-8 mt-16 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center p-6 space-y-4 border rounded-lg shadow-sm">
              <Phone className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-semibold">Call Management</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Efficient call routing and real-time monitoring capabilities.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 space-y-4 border rounded-lg shadow-sm">
              <MessageSquare className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-semibold">Messaging</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Integrated messaging platform for seamless communication.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 space-y-4 border rounded-lg shadow-sm">
              <BarChart className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-semibold">Analytics</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Comprehensive analytics and reporting tools.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
