# app/services/auth_service.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from ..db.database import get_db
from ..models.staff import Staff
from ..models.staff_attribute import StaffAttribute
from ..core.config import settings
from ..schemas.auth import LoginSchema, PasswordResetSchema, PasswordResetRequestSchema, PasswordResetVerifySchema
from ..schemas.token import TokenData

# パスワードハッシュ化のためのコンテキスト設定
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWTの設定
SECRET_KEY = settings.SUPABASE_JWT_SECRET
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

class AuthService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def login(self, data: LoginSchema):
        """
        ログイン処理を行います。
        """
        # Emailでスタッフを検索して認証
        staff = self.authenticate_staff(data.email, data.password)
        if not staff:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # StaffAttribute からメールアドレスを取得
        staff_attribute = self.db.query(StaffAttribute).filter(StaffAttribute.staff_id == staff.id).first()

        # アクセストークンの生成
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self.create_access_token(
            data={"sub": staff_attribute.mail_address}, expires_delta=access_token_expires
        )

        # トークンを返す
        return {"access_token": access_token, "token_type": "bearer"}

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        パスワードが正しいかを確認します。
        """
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """
        パスワードをハッシュ化します。
        """
        return pwd_context.hash(password)

    def create_access_token(self, data: dict, expires_delta: timedelta = None) -> str:
        """
        アクセストークンを作成します。
        """
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def authenticate_staff(self, email: str, password: str) -> Staff:
        """
        スタッフの認証を行います。
        """
        # StaffAttributeからemailを取得して対応するStaffを見つける
        staff_attribute = self.db.query(StaffAttribute).filter(StaffAttribute.mail_address == email).first()

        if not staff_attribute:
            return None

        # StaffAttributeから関連するStaffを取得
        staff = self.db.query(Staff).filter(Staff.id == staff_attribute.staff_id).first()

        if not staff or not self.verify_password(password, staff_attribute.hashed_password):
            return None
        return staff

    def get_current_staff(self, token: str) -> Staff:
        """
        現在のスタッフを取得します。
        """
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
            token_data = TokenData(email=email)
        except JWTError:
            raise credentials_exception
        staff = self.db.query(Staff).join(StaffAttribute).filter(StaffAttribute.mail_address == token_data.email).first()
        if staff is None:
            raise credentials_exception
        return staff

    def logout(self, token: str):
        """
        トークンを無効化してログアウトします。
        トークンを検証して、その後ログアウト処理を行います。
        """
        # トークンの有効性を確認
        try:
            staff = self.get_current_staff(token)
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # ここでブラックリストへの追加や他の処理を行う
        return {"message": "Successfully logged out"}

    def reset_password(self, data: PasswordResetSchema):
        """
        パスワードをリセットします。
        """
        # StaffAttributeからemailでスタッフを取得
        staff_attribute = self.db.query(StaffAttribute).filter(StaffAttribute.mail_address == data.email).first()

        if not staff_attribute:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Staff not found"
            )

        # 新しいパスワードをハッシュ化して保存
        hashed_password = self.get_password_hash(data.new_password)
        staff_attribute.hashed_password = hashed_password
        self.db.commit()

        return {"message": "Password reset successfully"}

    def request_password_reset(self, data: PasswordResetRequestSchema):
        """
        パスワードリセットのリクエスト処理を行います。
        指定されたメールアドレスに対応するスタッフを検索し、パスワードリセットのリンクを送信します。
        """
        # メールアドレスに対応するスタッフを検索
        staff_attribute = self.db.query(StaffAttribute).filter(StaffAttribute.mail_address == data.email).first()

        if not staff_attribute:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Staff not found with this email address",
            )

        # パスワードリセットトークンの生成 (仮)
        reset_token = self.create_access_token(data={"sub": staff_attribute.mail_address}, expires_delta=timedelta(hours=1))

        # 実際のアプリでは、メール送信機能を実装して、リセットリンクを送信します。
        # ここでは単にリセットトークンを返します。
        return {"message": "Password reset link sent", "reset_token": reset_token}

    def verify_password_reset(self, data: PasswordResetVerifySchema):
        # Emailでスタッフを検索
        staff = self.db.query(Staff).join(StaffAttribute).filter(StaffAttribute.mail_address == data.email).first()
        if not staff:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Staff not found",
            )

        # 新しいパスワードをハッシュ化
        hashed_password = self.get_password_hash(data.new_password)

        # パスワードを更新
        staff_attribute = self.db.query(StaffAttribute).filter(StaffAttribute.staff_id == staff.id).first()
        staff_attribute.hashed_password = hashed_password
        self.db.commit()

        return {"msg": "Password reset successful"}

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    """
    AuthServiceインスタンスを生成するファクトリ関数。
    """
    return AuthService(db)