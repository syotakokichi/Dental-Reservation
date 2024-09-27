# app/api/v1/auth.py
from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi.security import OAuth2PasswordBearer
from ...schemas.auth import LoginSchema, PasswordResetRequestSchema, PasswordResetVerifySchema, PasswordResetSchema
from ...services.auth_service import get_auth_service, AuthService

router = APIRouter()

# トークン取得のための OAuth2PasswordBearer を設定
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/auth/login")
def login(data: LoginSchema, service: AuthService = Depends(get_auth_service)):
    return service.login(data)

@router.post("/auth/logout")
def logout(authorization: str = Header(...), service: AuthService = Depends(get_auth_service)):
    # Authorization ヘッダーの内容をログに出力
    print(f"Authorization header: {authorization}")

    if "Bearer" not in authorization:
        raise HTTPException(status_code=400, detail="Invalid Authorization header format")

    token = authorization.split(" ")[1]  # "Bearer <token>" の形式からトークン部分を取得
    return service.logout(token)

@router.post("/auth/password/reset")
def password_reset_request(data: PasswordResetRequestSchema, service: AuthService = Depends(get_auth_service)):
    return service.request_password_reset(data)

@router.post("/auth/password/verify")
def password_reset_verify(data: PasswordResetVerifySchema, service: AuthService = Depends(get_auth_service)):
    return service.verify_password_reset(data)

@router.put("/auth/password/reset")
def password_reset(data: PasswordResetSchema, service: AuthService = Depends(get_auth_service)):
    return service.reset_password(data)