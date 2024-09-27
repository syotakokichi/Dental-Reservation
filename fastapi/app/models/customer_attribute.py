from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class CustomerAttribute(Base):
    __tablename__ = 'customer_attributes'

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(BigInteger, ForeignKey('customers.id'), nullable=False)
    name = Column(String(255), nullable=False)
    name_ruby = Column(String(255), nullable=False)
    mail_address = Column(String(255), nullable=False)
    sex = Column(Enum('male', 'female', 'unknown'), nullable=False)
    phone_number = Column(String(11), nullable=False)
    postal_code = Column(String(10), nullable=False)
    prefecture = Column(String(6), nullable=False)
    street = Column(String(50), nullable=False)
    address = Column(String(50), nullable=False)
    building = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # リレーションシップを定義
    customer = relationship("Customer", back_populates="customer_attributes")