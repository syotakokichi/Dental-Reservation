from sqlalchemy import Column, BigInteger, String, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class AccessToken(Base):
    __tablename__ = 'access_tokens'

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    access_token = Column(String(255), nullable=False)
    staff_secrets = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expired_at = Column(DateTime(timezone=True), nullable=False)