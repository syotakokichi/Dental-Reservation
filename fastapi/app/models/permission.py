from sqlalchemy import Column, BigInteger, String, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Permission(Base):
    __tablename__ = 'permissions'

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    function = Column(Enum('general', 'settings', 'reports'), nullable=False)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # リレーションシップを定義
    role_permissions = relationship("RelationOfRoleAndPermission", back_populates="permission")