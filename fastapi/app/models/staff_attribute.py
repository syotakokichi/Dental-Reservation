from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class StaffAttribute(Base):
    __tablename__ = 'staff_attributes'

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    staff_id = Column(BigInteger, ForeignKey('staffs.id', ondelete='CASCADE'), nullable=False)
    name = Column(String(255), nullable=False)
    name_ruby = Column(String(255), nullable=False)
    mail_address = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # リレーションシップを定義
    staff = relationship("Staff", back_populates="staff_attributes")