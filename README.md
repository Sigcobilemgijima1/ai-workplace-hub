# AI-Productivity-Assistant

# Overview
The AI Workplace Productivity Assistant is a modern, responsive web application
designed to help professionals automate routine workplace tasks using artificial
intelligence. The platform integrates six core AI-powered tools into a single,
intuitive dashboard interface.

All AI-generated outputs are fully editable, keeping human oversight at the
center of the workflow. A persistent responsible AI disclaimer ensures users
verify critical information before acting on it.

# Features
In the project I will the following features 

# 1. Smart Email Generator
Generate professional emails
Support different tones (formal, friendly, persuasive)

# 2. Meeting Notes Summarizer
Summarize long notes
Extract action items, decisions, and deadlines

# 3. AI Task Planner / Scheduler
Generate daily or weekly schedules
Prioritize tasks effectively

# 4. AI Research Assistant
Summarize topics/articles
Provide insights and recommendations

# 5. AI Chatbot Interface
Interactive AI workplace assistant
Handle user prompts and responses

# Tools used
1.GitHub
2.Loveable
3.Deepseek

# Setup instructions

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following:

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection (for loading fonts and icons from CDNs)
- No server, database, or API keys required for the basic version


### Installation & Running

Choose one of the three methods below:

#### Method 1: Direct Open (Easiest)

1. Download the `index.html` file from this repository
2. Double-click the file to open it in your default web browser
3. The application will launch immediately

#### Method 2: Run with Local Server (Recommended)

Using a local server ensures all assets load correctly:

**Using Python 3:**
bash
# Navigate to the project folder
cd AI-Productivity-Assistant

# Start a simple HTTP server
python -m http.server 8000


**Using Node.js (with npx):**
bash
npx serve


**Using VS Code:**
- Install the "Live Server" extension
- Right-click on `index.html`
- Select "Open with Live Server"

Once the server is running, open your browser and go to:

http://localhost:8000


#### Method 3: Deploy Online (For Sharing)

Upload the `index.html` file to any static hosting service:

 Platforms and How to Deploy 

 **GitHub Pages** 
 Push to a repository → Settings → Pages → Branch `main` 
**Netlify** 
Drag and drop the folder into Netlify Drop 
 **Vercel** 
Run `vercel --prod` in the project folder 

### Verification

After opening the application, confirm it's working correctly:

 The dashboard loads with **4 quick-action cards**
The sidebar shows **6 navigation items** (Dashboard, Smart Email, Meeting Summarizer, AI Task Planner, Research Assistant, AI Chatbot)
 Clicking any sidebar item loads the corresponding tool
 Typing context and clicking "Generate" produces an AI response
   AI outputs are **editable** (click directly on the text)
      The **Responsible AI Disclaimer** is visible at the bottom of each page

### Troubleshooting

 Issue and   Solution 

**Page shows no styles**
solution: Check your internet connection (Font Awesome & Google Fonts CDNs) 
 **Sidebar doesn't collapse on mobile** 
solution: Clear browser cache or try a different browser 
 **Buttons don't respond** 
solution:Open browser console (F12) and check for JavaScript errors
 **AI outputs not appearing** 
 solutionRefresh the page and try again ,mock AI runs locally 
**Editable content resets** 
solution :This is expected; edits are not saved between sessions |



### Optional: Connect to a Real AI API

The current version uses a mock AI generator. To connect to a real LLM (OpenAI, Claude, Gemini):

1. Open `index.html` in a code editor
2. Locate the `AI` object in the `<script>` section
3. Replace each method with an API call, for example:

```javascript
const AI = {
    generateEmail: async (context) => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${YOUR_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: `Write an email about: ${context}` }]
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    }
    // Repeat for other methods...
};


### Need Help?

If you encounter any issues not covered here, please:
- Open an issue on the GitHub repository
- Check the browser console (F12) for error messages
- Ensure you're using an updated browser


