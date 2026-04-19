from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.book import BookCreate, BookOut
from app.crud import book as crud_book

router = APIRouter()

@router.post("/", response_model=BookOut)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    return crud_book.create_book(db, book)

@router.get("/", response_model=list[BookOut])
def read_books(db: Session = Depends(get_db)):
    return crud_book.get_books(db)

@router.get("/{book_id}", response_model=BookOut)
def read_book(book_id: int, db: Session = Depends(get_db)):
    book = crud_book.get_book(db, book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    return book