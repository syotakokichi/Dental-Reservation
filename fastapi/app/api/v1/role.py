from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...schemas.role import RoleCreateSchema
from ...services.role_service import RoleService, get_role_service
from ...db.database import get_db

router = APIRouter()

@router.post("/roles", response_model=RoleCreateSchema)
def create_role(store_id: int, data: RoleCreateSchema, db: Session = Depends(get_db), service: RoleService = Depends(get_role_service)):
    return service.create_role(store_id, data)