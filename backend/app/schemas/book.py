from pydantic import BaseModel

class BookCreate(BaseModel):
    title: str
    author: str
    description: str | None = None
    price: float
    stock: int
    category_id: int | None = None

class BookOut(BaseModel):
    id: int
    title: str
    author: str
    description: str | None = None
    price: float
    stock: int
    category_id: int | None = None

    class Config:
        from_attributes = True