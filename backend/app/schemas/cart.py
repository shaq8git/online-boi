from pydantic import BaseModel, Field

class CartBookOut(BaseModel):
    id: int
    title: str
    author: str
    price: float

    class Config:
        from_attributes = True


class CartItemCreate(BaseModel):
    book_id: int
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1)


class CartItemOut(BaseModel):
    id: int
    user_id: int
    book_id: int
    quantity: int
    book: CartBookOut

    class Config:
        from_attributes = True