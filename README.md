License: [Buy Commercial License](https://buy.stripe.com/3cs16n9501j8djieUU)

# Call Center AI Dashboard

A powerful, real-time call center analytics dashboard powered by AI for monitoring and analyzing customer service interactions.

## Overview

This dashboard provides real-time monitoring and AI-powered analysis of call center interactions, helping businesses improve their customer service quality and efficiency. The system processes live call data, transcribes conversations, analyzes sentiment, and provides actionable insights.

## Features

- 🎯 Real-time call monitoring and analytics
- 🔊 Live audio transcription
- 😊 Sentiment analysis
- 📊 Interactive data visualization
- 🤖 AI-powered conversation analysis
- 📈 Performance metrics tracking
- 🔍 Search and filtering capabilities
- 📱 Responsive design for all devices

## Technology Stack

- **Frontend**: Next.js 13, React, TypeScript
- **UI Components**: Tailwind CSS, Shadcn UI
- **Data Visualization**: Tremor
- **Database**: Supabase
- **Voice Processing**: Retell AI
- **Scheduling**: Cal.com
- **Real-time Processing**: WebSocket
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Retell AI API key
- Cal.com API key
- Supabase URL and keys

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/call-center-ai-dashboard.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add:
```bash

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=your_site_url
NEXT_PUBLIC_APP_URL=your_app_url

# Retell Configuration
RETELL_WEBHOOK_URL=your_webhook_url
NEXT_PUBLIC_WEBSOCKET_URL=wss://api.retellai.com/retell-llm/llm-websocket
NEXT_PUBLIC_RETELL_AGENT_ID=your_agent_id
RETELL_API_KEY=your_retell_api_key
NEXT_PUBLIC_RETELL_API_KEY=your_retell_api_key
RETELL_AGENT_ID=your_agent_id

# WebSocket Configuration
NEXT_PUBLIC_WEBSOCKET_PORT=3001
WEBSOCKET_PORT=3001

# Cal.com Configuration
CAL_API_KEY=your_cal_api_key
CAL_EVENT_TYPE_ID=your_event_type_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Dashboard Overview**: View real-time metrics and KPIs
2. **Live Calls**: Monitor ongoing calls with live transcription
3. **Analytics**: Access detailed reports and insights
4. **Settings**: Configure AI parameters and dashboard preferences

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Support

For support, please:
1. Check the documentation
2. Open an issue in the GitHub repository
3. Contact the development team

## Security

Please report any security vulnerabilities to the security team via GitHub security advisories.

## License

Commercial use of this software requires a valid license. [Purchase a commercial license](https://buy.stripe.com)
