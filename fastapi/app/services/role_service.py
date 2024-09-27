from sqlalchemy.orm import Session
from app.models.role import Role
from app.schemas.role import RoleCreateSchema
from app.db.database import get_db
from fastapi import Depends

class RoleService:
    def __init__(self, db: Session):
        self.db = db

    def create_role(self, store_id: int, data: RoleCreateSchema):
        new_role = Role(store_id=store_id, **data.dict())
        self.db.add(new_role)
        self.db.commit()
        self.db.refresh(new_role)
        return new_role

def get_role_service(db: Session = Depends(get_db)) -> RoleService:
    return RoleService(db)