from pydantic import BaseModel

class LoginSchema(BaseModel):
    email: str
    password: str

class PasswordResetRequestSchema(BaseModel):
    email: str

class PasswordResetVerifySchema(BaseModel):
    email: str
    new_password: str

class PasswordResetSchema(BaseModel):
    email: str
    new_password: str