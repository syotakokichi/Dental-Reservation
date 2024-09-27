from sqlalchemy import Column, BigInteger, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Store(Base):
    __tablename__ = 'stores'

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    name_ruby = Column(String(255), nullable=False)
    postal_code = Column(String(10), nullable=False)
    prefecture = Column(String(6), nullable=False)
    street = Column(String(50), nullable=False)
    address = Column(String(50), nullable=False)
    building = Column(String(50), nullable=False)
    phone_number = Column(String(11), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # リレーションシップを定義（他のテーブルと関連付ける場合）
    staffs = relationship("Staff", back_populates="store")
    customers = relationship("Customer", back_populates="store")
    events = relationship("Event", back_populates="store")
    roles = relationship("Role", back_populates="store")