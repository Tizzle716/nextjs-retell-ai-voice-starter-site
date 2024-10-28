import {
    AudioWaveform,
    Bot,
    Command,
    Database,
    DollarSign,
    GalleryVerticalEnd,
    MessageSquare,
    Phone,
    Users,
  } from "lucide-react"
  
  export const sidebarData = {
    teams: [
      {
        name: "ai-consultant.fr",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "ai-skool.com",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "ai-mentor.help",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Contacts",
        url: "/dashboard/contacts/",
        icon: Users,
        items: [
          { title: "Leads", url: "/dashboard/contacts/" },
          { title: "Prospects", url: "/dashboard/contacts/" },
          { title: "Clients", url: "/dashboard/contacts/" },
        ],
      },
      {
        title: "Call-Center",
        url: "#",
        icon: Phone,
        items: [
          { title: "Twilio", url: "/dashboard/twilio" },
          { title: "Retell", url: "/dashboard/retell" },
          { title: "Vapi", url: "/dashboard/vapi" },
        ],
      },
      {
        title: "Messages",
        url: "#",
        icon: MessageSquare,
        items: [
          { title: "Email", url: "/dashboard/messages/email" },
          { title: "WhatsApp", url: "#" },
          { title: "Telegram", url: "#" },
          { title: "SMS", url: "#" },
        ],
      },
      {
        title: "Storage",
        url: "/dashboard/storage/",
        icon: Database,
        items: [
          { title: "Knowledges", url: "/dashboard/storage/knowledges" },
          { title: "Scripts", url: "/dashboard/storage/scripts" },
          { title: "Products", url: "/dashboard/storage/products" },
          { title: "Contacts-Data", url: "/dashboard/storage/contacts-data" },
        ],
      },
      {
        title: "Sales",
        url: "/dashboard/sales/",
        icon: DollarSign,
        items: [
          { title: "Products", url: "/dashboard/sales/products" },
          { title: "Proposal", url: "/dashboard/sales/proposal" },
          { title: "Analysis", url: "/dashboard/sales/analysis" },
        ],
      },
      {
        title: "Agent AI",
        url: "#",
        icon: Bot,
        items: [
          { title: "History", url: "#" },
          { title: "Tools", url: "#" },
          { title: "Settings", url: "#" },
        ],
      },
    ],
  }
