# api/v1/customers.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.customer import CustomerCreateSchema, CustomerUpdateSchema, CustomerResponseSchema
from app.services.customer_service import CustomerService

router = APIRouter()

def get_customer_service(db: Session = Depends(get_db)):
    return CustomerService(db)

@router.get("/stores/{store_id}/customers", response_model=List[CustomerResponseSchema])
def get_customers(store_id: int, service: CustomerService = Depends(get_customer_service)):
    return service.get_customers(store_id)

@router.post("/stores/{store_id}/customers")
def create_customer(store_id: int, data: CustomerCreateSchema, db: Session = Depends(get_db), service: CustomerService = Depends(get_customer_service)):
    # カスタマーとその属性を作成する
    new_customer = service.create_customer(store_id, data)

    # CustomerAttributesを取得して、それをCustomerResponseSchemaに渡す
    customer, customer_attributes = service.get_customer_with_attributes(new_customer.id)
    response = CustomerResponseSchema(
        id=customer.id,
        store_id=customer.store_id,
        customer_attributes=customer_attributes,  # 一つのCustomerに対して1つのCustomerAttributesがある前提
        created_at=customer.created_at,  # created_at を追加
        updated_at=customer.updated_at   # updated_at を追加
    )
    return response

@router.get("/stores/{store_id}/customers/{customer_id}", response_model=CustomerResponseSchema)
def get_customer(store_id: int, customer_id: int, service: CustomerService = Depends(get_customer_service)):
    return service.get_customer(store_id, customer_id)

@router.put("/stores/{store_id}/customers/{customer_id}")
def update_customer(store_id: int, customer_id: int, data: CustomerUpdateSchema, service: CustomerService = Depends(get_customer_service)):
    return service.update_customer(store_id, customer_id, data)

@router.delete("/stores/{store_id}/customers/{customer_id}")
def delete_customer(store_id: int, customer_id: int, service: CustomerService = Depends(get_customer_service)):
    return service.delete_customer(store_id, customer_id)