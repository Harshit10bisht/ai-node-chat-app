# AI Agent Setup Guide

## Quick Setup Steps

### 1. Get OpenAI API Key (Free Tier)

1. **Visit OpenAI Platform**: Go to [https://platform.openai.com/](https://platform.openai.com/)
2. **Sign Up**: Create a free account (no credit card required for free tier)
3. **Navigate to API Keys**: Click on "API Keys" in the left sidebar
4. **Create New Key**: Click "Create new secret key"
5. **Copy the Key**: Copy the generated key (starts with `sk-`)

### 2. Configure Your Environment

Create a `.env` file in the root directory of your project:

```bash
# Create .env file
echo "OPENAI_API_KEY=sk-your_actual_api_key_here" > .env
```

Replace `sk-your_actual_api_key_here` with your actual OpenAI API key.

### 3. Test Locally

```bash
npm run dev
```

Open `http://localhost:3000` and test the AI agent by typing:
```
@Agent Hello, how are you?
```

### 4. Deploy to Vercel

1. **Push to GitHub**: Make sure your code is in a GitHub repository
2. **Deploy on Vercel**: Follow the deployment steps in README.md
3. **Add Environment Variable**: In Vercel dashboard, add `OPENAI_API_KEY` with your API key
4. **Test**: Your deployed app will now have AI agent functionality

## Usage Examples

- `@Agent What's the weather like?`
- `@Agent Can you help me with JavaScript?`
- `@Agent Tell me a joke`
- `@Agent What's 2+2?`

## Free Tier Limits

- OpenAI provides $5 credit for new accounts
- GPT-3.5-turbo costs ~$0.002 per 1K tokens
- This typically allows for hundreds of conversations

## Troubleshooting

- **Agent not responding**: Check your API key is correct
- **Rate limit errors**: You may have exceeded free tier limits
- **Network errors**: Check your internet connection

## Security Note

- Never commit your `.env` file to git
- The `.gitignore` file is already configured to prevent this
- Keep your API key private and secure
