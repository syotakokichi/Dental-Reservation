from sqlalchemy.orm import Session
from app.models.staff import Staff
from typing import List
from app.db.database import get_db

class StaffRepository:
    def __init__(self):
        self.db = next(get_db())

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Staff]:
        return self.db.query(Staff).offset(skip).limit(limit).all()

    def get_by_id(self, staff_id: int) -> Staff:
        return self.db.query(Staff).filter(Staff.id == staff_id).first()