# backend/app/api/v1/event.py

from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.schemas.event import EventResponseSchema
from app.services.event_service import EventService, get_event_service
from app.db.database import get_db

router = APIRouter()

@router.get("/stores/{store_id}/events/{event_id}", response_model=EventResponseSchema)
def get_event_with_staff(
    store_id: int,
    event_id: int,
    db: Session = Depends(get_db),
    service: EventService = Depends(get_event_service)
):
    """
    Storeに関連する特定のイベントと、関連するスタッフ情報を返します
    """
    event_with_staff = service.get_event_with_staff(store_id, event_id)
    return event_with_staff