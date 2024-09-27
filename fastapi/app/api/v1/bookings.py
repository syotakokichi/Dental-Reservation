from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...schemas.event import EventCreateSchema, EventUpdateSchema, EventResponseSchema
from ...services.event_service import EventService, get_event_service
from ...db.database import get_db
from typing import List

router = APIRouter()

# 1. 店舗IDに紐づいた予約（イベント）のリストを取得するエンドポイント。
@router.get("/stores/{store_id}/bookings", response_model=List[EventResponseSchema])
def get_bookings(store_id: int, db: Session = Depends(get_db), service: EventService = Depends(get_event_service)):
    # イベントサービスを使って、指定された店舗IDに対応する全てのイベントを取得
    events = service.get_events(store_id)
    # 取得したイベントのリストを、PydanticモデルであるEventResponseSchemaのリストに変換して返す
    return [EventResponseSchema.from_orm(event) for event in events]

# 2. 新しい予約（イベント）を作成するエンドポイント。
@router.post("/stores/{store_id}/bookings", response_model=EventResponseSchema)
def create_booking(store_id: int, data: EventCreateSchema, db: Session = Depends(get_db), service: EventService = Depends(get_event_service)):
    # Event を作成
    new_event = service.create_event(store_id, data)
    return EventResponseSchema.from_orm(new_event)

# 3. 指定された予約（イベント）を取得するエンドポイント。
@router.get("/stores/{store_id}/bookings/{booking_id}", response_model=EventResponseSchema)
def get_booking(store_id: int, booking_id: int, db: Session = Depends(get_db), service: EventService = Depends(get_event_service)):
    # イベントサービスを使って、指定された店舗IDと予約IDに対応するイベントを取得
    event = service.get_event(store_id, booking_id)
    # 取得したイベントをPydanticモデルのEventResponseSchemaに変換して返す
    return EventResponseSchema.from_orm(event)

# 4. 指定された予約（イベント）を更新するエンドポイント。
@router.put("/stores/{store_id}/bookings/{booking_id}", response_model=EventResponseSchema)
def update_booking(store_id: int, booking_id: int, data: EventUpdateSchema, db: Session = Depends(get_db), service: EventService = Depends(get_event_service)):
    # イベントサービスを使って、指定された店舗IDと予約IDに基づいてイベントを更新
    event = service.update_event(store_id, booking_id, data)
    # 更新したイベントをPydanticモデルのEventResponseSchemaに変換して返す
    return EventResponseSchema.from_orm(event)

# 5. 指定された予約（イベント）を削除するエンドポイント。
@router.delete("/stores/{store_id}/bookings/{booking_id}", response_model=EventResponseSchema)
def delete_booking(store_id: int, booking_id: int, db: Session = Depends(get_db), service: EventService = Depends(get_event_service)):
    # 削除する前にイベントを取得
    event = service.get_event(store_id, booking_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # イベントを削除
    service.delete_event(store_id, booking_id)

    # 削除されたイベントをレスポンスとして返す
    return EventResponseSchema.from_orm(event)