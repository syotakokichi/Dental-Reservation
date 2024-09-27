from sqlalchemy import Column, BigInteger, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Staff(Base):
    __tablename__ = 'staffs'

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    store_id = Column(BigInteger, ForeignKey('stores.id'), nullable=False)
    role_id = Column(BigInteger, ForeignKey('roles.id'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # リレーションシップを定義
    store = relationship("Store", back_populates="staffs")
    role = relationship("Role", back_populates="staffs")
    staff_attributes = relationship("StaffAttribute", back_populates="staff", cascade="all, delete-orphan")

    # Eventとのmany-to-manyリレーション
    events = relationship("Event", secondary="relations_of_event_and_staffs", back_populates="staffs")