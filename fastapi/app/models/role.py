from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Role(Base):
    __tablename__ = 'roles'

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    store_id = Column(BigInteger, ForeignKey('stores.id'), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # リレーションシップを定義
    staffs = relationship("Staff", back_populates="role")
    role_permissions = relationship("RelationOfRoleAndPermission", back_populates="role")
    store = relationship("Store", back_populates="roles")