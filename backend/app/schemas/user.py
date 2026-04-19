from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_admin: bool
    is_verified: bool

    class Config:
        from_attributes = True

        