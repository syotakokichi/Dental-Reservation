# app/api/v1/staff.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.schemas.staff import StaffCreateSchema, StaffUpdateSchema, StaffResponseSchema, StaffAttributeResponseSchema
from app.services.staff_service import get_staff_service, StaffService
from app.db.database import get_db
from app.services.auth_service import get_auth_service, AuthService
from app.models.staff import Staff

router = APIRouter()

@router.get("/stores/{store_id}/me", response_model=StaffResponseSchema)
def get_my_account(store_id: int, token: str = Header(...), auth_service: AuthService = Depends(get_auth_service)):
    current_staff = auth_service.get_current_staff(token)
    if not current_staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    # staff_attributes の最初の要素を取得
    if current_staff.staff_attributes:
        staff_attributes = current_staff.staff_attributes[0]
    else:
        raise HTTPException(status_code=404, detail="Staff attributes not found")

    if current_staff.staff_attributes:
        staff_attributes = current_staff.staff_attributes[0]
    else:
        raise HTTPException(status_code=422, detail="Staff attributes are missing or invalid")  # 422エラーの詳細を追加
    return staff_attributes

@router.put("/stores/{store_id}/me")
def update_my_account(store_id: int, data: StaffUpdateSchema, service: StaffService = Depends(get_staff_service)):
    return service.update_my_account(store_id, data)

@router.get("/stores/{store_id}/staffs")
def get_staffs(store_id: int, service: StaffService = Depends(get_staff_service)):
    return service.get_staffs(store_id)

@router.post("/stores/{store_id}/staffs")
def create_staff(data: StaffCreateSchema, db: Session = Depends(get_db), service: StaffService = Depends(get_staff_service)):
    role = service.get_role(data.role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    store_id = role.store_id

    new_staff = service.create_staff(store_id, data)

    # 複数のstaff_attributesがある場合、最初の要素にアクセスします
    if new_staff.staff_attributes:
        first_attribute = new_staff.staff_attributes[0]
        print(first_attribute.name)
        print(first_attribute.name_ruby)
        print(first_attribute.mail_address)

    response = StaffResponseSchema(
        id=new_staff.id,
        role_id=new_staff.role_id,
        store_id=new_staff.store_id,
        # ここではリストの最初の要素をレスポンスに含める
        staff_attributes=StaffAttributeResponseSchema.from_orm(new_staff.staff_attributes[0]) if new_staff.staff_attributes else None
    )
    return response

@router.get("/stores/{store_id}/staffs/{staff_id}")
def get_staff(store_id: int, staff_id: int, service: StaffService = Depends(get_staff_service)):
    return service.get_staff(store_id, staff_id)

@router.put("/stores/{store_id}/staffs/{staff_id}")
def update_staff(store_id: int, staff_id: int, data: StaffUpdateSchema, service: StaffService = Depends(get_staff_service)):
    return service.update_staff(store_id, staff_id, data)

@router.delete("/stores/{store_id}/staffs/{staff_id}")
def delete_staff(store_id: int, staff_id: int, service: StaffService = Depends(get_staff_service)):
    return service.delete_staff(store_id, staff_id)