# app/middleware/auth.py
from fastapi import Request, HTTPException, Depends
from app.services.auth_service import AuthService
from app.db.database import SessionLocal
from app.core.security import verify_supabase_token, get_current_user
from typing import List
from functools import wraps
import logging

# ログを使用するための設定
logger = logging.getLogger(__name__)

# 認証用のミドルウェアクラス
class AuthorizationMiddleware:
    async def __call__(self, request: Request, call_next):
        try:
            # リクエストヘッダーから認証情報を取得
            auth_header = request.headers.get("Authorization")
            # Bearerトークンがある場合にトークンを分割して抽出
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
                # トークンを検証し、有効であればペイロードを取得
                payload = await verify_supabase_token(token)
                if payload:
                    # ユーザー情報をリクエストのstateに保存
                    request.state.user = payload
                    db = SessionLocal()
                    auth_service = AuthService(db)
                    # ユーザーID（トークンのsub）でデータベースからユーザーデータを取得
                    user_data = auth_service.get_user_data(payload['sub'])
                    # ユーザーの役割と権限をリクエストのstateに保存
                    request.state.user_roles = user_data.get('roles', [])
                    request.state.user_permissions = user_data.get('permissions', [])
                    db.close()  # データベースセッションをクローズ
                else:
                    # トークンが無効な場合、ユーザー情報を初期化
                    request.state.user = None
                    request.state.user_roles = []
                    request.state.user_permissions = []
            else:
                # 認証情報がない場合、ユーザー情報を初期化
                request.state.user = None
                request.state.user_roles = []
                request.state.user_permissions = []
        except Exception as e:
            # エラー発生時にログに記録し、ユーザー情報を初期化
            logger.error(f"Error in AuthorizationMiddleware: {str(e)}")
            request.state.user = None
            request.state.user_roles = []
            request.state.user_permissions = []

        # 次のミドルウェアや処理を呼び出す
        response = await call_next(request)
        return response

# 特定の権限が必要な場合に使用するデコレータ関数
def require_permissions(permissions: List[str]):
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, current_user: dict = Depends(get_current_user), *args, **kwargs):
            logger.debug(f"Current user: {current_user}")
            # ユーザーが認証されていない場合は401エラーを返す
            if not current_user:
                raise HTTPException(status_code=401, detail="Authentication required")

            # ユーザーの権限を取得し、必要な権限と比較
            user_permissions = set(current_user.get("permissions", []))
            logger.debug(f"User permissions: {user_permissions}")
            logger.debug(f"Required permissions: {permissions}")

            # ユーザーの権限が不足している場合403エラーを返す
            if not set(permissions).issubset(user_permissions):
                raise HTTPException(status_code=403, detail="Insufficient permissions")

            # 権限がある場合、元の関数を実行
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator

# 特定の役割が必要な場合に使用するデコレータ関数
def require_roles(roles: List[str]):
    def role_checker(request: Request):
        # ユーザーが認証されていない場合は401エラーを返す
        if not request.state.user:
            raise HTTPException(status_code=401, detail="Authentication required")
        # ユーザーの役割を取得し、必要な役割と比較
        user_roles = set(request.state.user_roles)
        if not set(roles).intersection(user_roles):
            # ユーザーの役割が不足している場合403エラーを返す
            raise HTTPException(status_code=403, detail="Insufficient roles")
        return True
    return Depends(role_checker)

# Supabase認証を行うミドルウェア
class SupabaseMiddleware:
    async def __call__(self, request: Request, call_next):
        # リクエストヘッダーから認証情報を取得
        auth_header = request.headers.get("Authorization")
        # Bearerトークンがある場合にトークンを分割して抽出
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            # トークンを検証し、有効であればペイロードを取得
            payload = await verify_supabase_token(token)
            if payload:
                # ユーザー情報をリクエストのstateに保存
                request.state.user = payload
            else:
                # トークンが無効な場合、ユーザー情報を初期化
                request.state.user = None
        else:
            # 認証情報がない場合、ユーザー情報を初期化
            request.state.user = None

        # 次のミドルウェアや処理を呼び出す
        response = await call_next(request)
        return response