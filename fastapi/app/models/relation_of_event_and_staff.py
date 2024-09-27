from sqlalchemy import Column, BigInteger, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base

class RelationOfEventAndStaff(Base):
    __tablename__ = 'relations_of_event_and_staffs'

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    event_id = Column(BigInteger, ForeignKey('events.id'), nullable=False)
    staff_id = Column(BigInteger, ForeignKey('staffs.id'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)