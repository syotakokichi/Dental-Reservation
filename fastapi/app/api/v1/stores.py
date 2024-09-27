from fastapi import APIRouter, Depends
from app.schemas.store import StoreCreateSchema, StoreUpdateSchema
from app.services.store_service import get_store_service, StoreService

router = APIRouter()

@router.get("/stores")
def get_stores(service: StoreService = Depends(get_store_service)):
    return service.get_stores()

@router.post("/stores")
def create_store(data: StoreCreateSchema, service: StoreService = Depends(get_store_service)):
    return service.create_store(data)

@router.get("/stores/{store_id}")
def get_store(store_id: int, service: StoreService = Depends(get_store_service)):
    return service.get_store(store_id)

@router.get("/stores/{store_id}/settings/store")
def get_store_settings(store_id: int, service: StoreService = Depends(get_store_service)):
    return service.get_store_settings(store_id)

@router.put("/stores/{store_id}/settings/store")
def update_store_settings(store_id: int, data: StoreUpdateSchema, service: StoreService = Depends(get_store_service)):
    return service.update_store_settings(store_id, data)