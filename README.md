# AI-Powered Interview Assistant

This is a React + TypeScript web application that simulates an AI-driven interview workflow, with separate interfaces for **Interviewees** (candidates) and **Interviewers** (recruiters). It was created as part of an internship/project assignment.

---

## 📂 Project Structure

.
├── public/
│ └── index.html
├── src/
│ ├── components/
│ ├── pages/
│ ├── utils/
│ ├── types.ts
│ ├── client.ts
│ └── ...
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

markdown
Copy code

- `src/components/` — Reusable UI components (upload, cards, chat, timer, etc.).  
- `src/pages/` — Pages/views like IntervieweePage, InterviewerPage, NotFound, etc.  
- `src/utils/` — Helper functions (parsing, API wrappers).  
- `client.ts` — Configuration for API / AI backend calls.  
- `types.ts` — Shared TypeScript types/interfaces.  

---

## 🚀 Features & Flow

### Interviewee Side

- Upload a resume file (PDF, possibly DOCX).  
- Automatically parse **Name, Email, Phone** from the resume.  
- If any critical field is missing, prompt user to provide it manually.  
- Conduct a **timed interview** with **6 questions**:
  - 2 Easy  
  - 2 Medium  
  - 2 Hard  
- Timer settings:
  - Easy: 20 seconds  
  - Medium: 60 seconds  
  - Hard: 120 seconds  
- Answers auto-submit when time runs out.  
- After finishing, provide a **final score** + AI-generated summary for the interview.

### Interviewer Side

- Dashboard listing all candidates, **sorted by score**.  
- View candidate’s profile, detailed chat history (questions, answers, scores).  
- View the AI-generated summary for each candidate.  
- Search / sort candidates.  

### Persistence, Resilience & UX

- State is persisted locally—so refreshing or accidental navigation away does not lose progress.  
- Pause / resume support with a “Welcome Back” modal if the page reloads.  
- Proper error handling, file validations, and UX feedback flows.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend**: React + TypeScript  
- **Bundler / Dev Tool**: Vite  
- **Styling**: Tailwind CSS / custom styles  
- **State & Persistence**: React state + local storage / persistence logic  
- **API / AI**: (You can integrate OpenAI, or another AI backend)  
- **Others**: any helper libs for file parsing, timing, etc.

---

## ✅ Getting Started

1. **Clone the repository**  
   ```bash
   git clone https://github.com/MoulyaS19/AI-Powered-Interview-Assistant.git
   cd AI-Powered-Interview-Assistant
Install dependencies

bash
Copy code
npm install
# or if you prefer yarn / pnpm
Configure environment variables
Create a .env file (don’t commit it) and add necessary keys, e.g.:

ini
Copy code
VITE_API_BASE_URL=<your_backend_api_url>
VITE_OPENAI_API_KEY=<your_openai_key>
Run the development server

bash
Copy code
npm run dev
Then open your browser at http://localhost:3000 (or as specified by Vite).

Build for production

bash
Copy code
npm run build
🧪 Usage & Demo Flow
As a candidate, upload your resume and go through the interview questions.

On completion, see your score and summary.

As an interviewer, log in/view the dashboard to review all candidate results.

Click individual candidates to inspect their full interview log, score, and AI summary.

🔍 Future Improvements & To-Do
Add authentication / login for interviewers and candidates.

Backend integration for storage (database) instead of pure local persistence.

More advanced NLP / AI logic to generate feedback and questions.

Allow customization of interview question sets, difficulty, timing.

Improve UI / UX, handle mobile / responsive more polished.

Add unit tests, integration tests.

🧾 License & Acknowledgments
This project is for educational / assignment use.

Optionally include a license (e.g. MIT) or attribution.
