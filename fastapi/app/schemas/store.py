from pydantic import BaseModel

class StoreCreateSchema(BaseModel):
    name: str
    name_ruby: str
    postal_code: str
    prefecture: str
    street: str
    address: str
    building: str
    phone_number: str

class StoreUpdateSchema(BaseModel):
    name: str
    name_ruby: str
    postal_code: str
    prefecture: str
    street: str
    address: str
    building: str
    phone_number: str