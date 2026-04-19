from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.category import CategoryCreate, CategoryOut
from app.crud import category as crud_category

router = APIRouter()

@router.post("/", response_model=CategoryOut)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return crud_category.create_category(db, category)

@router.get("/", response_model=list[CategoryOut])
def read_categories(db: Session = Depends(get_db)):
    return crud_category.get_categories(db)

