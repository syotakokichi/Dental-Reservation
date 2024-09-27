from jose import jwt, JWTError
from fastapi import HTTPException, Request, Depends
from fastapi.security import OAuth2PasswordBearer
from app.db.database import get_db
from app.services.staff_service import StaffService
from sqlalchemy.orm import Session
from app.core.config import settings
import httpx, logging
from cachetools import TTLCache

logger = logging.getLogger(__name__)

# 公開鍵をキャッシュするためのTTLCache。最大1つの公開鍵を1時間（3600秒）キャッシュします。
public_key_cache = TTLCache(maxsize=1, ttl=3600)

# OAuth2スキームを使用してトークンを取得するための設定
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Supabaseの公開鍵を取得する関数
async def get_supabase_public_key():
    # キャッシュに公開鍵があればそれを返す
    if "public_key" in public_key_cache:
        return public_key_cache["public_key"]

    # APIキーとAuthorizationヘッダーを設定
    headers = {
        "apikey": settings.SUPABASE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_KEY}"
    }

    # Supabaseから公開鍵を取得
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{settings.SUPABASE_URL}/auth/v1/jwt/keys", headers=headers)
        if response.status_code == 404:
            # 公開鍵が取得できない場合、プロジェクト設定から直接JWTシークレットを使用
            return settings.SUPABASE_JWT_SECRET
        response.raise_for_status()
        keys = response.json()
        public_key = keys[0]['publicKey']
        # 公開鍵をキャッシュに保存
        public_key_cache["public_key"] = public_key
        return public_key

# Supabaseのトークンを検証する関数
async def verify_supabase_token(token: str):
    try:
        # トークンをデコードし、ペイロードを取得
        logger.debug(f"Attempting to decode token: {token[:10]}...")
        logger.debug(f"Using JWT secret: {settings.SUPABASE_JWT_SECRET[:5]}...")
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        logger.info(f"Token successfully decoded: {payload}")
        return payload
    except JWTError as e:
        # トークンのデコードエラーをログに記録し、Noneを返す
        logger.error(f"JWT decoding error: {str(e)}")
        logger.debug(f"Full token that failed decoding: {token}")
        return None

# 現在のユーザーを取得する関数
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        # トークンを検証し、ペイロードを取得
        logger.debug(f"Verifying token: {token[:10]}...")
        payload = await verify_supabase_token(token)
        logger.debug(f"Token payload: {payload}")
        if payload is None:
            # ペイロードが無効な場合、認証エラーを返す
            logger.warning("Invalid token payload")
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")

        # スタッフサービスを使用して、Supabase IDからスタッフ情報を取得
        staff_service = StaffService()
        logger.debug(f"Getting staff by Supabase ID: {payload['sub']}")
        staff = await staff_service.get_staff_by_supabase_id(db, payload['sub'])
        if not staff:
            # スタッフが存在しない場合、新たに作成する
            logger.info(f"Staff not found. Creating new staff for Supabase ID: {payload['sub']}")
            staff = await staff_service.create_staff_from_supabase(db, payload)

        staff_dict = staff.__dict__

        logger.debug(f"Returning staff data: {staff_dict}")
        return staff_dict
    except Exception as e:
        # エラーが発生した場合、認証エラーを返す
        logger.error(f"Error in get_current_user: {str(e)}", exc_info=True)
        raise HTTPException(status_code=401, detail=str(e))