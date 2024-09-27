# backend/app/services/event_service.py
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.event import Event
from app.schemas.event import EventCreateSchema, EventUpdateSchema, EventResponseSchema
from app.db.database import get_db
from fastapi import Depends
from app.models.relation_of_event_and_staff import RelationOfEventAndStaff
from app.models.staff import Staff

class EventService:
    def __init__(self, db: Session):
        self.db = db

    def get_events(self, store_id: int):
        events = self.db.query(Event).filter(Event.store_id == store_id).all()
        return events

    def create_event(self, store_id: int, data: EventCreateSchema) -> Event:
        # from_atとto_atの差分を計算してduration_by_minutesに設定
        duration = int((data.to_at - data.from_at).total_seconds() / 60)

        # Event インスタンスを作成
        new_event = Event(
            store_id=store_id,
            customer_id=data.customer_id,
            duration_by_minutes=duration,
            from_at=data.from_at,
            to_at=data.to_at,
            note=data.note,
            details={"overview": data.details.overview},
            status=data.status,
            title=data.title,
        )
        # データベースに追加
        self.db.add(new_event)
        self.db.commit()
        self.db.refresh(new_event)

        # staff_ids がある場合は、relations_of_event_and_staffs テーブルにデータを保存
        if hasattr(data, 'staff_ids') and data.staff_ids:
            for staff_id in data.staff_ids:
                relation = RelationOfEventAndStaff(
                    event_id=new_event.id,
                    staff_id=staff_id
                )
                self.db.add(relation)

        self.db.commit()
        return new_event

    def get_event(self, store_id: int, event_id: int):
        event = self.db.query(Event).filter(Event.store_id == store_id, Event.id == event_id).first()
        if not event:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        return event

    def update_event(self, store_id: int, event_id: int, event_data: EventUpdateSchema):
        event = self.get_event(store_id, event_id)
        for key, value in event_data.dict().items():
            setattr(event, key, value)
        self.db.commit()
        self.db.refresh(event)
        return event

    def delete_event(self, store_id: int, event_id: int):
        event = self.get_event(store_id, event_id)
        self.db.delete(event)
        self.db.commit()
        return {"detail": "Event deleted"}

    def get_event_with_staff(self, store_id: int, event_id: int):
        event = self.db.query(Event)\
            .options(joinedload(Event.staffs).joinedload(Staff.staff_attributes))\
            .filter(Event.store_id == store_id, Event.id == event_id)\
            .first()

        if not event:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

        event_response = EventResponseSchema.from_orm(event)
        return event_response

# この関数を使って `EventService` の依存関係を解決します
def get_event_service(db: Session = Depends(get_db)) -> EventService:
    return EventService(db)