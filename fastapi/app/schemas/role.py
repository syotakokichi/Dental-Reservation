from pydantic import BaseModel

class RoleCreateSchema(BaseModel):
    name: str

    class Config:
        orm_mode = True