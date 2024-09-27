# app/dependencies.py
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.services.auth_service import get_current_staff
from app.schemas.staff import Staff

def require_role(required_role: str):
    def role_checker(current_staff: Staff = Depends(get_current_staff)):
        if current_staff.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action"
            )
        return current_staff
    return role_checker