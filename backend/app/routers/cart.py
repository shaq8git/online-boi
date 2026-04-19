from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.schemas.cart import CartItemCreate, CartItemOut, CartItemUpdate
from app.crud import cart as crud_cart

router = APIRouter()

@router.post("/", response_model=CartItemOut)
def add_to_cart(
    item: CartItemCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return crud_cart.add_to_cart(db, current_user.id, item)

@router.get("/", response_model=list[CartItemOut])
def read_cart(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return crud_cart.get_cart_items_by_user(db, current_user.id)

@router.put("/{item_id}", response_model=CartItemOut)
def update_cart_item(

    item_id: int,
    data: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)

):
    updated_item = crud_cart.update_cart_item_quantity(
        db,
        item_id=item_id,
        user_id=current_user.id,
        quantity=data.quantity
    )

    if not updated_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    return crud_cart.get_cart_item_by_id(db, item_id, current_user.id)

@router.delete("/{item_id}")
def delete_cart_item(

    item_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    deleted = crud_cart.delete_cart_item(db, item_id, current_user.id)

    if not deleted: 
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    return {"message": "Cart item removed"}
    

