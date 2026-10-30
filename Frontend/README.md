# ResearchFlow AI

A premium, professional frontend for a Python multi-agent research system. ResearchFlow AI provides a polished AI research workspace that connects to your existing FastAPI backend and visualizes the four-agent pipeline: Search, Reader, Writer, and Critic.

## Tech Stack

- **Vite** — build tool and dev server
- **React 18** — UI framework
- **JavaScript (ES6+)** — no TypeScript
- **Tailwind CSS v4** — utility-first styling
- **React Router DOM** — client-side routing
- **Lucide React** — icons
- **React Markdown** — report rendering

## Prerequisites

- Node.js 18+ and npm
- A running Python FastAPI backend (the multi-agent research system)

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure the Backend URL

Copy the example environment file and adjust if needed:

```bash
cp .env.example .env
```

The default configuration points to a local backend:

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

If your FastAPI server runs on a different host or port, update this value.

## 3. Start the Python FastAPI Server

Make sure your Python backend is running and listening on `http://127.0.0.1:8000`. The backend must expose:

- `GET /` — health check (returns any 2xx response)
- `POST /research` — accepts `{ "topic": "string" }` and returns:

```json
{
  "success": true,
  "topic": "...",
  "search_result": "...",
  "scraped_content": "...",
  "report": "...",
  "feedback": "..."
}
```

The backend must also allow CORS from `http://localhost:5173` (the Vite dev server origin). If you change the Vite port, update your backend's CORS configuration to match.

## 4. Start the Vite Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 5. Test the API Connection

- On launch, the app checks the backend by calling `GET /`.
- The sidebar and header show a connection indicator: **Connected**, **Disconnected**, or **Checking connection**.
- Use the **Refresh** button in the header to re-check the connection at any time.
- Enter a topic on the Overview page and click **Generate Research** to submit a `POST /research` request.

## 6. Build for Production

```bash
npm run build
```

This produces an optimized bundle in the `dist/` directory. Preview it locally with:

```bash
npm run preview
```

## Features

- **Overview dashboard** with research input, example topics, and pipeline explanation
- **Research workspace** with agent pipeline visualization, loading/error/empty states
- **Tabbed results** — Final Report, Search Results, Extracted Content, Critic Feedback
- **Markdown rendering** with headings, lists, blockquotes, code blocks, and tables
- **Copy report** and **Download as Markdown** actions
- **Local research history** (localStorage, last 20 entries, with delete and clear-all)
- **About the Agents** page explaining the architecture
- **Responsive design** with collapsible mobile sidebar
- **AbortController** request timeout (180s) and cancellation
- **Toast notifications** for user feedback

## Project Structure

```
src/
├── components/      Reusable UI components
├── pages/           Route-level page components
├── services/        API client (researchApi.js)
├── hooks/           Custom React hooks
├── utils/           Local storage utilities
├── App.jsx          Routes + layout
├── main.jsx         Entry point
└── index.css        Tailwind + design system
```

## Notes

- The backend returns the completed pipeline as a single HTTP response. The agent pipeline visualization in the UI shows an illustrative progress animation, not confirmed live agent events.
- Research history is stored locally in the browser (localStorage) and is not synced to the backend or across devices.
- No authentication is implemented — this is a local research tool.
