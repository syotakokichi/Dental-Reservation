from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.database import engine, Base
from .api.v1 import customers, stores, staff, auth, bookings, role, event

app = FastAPI()

# CORSの設定を追加
origins = [
    "http://localhost:3000",  # フロントエンドのURL、必要に応じて追加
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 許可するオリジンを指定
    allow_credentials=True,
    allow_methods=["*"],  # 全てのHTTPメソッドを許可
    allow_headers=["*"],  # 全てのHTTPヘッダーを許可
)

# モデルを使ってテーブルを作成
Base.metadata.create_all(bind=engine)

# 各ルーターをFastAPIアプリケーションに登録
app.include_router(customers.router)
app.include_router(stores.router)
app.include_router(staff.router)
app.include_router(auth.router)
app.include_router(bookings.router)
app.include_router(role.router)
app.include_router(event.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}