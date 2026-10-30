
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .pipeline import run_research_pipeline

app = FastAPI(title="Research API")

# Allow requests from the Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Expected request body
class ResearchRequest(BaseModel):
    topic: str


@app.get("/")
def home():
    return {"message": "Research API is running"}


@app.post("/research")
def generate_research(request: ResearchRequest):
    topic = request.topic.strip()

    if not topic:
        raise HTTPException(
            status_code=400,
            detail="Research topic is required",
        )

    try:
        result = run_research_pipeline(topic)

        return {
            "success": True,
            "topic": topic,
            "search_result": result.get("search_result", ""),
            "scraped_content": result.get("scraped_content", ""),
            "report": result.get("report", ""),
            "feedback": result.get("feedback", ""),
        }

    except Exception as error:
        # Log the real error on the server
        print("Research pipeline failed:", error)

        raise HTTPException(
            status_code=500,
            detail="Research generation failed. Please try again.",
        ) from error
    








# run command - uv run python -m uvicorn multi_agent_system.api:app --reload

#- uv run python -m uvicorn multi_agent_system.api:app --reload --app-dir src
