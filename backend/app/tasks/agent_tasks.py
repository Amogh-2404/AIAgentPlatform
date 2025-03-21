import time
from celery import Celery
from app.core.config import settings
from app.db.base import SessionLocal
from app.db.models import AgentLog, Conversation

celery_app = Celery("worker", broker=settings.CELERY_BROKER_URL, backend=settings.CELERY_RESULT_BACKEND)


@celery_app.task
def process_agent_task(agent_id: str, payload: dict, user_id: int = None):
    time.sleep(3)  # Simulate processing time
    if agent_id == "chatbot":
        result = f"Chatbot response to '{payload.get('input', '')}'"
    elif agent_id == "summarizer":
        text = payload.get('text', '')
        result = f"Summary: {text[:50]}..."
    elif agent_id == "translator":
        text = payload.get('text', '')
        result = f"Translated: {text[::-1]}"
    elif agent_id == "sentiment":
        text = payload.get('text', '')
        result = "Positive" if "good" in text.lower() else "Negative"
    else:
        result = "Agent not found"

    db = SessionLocal()
    try:
        log = db.query(AgentLog).order_by(AgentLog.created_at.desc()).first()
        if log:
            log.result = result
            db.commit()
        if user_id and agent_id == "chatbot":
            import json
            conversation_data = json.dumps({
                "user_input": payload.get('input', ''),
                "response": result
            })
            conv = Conversation(user_id=user_id, agent_id=agent_id, conversation=conversation_data)
            db.add(conv)
            db.commit()
    finally:
        db.close()
    return result
