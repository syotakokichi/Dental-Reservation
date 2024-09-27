# backend/app/services/staff_service.py

import logging
from sqlalchemy.orm import Session
from app.repositories.staff_repository import StaffRepository
from app.models.staff import Staff
from app.models.staff_attribute import StaffAttribute
from app.models.role import Role
from typing import List
from app.db.database import get_db
from fastapi import Depends, HTTPException
from app.services.auth_service import AuthService
from app.schemas.staff import StaffCreateSchema, StaffAttributeResponseSchema, StaffResponseSchema
from jose import jwt, JWTError
from app.core.config import settings

# ログの設定
logger = logging.getLogger(__name__)

class StaffService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = StaffRepository()
        self.auth_service = AuthService(db)

    def get_staff_by_supabase_id(self, supabase_id: str) -> Staff:
        logger.debug(f"Getting staff by Supabase ID: {supabase_id}")
        staff = self.db.query(Staff).filter(Staff.email == supabase_id).first()
        logger.debug(f"Staff found: {staff}")
        return staff

    def get_role(self, role_id: int) -> Role:
        """
        role_id に基づいて Role オブジェクトを取得します。
        """
        return self.db.query(Role).filter(Role.id == role_id).first()

    def create_staff(self, store_id: int, data: StaffCreateSchema) -> Staff:
        """
        新しいスタッフを作成し、DBに保存します。
        """
        hashed_password = self.auth_service.get_password_hash(data.password)

        new_staff = Staff(store_id=store_id, role_id=data.role_id)
        self.db.add(new_staff)
        self.db.commit()
        self.db.refresh(new_staff)

        # StaffAttribute オブジェクトを Staff に関連付けて作成する
        staff_attribute = StaffAttribute(
            staff_id=new_staff.id,
            name=data.staff_attributes.name,
            name_ruby=data.staff_attributes.name_ruby,
            mail_address=data.staff_attributes.mail_address,
            hashed_password=hashed_password
        )
        self.db.add(staff_attribute)
        self.db.commit()
        self.db.refresh(staff_attribute)

        return new_staff

    def create_staff_from_supabase(self, supabase_staff: dict) -> Staff:
        logger.debug(f"Creating staff from Supabase data: {supabase_staff}")
        staff_data = {
            'supabase_id': supabase_staff['sub'],
            'name': supabase_staff.get('user_metadata', {}).get('full_name', ''),
            'email': supabase_staff['email'],
        }
        return self.create_staff(staff_data)

    def get_my_account(self, store_id: int, staff_id: int) -> StaffAttributeResponseSchema:
        staff = self.db.query(Staff).filter(Staff.store_id == store_id, Staff.id == staff_id).first()
        if not staff or not staff.staff_attributes:
            raise HTTPException(status_code=404, detail="Staff or Staff attributes not found")

        staff_attributes = staff.staff_attributes[0]
        return StaffAttributeResponseSchema.from_orm(staff_attributes)

    def update_my_account(self, store_id: int, data: dict) -> Staff:
        logger.debug(f"Updating my account for store ID: {store_id} with data: {data}")
        staff = self.db.query(Staff).filter(Staff.store_id == store_id).first()
        if staff:
            for key, value in data.items():
                setattr(staff, key, value)
            self.db.commit()
            self.db.refresh(staff)
            logger.debug(f"My account updated: {staff}")
        return staff

    def get_staffs(self, store_id: int) -> List[StaffResponseSchema]:
        logger.debug(f"Getting staffs for store ID: {store_id}")

        # スタッフと関連するスタッフ属性をJOINして取得する
        staffs = self.db.query(Staff).filter(Staff.store_id == store_id).all()

        # スタッフ情報にstaff_attributesを付けてレスポンス
        staff_responses = []
        for staff in staffs:
            if staff.staff_attributes:
                staff_attributes = staff.staff_attributes[0]  # 最初のスタッフ属性を取得
                staff_responses.append(StaffResponseSchema(
                id=staff.id,
                role_id=staff.role_id,
                store_id=staff.store_id,
                staff_attributes=[StaffAttributeResponseSchema.from_orm(staff_attributes)]
            ))

        logger.debug(f"Staffs found: {staff_responses}")
        return staff_responses

    def get_staff(self, store_id: int, staff_id: int) -> Staff:
        logger.debug(f"Getting staff ID: {staff_id} for store ID: {store_id}")
        staff = self.db.query(Staff).filter(Staff.store_id == store_id, Staff.id == staff_id).first()
        logger.debug(f"Staff found: {staff}")
        return staff

    def update_staff(self, store_id: int, staff_id: int, data: dict) -> Staff:
        logger.debug(f"Updating staff ID: {staff_id} for store ID: {store_id} with data: {data}")
        staff = self.db.query(Staff).filter(Staff.store_id == store_id, Staff.id == staff_id).first()
        if staff:
            for key, value in data.items():
                setattr(staff, key, value)
            self.db.commit()
            self.db.refresh(staff)
            logger.debug(f"Staff updated: {staff}")
        return staff

    def delete_staff(self, store_id: int, staff_id: int) -> None:
        logger.debug(f"Deleting staff ID: {staff_id} for store ID: {store_id}")
        staff = self.db.query(Staff).filter(Staff.store_id == store_id, Staff.id == staff_id).first()
        if staff:
            self.db.delete(staff)
            self.db.commit()
            logger.debug(f"Staff deleted: {staff}")

    def get_staff_id_from_token(self, token: str) -> int:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            staff_id: int = payload.get("sub")
            if staff_id is None:
                raise HTTPException(status_code=401, detail="Invalid token")
            return staff_id
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

# FastAPIの依存関係として使用するための関数
def get_staff_service(db: Session = Depends(get_db)) -> StaffService:
    return StaffService(db=db)