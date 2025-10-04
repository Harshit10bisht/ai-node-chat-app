# Real-Time Chat Application (Mainly backend topics focused)

A modern, real-time chat application built with Node.js, Express, and Pusher, featuring AI integration, beautiful typography, and a responsive design.

https://drive.google.com/file/d/10yPiCpjxWGQabRK_nC7wFumJP1nTesLo/view?usp=drive_link

<img width="1920" height="1080" alt="Working_Chat_1" src="https://github.com/user-attachments/assets/fbb78d48-5fc7-4a52-ae2e-b24297aa7531" />
<img width="1920" height="1080" alt="Working_Chat_2" src="https://github.com/user-attachments/assets/2d445ad4-94e3-45b5-90a8-7bacfb940a18" />


## ✨ Features

- **Real-time messaging** with Pusher integration
- **Room-based chat** with user management
- **AI Assistant** - Ask questions with "@Agent" prefix
- **Location sharing** with Google Maps integration
- **Emoji picker** for expressive messaging
- **Profanity filtering** for clean conversations
- **Beautiful typography** using Inter font
- **Responsive design** for all devices
- **User join/leave notifications**
- **Modern UI** with glassmorphism effects

## 🎨 Design Features

- **Inter Font**: Modern, clean typography optimized for readability
- **Glassmorphism UI**: Beautiful backdrop blur effects
- **Gradient backgrounds**: Dynamic purple-themed gradients
- **Smooth animations**: Hover effects and transitions
- **Dark theme**: Easy on the eyes for extended use

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Pusher account (free tier available)
- OpenAI or OpenRouter API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```bash
   # Pusher Configuration (Required)
   PUSHER_APP_ID=your_pusher_app_id
   PUSHER_KEY=your_pusher_key
   PUSHER_SECRET=your_pusher_secret
   PUSHER_CLUSTER=us2

   # AI Configuration (Choose one provider)
   # Option A: OpenAI
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-your_openai_key
   AI_MODEL=gpt-3.5-turbo

   # Option B: OpenRouter (Alternative)
   # AI_PROVIDER=openrouter
   # OPENROUTER_API_KEY=or-your_openrouter_key
   # OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
   # AI_MODEL=openrouter/auto
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Pusher Setup

1. Create a free account at [pusher.com](https://pusher.com)
2. Create a new Channels app
3. Copy your app credentials to the `.env` file
4. The app will automatically use Pusher for real-time communication

### AI Assistant Setup

#### Option A: OpenAI (Recommended)
1. Create an account at [platform.openai.com](https://platform.openai.com)
2. Generate an API key
3. Add your key to the `.env` file
4. Set `AI_PROVIDER=openai`

#### Option B: OpenRouter (Alternative)
1. Create an account at [openrouter.ai](https://openrouter.ai)
2. Get your API key
3. Add your key to the `.env` file
4. Set `AI_PROVIDER=openrouter`

## 💬 Using the Chat

### Basic Usage
1. **Join a room**: Enter your display name and room name
2. **Send messages**: Type in the message box and press Enter
3. **Share location**: Click "Send location" to share your current location
4. **Add emojis**: Click the emoji button to add expressions

### AI Assistant
- Type `@Agent` followed by your question
- Examples:
  - `@Agent What's the weather like?`
  - `@Agent Explain quantum computing`
  - `@Agent Help me with JavaScript`

### Room Features
- **User list**: See all active users in the sidebar
- **Real-time updates**: Messages appear instantly
- **User notifications**: See when users join or leave

## 🛠️ Development

### Project Structure
```
chat-app/
├── public/                 # Static files
│   ├── css/
│   │   ├── styles.css      # Main stylesheet with Inter font
│   │   └── styles.min.css  # Minified CSS
│   ├── js/
│   │   ├── chat.js         # Chat functionality
│   │   └── join.js         # Join page logic
│   ├── img/                # Images and icons
│   ├── index.html          # Join page
│   └── chat.html           # Chat interface
├── src/
│   ├── index.js            # Express server
│   └── utils/
│       ├── aiAgent.js      # AI integration
│       ├── messages.js     # Message utilities
│       ├── pusher.js       # Pusher configuration
│       └── users.js        # User management
├── config.js               # App configuration
├── package.json            # Dependencies
└── README.md              # This file
```

### Available Scripts
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Key Technologies

#### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **Pusher**: Real-time communication
- **bad-words**: Profanity filtering

#### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Inter font
- **JavaScript**: Client-side functionality
- **Mustache.js**: Template rendering
- **Moment.js**: Time formatting

#### AI Integration
- **OpenAI API**: GPT models
- **OpenRouter**: Alternative AI provider

## 🚀 Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables for Production
Make sure to set all required environment variables in your deployment platform:
- `PUSHER_APP_ID`
- `PUSHER_KEY`
- `PUSHER_SECRET`
- `PUSHER_CLUSTER`
- `AI_PROVIDER`
- `OPENAI_API_KEY` or `OPENROUTER_API_KEY`

## 🎯 Features in Detail

### Real-time Communication
- **Pusher Channels**: Reliable real-time messaging
- **Room-based**: Isolated chat rooms
- **User presence**: See who's online
- **Instant updates**: No page refresh needed

### AI Integration
- **Multi-provider support**: OpenAI and OpenRouter
- **Context-aware**: AI knows the room and user context
- **Rate limiting**: Built-in error handling
- **Fallback responses**: Graceful error handling

### User Experience
- **Responsive design**: Works on all screen sizes
- **Modern typography**: Inter font for readability
- **Smooth animations**: Enhanced user interactions
- **Accessibility**: Keyboard navigation support

### Security
- **Profanity filtering**: Automatic content moderation
- **Input validation**: Server-side validation
- **XSS protection**: Sanitized user inputs
- **CORS configuration**: Secure cross-origin requests

## 🔍 Troubleshooting

### Common Issues

1. **Pusher Connection Failed**
   - Verify your Pusher credentials
   - Check network connectivity
   - Ensure Pusher app is active

2. **AI Assistant Not Responding**
   - Verify API key is correct
   - Check API quota/credits
   - Ensure correct provider is set

3. **Messages Not Sending**
   - Check browser console for errors
   - Verify Pusher configuration
   - Check network connectivity

4. **Styling Issues**
   - Clear browser cache
   - Verify Inter font is loading
   - Check CSS file paths

### Debug Mode
Enable debug logging by setting `DEBUG=true` in your environment variables.

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Inter Font**: Beautiful typography by Google Fonts
- **Pusher**: Real-time communication platform
- **OpenAI**: AI language models
- **OpenRouter**: Alternative AI provider

---

**Built with ❤️ using modern web technologies** 
