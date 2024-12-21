import {
    AudioWaveform,
    Bot,
    Calendar,
    Command,
    Database,
    DollarSign,
    GalleryVerticalEnd,
    MessageSquare,
    Phone,
    Settings,
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
        title: "Bookings",
        url: "/dashboard/bookings/",
        icon: Calendar,
        items: [
          { title: "All Bookings", url: "/dashboard/bookings/" },
          { title: "Upcoming", url: "/dashboard/bookings/upcoming" },
          { title: "Past", url: "/dashboard/bookings/past" },
        ],
      },
      {
        title: "Voice Agents",
        url: "#",
        icon: Phone,
        items: [
          // { title: "Twilio", url: "/dashboard/twilio" },
          { title: "Retell", url: "/dashboard/retell" },
          { title: "Manage Agents", url: "/dashboard/manage-agents" },
        ],
      },
      // {
      //   title: "Messages",
      //   url: "#",
      //   icon: MessageSquare,
      //   items: [
      //     { title: "Email", url: "/dashboard/messages/email" },
      //     { title: "WhatsApp", url: "#" },
      //     { title: "Telegram", url: "#" },
      //     { title: "SMS", url: "#" },
      //   ],
      // },
      // {
      //   title: "Storage",
      //   url: "/dashboard/storage/",
      //   icon: Database,
      //   items: [
      //     { title: "Documents", url: "/dashboard/storage/documents" },
      //     { title: "Products", url: "/dashboard/products" },
      //     { title: "Contacts-Data", url: "/dashboard/storage/contacts-data" },
      //   ],
      // },
      // {
      //   title: "Sales",
      //   url: "/dashboard/sales/",
      //   icon: DollarSign,
      //   items: [
      //     { title: "Products", url: "/dashboard/products" },
      //     { title: "Proposal", url: "/dashboard/sales/proposals" },
      //     { title: "Analysis", url: "/dashboard/sales/analysis" },
      //   ],
      // },
      // {
      //   title: "Agent AI",
      //   url: "#",
      //   icon: Bot,
      //   items: [
      //     { title: "History", url: "#" },
      //     { title: "Tools", url: "#" },
      //     { title: "Settings", url: "#" },
      //   ],
      // },
      {
        title: "Settings",
        url: "#",
        icon: Settings,
        items: [
          { title: "API Settings", url: "/dashboard/settings/api" },
        ],
      },
    ],
  }
