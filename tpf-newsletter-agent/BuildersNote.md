# Builder's Note: TPF Newsletter Research Agent

## 1. Tool Stack Used

- **Framework:** Next.js (App Router) + React for the dashboard UI.
- **Styling:** Tailwind CSS + Shadcn UI components for a clean, modern interface.
- **Database:** PostgreSQL (managed by Supabase) interacting via Prisma ORM.
- **AI/LLM Provider:** OpenRouter, using models such as Claude 3.5 Sonnet / Gemini 1.5 Pro to process and synthesize the text.
- **Ingestion:** `rss-parser` to routinely fetch updates from industry sources (TechCrunch, The Verge, OpenAI, Hugging Face, etc.).
- **Scripting & Automation:** Vercel Cron jobs or custom Next.js API routes used to trigger ingestion and AI processing without manual intervention.

## 2. Workflow Design

Our architecture relies on an asynchronous batch-processing pipeline:

1. **Ingestion Layer:** The `/api/cron/ingest` cron job runs routinely. It iterates through the active sources in the PostgreSQL `Source` table, fetches their RSS feeds, and inserts new articles into the `Article` table with a `PENDING` status.
2. **Heuristic Ranking:** Before spending LLM credits, the system ranks pending articles using keyword matching (e.g., "AI", "LLM", "Funding") and recency. This assigns a `heuristicScore` to prioritize the most relevant articles for processing.
3. **AI Processing Layer:** The `/api/cron/process` job picks up the highest-ranking `PENDING` articles in small batches. It sends the title and snippet to the LLM via OpenRouter. The LLM returns a structured JSON response containing:
   - A concise summary
   - A categorization (e.g., "AI Models", "Product Launches")
   - A "Why It Matters" rationale for builders and founders
   - A calculated Importance Score
4. **Digest Generation:** At the end of the week, the system queries the highest-scoring processed articles. It passes them back to the LLM to write an engaging "Executive Summary", and then formats the raw data into a beautiful Markdown digest, grouped by category.

## 3. How a Content Team Could Run This System

We built a user-friendly Dashboard so the content team never has to look at code:

- **Source Management:** Writers can navigate to the `/dashboard` UI to add, toggle, or remove RSS URLs. If they discover a great new Substack, they can simply paste the RSS link into the dashboard and the system will start monitoring it on the next cron cycle.
- **Reviewing Data:** In the "Database" tab, the team can review processed articles to see what the AI extracted. They can sort by `ImportanceScore` to verify the AI is surfacing the best content.
- **Digest Export:** On the "Analytics" or future Export tab, writers can click to generate the weekly digest markdown. They can then copy-paste this markdown directly into their publishing platform (e.g., Substack, Beehiiv, or Notion), doing final editorial touches before sending it out. The entire research phase—which usually takes hours—is reduced to a single click.

## 4. Sources Mentioned

This sample project monitors the following data sources for the digest output:
- TechCrunch AI
- The Verge AI
- MIT Technology Review AI
- OpenAI Blog
- Hugging Face Blog
