from sqlalchemy import Column, BigInteger, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Customer(Base):
    __tablename__ = 'customers'

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    store_id = Column(BigInteger, ForeignKey('stores.id'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # リレーションシップを定義
    store = relationship("Store", back_populates="customers")
    customer_attributes = relationship("CustomerAttribute", back_populates="customer")
    events = relationship("Event", back_populates="customer")