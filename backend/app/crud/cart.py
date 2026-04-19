from sqlalchemy.orm import Session, joinedload
from app.models.cart import CartItem
from app.schemas.cart import CartItemCreate

def add_to_cart(db: Session, user_id: int, item: CartItemCreate):
    existing_item = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == user_id,
            CartItem.book_id == item.book_id
        )
        .first()
    )

    if existing_item:
        existing_item.quantity += item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item

    db_item = CartItem(
        user_id=user_id,
        book_id=item.book_id,
        quantity=item.quantity
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_cart_items_by_user(db: Session, user_id: int):
    return (
        db.query(CartItem)
        .options(joinedload(CartItem.book))
        .filter(CartItem.user_id == user_id)
        .all()
    )

def get_cart_item_by_id(db: Session, item_id: int, user_id: int):
    return (

        db.query(CartItem)
        .options(joinedload(CartItem.book))
        .filter(CartItem.id == item_id, CartItem.user_id == user_id)
        .first()
    )

def update_cart_item_quantity( db: Session, item_id: int, user_id: int, quantity: int):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == user_id)
        .first()

    )
    if not item:
        return None
    
    item.quantiy = quantity
    db.commit()
    db.refresh(item)
    return item

def delete_cart_item( db: Session, item_id: int, user_id: int):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == user_id)
        .first()
    )
    if not item:
        return False
    
    db.delete(item)
    db.commit()
    return True
