from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends

from app.models.store import Store
from app.schemas.store import StoreCreateSchema, StoreUpdateSchema
from app.db.database import get_db

class StoreService:
    def __init__(self, db: Session):
        self.db = db

    def get_stores(self):
        stores = self.db.query(Store).all()
        return stores

    def create_store(self, store_data: StoreCreateSchema):
        new_store = Store(**store_data.dict())
        self.db.add(new_store)
        self.db.commit()
        self.db.refresh(new_store)
        return new_store

    def get_store(self, store_id: int):
        store = self.db.query(Store).filter(Store.id == store_id).first()
        if store is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found")
        return store

    def get_store_settings(self, store_id: int):
        store = self.get_store(store_id)
        return store  # Storeモデルの設定情報をそのまま返す

    def update_store_settings(self, store_id: int, store_data: StoreUpdateSchema):
        store = self.get_store(store_id)
        for key, value in store_data.dict(exclude_unset=True).items():
            setattr(store, key, value)
        self.db.commit()
        self.db.refresh(store)
        return store

    def delete_store(self, store_id: int):
        store = self.get_store(store_id)
        self.db.delete(store)
        self.db.commit()
        return {"detail": "Store deleted successfully"}

# FastAPI の依存関係として使用するための関数
def get_store_service(db: Session = Depends(get_db)) -> StoreService:
    return StoreService(db=db)