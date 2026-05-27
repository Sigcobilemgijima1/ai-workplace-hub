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
 Setup Instructions

 Prerequisites

 A modern web browser (Chrome, Firefox, Safari, or Edge)
 Internet connection (for loading fonts and icons from CDNs)
 No server, database, or API keys required to run the basic version

 The application runs entirely in your browser with no backend dependencies.



 Option 1: Run Locally (Easiest)

1. Download or clone this repository to your computer
2. Navigate to the project folder
3. Doubleclick the `index.html` file
4. The application will open in your default web browser



 Option 2: Run with a Local Server (Recommended)

Using a local server prevents potential issues with file paths and assets.

Using Python 3:
```bash
cd AIProductivityAssistant
python m http.server 8000
```

Using Node.js:
```bash
npx serve
```

Using VS Code:
 Install the "Live Server" extension
 Rightclick `index.html`
 Select "Open with Live Server"

Once the server is running, open your browser and go to:
```
http:localhost:8000
```



 Option 3: Deploy Online

Upload the project folder to any static hosting service:

 Platform and Instructions 

 GitHub Pages 
instructions : Push to a repository → Settings → Pages → Branch `main` 
 Netlify
instructions : Drag and drop the project folder into Netlify Drop 
 Vercel 
instructions :Run `vercel prod` in the project folder 



 Verifying It Works

After opening the application, confirm the following:

   The dashboard loads with 4 quickaction cards
   The sidebar shows 6 navigation items
   Clicking any sidebar item loads the corresponding tool
   Typing input and clicking "Generate" produces an AI response
   AI outputs are editable (click directly on the text)
   The Responsible AI Disclaimer is visible



 Troubleshooting

 Issue and Solution 

 Page has no styles 
solutions : Check your internet connection (CDNs need to load) 

 Buttons don't respond 
solutions :error sole (F12) and check for errors 

TypeScript compilation errors 
solutions version to ensure TypeScript is installed 
| Edits disappear after refresh 
solutionexpected; no data persistence in this version |



 Optional: Connect to a Real AI API

The current version uses a mock AI generator. To connect to a real LLM (OpenAI, Claude, or Gemini):

1. Open the TypeScript source files in `src/`
2. Locate the AI service functions
3. Replace the mock responses with API fetch calls
4. Recompile with `tsc`
5. Add your API key as an environment variable (never hardcode keys)





