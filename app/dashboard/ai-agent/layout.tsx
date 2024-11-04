import { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Agent - Dashboard",
  description: "AI Assistant for freelancers",
}

export default function AIAgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      {children}
    </div>
  )
} 