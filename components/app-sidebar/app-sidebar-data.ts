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
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
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
        url: "#",
        icon: Database,
        items: [
          { title: "Knowledges", url: "#" },
          { title: "Scripts", url: "#" },
          { title: "Products", url: "#" },
          { title: "Contacts-Data", url: "#" },
        ],
      },
      {
        title: "Sales",
        url: "#",
        icon: DollarSign,
        items: [
          { title: "Products", url: "#" },
          { title: "Proposal", url: "#" },
          { title: "Analysis", url: "#" },
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