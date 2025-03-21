from app.models.agent import Agent
from app.tasks.agent_tasks import process_agent_task
from app.db.base import SessionLocal
from app.db.models import AgentLog

def get_all_agents():
    agents = [
        Agent(id="chatbot", name="Chat Bot", description="A conversational AI agent."),
        Agent(id="summarizer", name="Text Summarizer", description="Summarizes long text documents."),
        Agent(id="translator", name="Language Translator", description="Translates text between languages."),
        Agent(id="sentiment", name="Sentiment Analyzer", description="Analyzes sentiment of input text.")
    ]
    return [agent.dict() for agent in agents]

def run_agent(agent_id: str, payload: dict, user_id: int = None):
    # Dispatch the task asynchronously via Celery, including user_id for conversation logging
    task = process_agent_task.delay(agent_id, payload, user_id)
    # Log the request in the database
    db = SessionLocal()
    try:
        log = AgentLog(agent_id=agent_id, payload=str(payload), result="Pending")
        db.add(log)
        db.commit()
    finally:
        db.close()
    return {"task_id": task.id}
