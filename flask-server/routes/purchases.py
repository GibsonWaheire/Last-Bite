from flask import Blueprint, jsonify, request
from extensions import db
from models import Purchase, User, FoodListing
from flask_marshmallow import Marshmallow
from datetime import datetime

purchase_bp = Blueprint("purchases", __name__)
ma = Marshmallow()

# Marshmallow schema
class PurchaseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Purchase
        include_fk = True
        load_instance = True

purchase_schema = PurchaseSchema()
purchases_schema = PurchaseSchema(many=True)

# GET /api/purchases - fetch all purchases
@purchase_bp.route("/", methods=["GET"])
def get_purchases():
    purchases = Purchase.query.all()
    return jsonify({"message": "All purchases", "data": purchases_schema.dump(purchases)}), 200

# GET /api/purchases/<id> - fetch single purchase
@purchase_bp.route("/<int:purchase_id>", methods=["GET"])
def get_purchase(purchase_id):
    purchase = Purchase.query.get_or_404(purchase_id)
    return jsonify({"message": f"Purchase {purchase_id}", "data": purchase_schema.dump(purchase)}), 200

# POST /api/purchases - create new purchase
@purchase_bp.route("/", methods=["POST"])
def create_purchase():
    data = request.json
    user_id = data.get("user_id")
    food_id = data.get("food_id")
    quantity = data.get("quantity_bought", 1)

    # Validate required fields
    if not user_id or not food_id:
        return jsonify({"error": "user_id and food_id are required"}), 400

    # Check user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": f"User {user_id} does not exist"}), 404

    # Check food exists
    food = FoodListing.query.get(food_id)
    if not food:
        return jsonify({"error": f"Food item {food_id} does not exist"}), 404

    # Check stock
    if quantity > food.stock:
        return jsonify({"error": f"Not enough stock. Available: {food.stock}"}), 400

    # Reduce stock
    food.stock -= quantity

    # Create purchase
    purchase = Purchase(
        user_id=user_id,
        food_id=food_id,
        quantity_bought=quantity,
        purchase_date=datetime.utcnow()
    )

    db.session.add(purchase)
    db.session.commit()

    return jsonify({"message": "Purchase created", "data": purchase_schema.dump(purchase)}), 201

# PUT /api/purchases/<id> - update purchase (optional)
@purchase_bp.route("/<int:purchase_id>", methods=["PUT"])
def update_purchase(purchase_id):
    purchase = Purchase.query.get_or_404(purchase_id)
    data = request.json
    quantity = data.get("quantity_bought", purchase.quantity_bought)

    food = FoodListing.query.get(purchase.food_id)
    # Adjust stock if quantity changes
    stock_change = quantity - purchase.quantity_bought
    if stock_change > food.stock:
        return jsonify({"error": f"Not enough stock to update. Available: {food.stock}"}), 400

    purchase.quantity_bought = quantity
    food.stock -= stock_change

    db.session.commit()
    return jsonify({"message": f"Purchase {purchase_id} updated", "data": purchase_schema.dump(purchase)}), 200

# DELETE /api/purchases/<id> - delete purchase
@purchase_bp.route("/<int:purchase_id>", methods=["DELETE"])
def delete_purchase(purchase_id):
    purchase = Purchase.query.get_or_404(purchase_id)
    food = FoodListing.query.get(purchase.food_id)
    # Restore stock
    food.stock += purchase.quantity_bought

    db.session.delete(purchase)
    db.session.commit()
    return jsonify({"message": f"Purchase {purchase_id} deleted"}), 200
