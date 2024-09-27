# customer_service.py
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreateSchema, CustomerUpdateSchema
from fastapi import Depends, HTTPException
from app.models.customer_attribute import CustomerAttribute
from sqlalchemy.orm import joinedload
from fastapi.encoders import jsonable_encoder

class CustomerService:
    def __init__(self, db: Session):
        # データベースセッションを初期化し、インスタンス変数として保存します。
        self.db = db

    def get_customers(self, store_id: int):
        # 指定されたstore_idに関連するすべての顧客をデータベースから取得します。
        return self.db.query(Customer).options(joinedload(Customer.customer_attributes)).filter(Customer.store_id == store_id).all()


    def create_customer(self, store_id: int, data: CustomerCreateSchema):
        # Customerを作成
        new_customer = Customer(store_id=store_id)
        self.db.add(new_customer)
        self.db.flush()  # IDを取得するためにフラッシュ

        # customer_attributes を取得し、辞書であることを確認
        attribute_data = data.customer_attributes
        if isinstance(attribute_data, tuple):
            # タプルの場合は適切に変換する
            attribute_data = attribute_data[0]  # タプルの最初の要素を使用する

        # CustomerAttributeを作成
        new_attribute = CustomerAttribute(
            customer_id=new_customer.id,
            **attribute_data.dict()  # ここで辞書として処理
        )
        self.db.add(new_attribute)
        self.db.commit()
        self.db.refresh(new_customer)

        return new_customer

    def get_customer(self, store_id: int, customer_id: int):
        # 指定されたstore_idとcustomer_idに一致する単一の顧客を取得します。
        return self.db.query(Customer).filter(Customer.store_id == store_id, Customer.id == customer_id).first()

    def update_customer(self, store_id: int, customer_id: int, data: CustomerUpdateSchema):
        # 指定されたstore_idとcustomer_idに一致する顧客を取得します。
        customer = self.get_customer(store_id, customer_id)

        if customer:
            # customer_attributesを更新
            attribute_data = data.customer_attributes
            if customer.customer_attributes:
                # 既存の顧客属性がある場合、最初の属性を取得して更新
                attribute = customer.customer_attributes[0]
                for key, value in attribute_data.dict().items():
                    setattr(attribute, key, value)
            else:
                # 顧客属性がない場合、新たに作成して関連付け
                new_attribute = CustomerAttribute(
                    customer_id=customer.id,
                    **attribute_data.dict()
                )
                self.db.add(new_attribute)
            # 顧客情報全体をコミットして保存します。
            self.db.commit()
            self.db.refresh(customer)

        # 更新された顧客オブジェクトを返します。
        return customer

    def delete_customer(self, store_id: int, customer_id: int):
        # 指定されたstore_idとcustomer_idに一致する顧客を取得します。
        customer = self.get_customer(store_id, customer_id)

        if customer:
            # まず関連するcustomer_attributesを削除
            for attribute in customer.customer_attributes:
                self.db.delete(attribute)

            # その後、顧客自体を削除します
            self.db.delete(customer)

            # 変更をコミットして保存します。
            self.db.commit()

        # 削除された顧客オブジェクトを返します。
        return jsonable_encoder(customer, exclude={"customer_attributes"})

    # サービス内でCustomerとその関連するCustomerAttributesを取得するメソッド
    def get_customer_with_attributes(self, customer_id: int):
        customer = self.db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")

        # customer_attributesを取得し、正しい形式でリストに格納
        customer_attributes = [
            {
                "name": attr.name,
                "name_ruby": attr.name_ruby,
                "mail_address": attr.mail_address,
                "sex": attr.sex,
                "phone_number": attr.phone_number,
                "postal_code": attr.postal_code,
                "prefecture": attr.prefecture,
                "street": attr.street,
                "address": attr.address,
                "building": attr.building,
                "created_at": attr.created_at,
                "updated_at": attr.updated_at
            }
            for attr in customer.customer_attributes
        ]

        return customer, customer_attributes  # customer_attributesはリスト

def get_customer_service(db: Session = Depends(get_db)) -> CustomerService:
    # 依存関係としてデータベースセッションを取得し、CustomerServiceのインスタンスを返します。
    return CustomerService(db=db)