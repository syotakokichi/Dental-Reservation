# backend/app/schemas/event.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum
from .staff import StaffResponseSchema

class EventStatusEnum(str, Enum):
    active = "active"
    canceled = "canceled"

class EventDetailsSchema(BaseModel):
    overview: str

# Base schema with common fields
class EventBaseSchema(BaseModel):
    from_at: datetime
    to_at: datetime
    note: Optional[str]
    title: str
    details: EventDetailsSchema

# Create schema
class EventCreateSchema(EventBaseSchema):
    customer_id: int
    status: EventStatusEnum
    staff_ids: Optional[List[int]]

# Update schema
class EventUpdateSchema(BaseModel):
    from_at: Optional[datetime] = None
    to_at: Optional[datetime] = None
    note: Optional[str] = None
    title: Optional[str] = None
    status: Optional[EventStatusEnum] = None

# Response schema
class EventResponseSchema(EventBaseSchema):
    id: int
    store_id: int
    customer_id: int
    duration_by_minutes: int
    status: EventStatusEnum
    created_at: datetime
    updated_at: datetime
    staffs: List[StaffResponseSchema]

    class Config:
        orm_mode = True