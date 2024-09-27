from sqlalchemy import Column, BigInteger, Integer, String, DateTime, Text, JSON, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Event(Base):
    __tablename__ = 'events'

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    store_id = Column(BigInteger, ForeignKey('stores.id'), nullable=False)
    customer_id = Column(BigInteger, ForeignKey('customers.id'), nullable=False)
    duration_by_minutes = Column(Integer)
    from_at = Column(DateTime(timezone=True), nullable=False)
    to_at = Column(DateTime(timezone=True), nullable=False)
    note = Column(Text)
    details = Column(JSON, nullable=True)
    status = Column(Enum('active', 'canceled'), default='active', nullable=False)
    title = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # リレーションシップを定義
    store = relationship("Store", back_populates="events")
    customer = relationship("Customer", back_populates="events")

    # Staffとのmany-to-manyリレーション
    staffs = relationship("Staff", secondary="relations_of_event_and_staffs", back_populates="events")