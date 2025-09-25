from flask import Blueprint, jsonify, request
from models import Purchase, User, FoodListing
from extensions import db

purchase_bp = Blueprint("purchases", __name__)

# GET all purchases
@purchase_bp.route("/", methods=["GET"])
def get_purchases():
    purchases = Purchase.query.all()
    data = [{"id": p.id, "user_id": p.user_id, "food_id": p.food_id,
             "quantity_bought": getattr(p, "quantity_bought", None)} for p in purchases]
    return jsonify({"message": "All purchases", "data": data})

# GET single purchase
@purchase_bp.route("/<int:purchase_id>", methods=["GET"])
def get_purchase(purchase_id):
    p = Purchase.query.get(purchase_id)
    if not p:
        return jsonify({"message": "Purchase not found"}), 404
    data = {"id": p.id, "user_id": p.user_id, "food_id": p.food_id,
            "quantity_bought": getattr(p, "quantity_bought", None)}
    return jsonify({"message": f"Purchase {purchase_id}", "data": data})

# POST create purchase
@purchase_bp.route("/", methods=["POST"])
def create_purchase():
    data = request.json
    user = User.query.get(data.get("user_id"))
    food = FoodListing.query.get(data.get("food_id"))
    quantity = data.get("quantity_bought", 1)

    if not user or not food:
        return jsonify({"message": "User or Food not found"}), 404
    if quantity > getattr(food, "stock", 1):
        return jsonify({"message": "Not enough stock"}), 400

    # Reduce stock
    if hasattr(food, "stock"):
        food.stock -= quantity

    purchase = Purchase(user_id=user.id, food_id=food.id)
    setattr(purchase, "quantity_bought", quantity)
    db.session.add(purchase)
    db.session.commit()
    return jsonify({"message": "Purchase created", "data": {"id": purchase.id, "user_id": user.id, "food_id": food.id, "quantity_bought": quantity}}), 201

# PUT update purchase
@purchase_bp.route("/<int:purchase_id>", methods=["PUT"])
def update_purchase(purchase_id):
    purchase = Purchase.query.get(purchase_id)
    if not purchase:
        return jsonify({"message": "Purchase not found"}), 404
    data = request.json
    purchase.quantity_bought = data.get("quantity_bought", purchase.quantity_bought)
    db.session.commit()
    return jsonify({"message": f"Purchase {purchase_id} updated", "data": {"id": purchase.id, "user_id": purchase.user_id, "food_id": purchase.food_id, "quantity_bought": purchase.quantity_bought}})

# DELETE purchase
@purchase_bp.route("/<int:purchase_id>", methods=["DELETE"])
def delete_purchase(purchase_id):
    purchase = Purchase.query.get(purchase_id)
    if not purchase:
        return jsonify({"message": "Purchase not found"}), 404
    db.session.delete(purchase)
    db.session.commit()
    return jsonify({"message": f"Purchase {purchase_id} deleted"})
