# app/schemas/staff.py
from pydantic import BaseModel
from typing import List

class StaffAttributeBase(BaseModel):
    name: str
    name_ruby: str
    mail_address: str

class StaffAttributeResponseSchema(BaseModel):
    name: str
    name_ruby: str
    mail_address: str

    class Config:
        orm_mode = True

class StaffCreateSchema(BaseModel):
    role_id: int
    staff_attributes: StaffAttributeBase
    password: str

class StaffUpdateSchema(BaseModel):
    name: str
    role: str

class StaffResponseSchema(BaseModel):
    id: int
    role_id: int
    store_id: int
    staff_attributes: List[StaffAttributeResponseSchema]

    class Config:
        orm_mode = True