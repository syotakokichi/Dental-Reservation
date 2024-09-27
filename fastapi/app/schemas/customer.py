# schemas/customer.py
from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from datetime import datetime

class SexEnum(str, Enum):
    male = "male"
    female = "female"
    unknown = "unknown"

class CustomerAttributeBase(BaseModel):
    name: str
    name_ruby: str
    mail_address: str
    sex: SexEnum
    phone_number: str
    postal_code: str
    prefecture: str
    street: str
    address: str
    building: str

class CustomerAttributeResponseSchema(BaseModel):
    name: str
    name_ruby: str
    mail_address: str
    sex: SexEnum
    phone_number: str
    postal_code: str
    prefecture: str
    street: str
    address: str
    building: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class CustomerCreateSchema(BaseModel):
    customer_attributes: CustomerAttributeBase

class CustomerResponseSchema(BaseModel):
    id: int
    store_id: int
    customer_attributes: List[CustomerAttributeResponseSchema]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class CustomerUpdateSchema(BaseModel):
    customer_attributes: CustomerAttributeBase

    class Config:
        orm_mode = True