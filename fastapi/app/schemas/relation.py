from pydantic import BaseModel

# Relation schema for Event and Staff
class RelationOfEventAndStaffSchema(BaseModel):
    id: int
    event_id: int
    staff_id: int
    created_at: str
    updated_at: str

    class Config:
        orm_mode = True