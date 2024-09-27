from sqlalchemy import Column, BigInteger, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class RelationOfRoleAndPermission(Base):
    __tablename__ = 'relations_of_role_and_permission'

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    role_id = Column(BigInteger, ForeignKey('roles.id'), nullable=False)
    permission_id = Column(BigInteger, ForeignKey('permissions.id'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # リレーションシップを定義
    role = relationship("Role", back_populates="role_permissions")
    permission = relationship("Permission", back_populates="role_permissions")