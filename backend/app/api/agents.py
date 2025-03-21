from fastapi import APIRouter, HTTPException, Query, Depends, Request
from app.services.ai_agent_service import get_all_agents, run_agent
from celery.result import AsyncResult
from app.core.security import get_current_user
from app.core.rate_limiter import check_rate_limit
from app.models.user import User
from app.db.base import SessionLocal
from app.db.models import Conversation

router = APIRouter()

@router.get("/")
def list_agents():
    return {"agents": get_all_agents()}

@router.post("/{agent_id}/run")
def run_agent_endpoint(
    agent_id: str,
    payload: dict,
    request: Request,
    current_user: User = Depends(get_current_user),
    _: None = Depends(check_rate_limit)
):
    task_info = run_agent(agent_id, payload, user_id=current_user.id)
    return {"message": "Task submitted", "task_id": task_info["task_id"]}

@router.get("/task_status/")
def get_task_status(task_id: str = Query(..., description="Celery task ID")):
    result = AsyncResult(task_id)
    if result.state == "PENDING":
        return {"state": result.state, "result": None}
    elif result.state != "FAILURE":
        return {"state": result.state, "result": result.result}
    else:
        raise HTTPException(status_code=500, detail=str(result.info))

@router.get("/conversations")
def get_conversations(current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    try:
        conversations = db.query(Conversation).filter(Conversation.user_id == current_user.id).all()
        conv_list = []
        for conv in conversations:
            conv_list.append({
                "id": conv.id,
                "agent_id": conv.agent_id,
                "conversation": conv.conversation,
                "created_at": conv.created_at.isoformat()
            })
        return {"conversations": conv_list}
    finally:
        db.close()
