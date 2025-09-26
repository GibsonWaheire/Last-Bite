from flask import Blueprint, jsonify, request
from models import FoodListing, User
from extensions import db
from datetime import datetime

food_bp = Blueprint("foods", __name__)

@food_bp.route("/", methods=["GET"])
def get_foods():
    foods = FoodListing.query.all()
    data = [{"id": f.id, "name": f.name, "user_id": f.user_id,
             "stock": getattr(f, "stock", None),
             "price": getattr(f, "price", None),
             "expiry_date": getattr(f, "expiry_date", None)} for f in foods]
    return jsonify({"message": "All food items", "data": data})

@food_bp.route("/<int:food_id>", methods=["GET"])
def get_food(food_id):
    f = FoodListing.query.get(food_id)
    if not f:
        return jsonify({"message": "Food not found"}), 404
    data = {"id": f.id, "name": f.name, "user_id": f.user_id,
            "stock": getattr(f, "stock", None),
            "price": getattr(f, "price", None),
            "expiry_date": getattr(f, "expiry_date", None)}
    return jsonify({"message": f"Food item {food_id}", "data": data})

@food_bp.route("/", methods=["POST"])
def create_food():
    data = request.json
    if not data.get("name") or not data.get("user_id"):
        return jsonify({"message": "Name and user_id required"}), 400
    if "stock" in data and data["stock"] < 0:
        return jsonify({"message": "Stock cannot be negative"}), 400
    if "price" in data and data["price"] < 0:
        return jsonify({"message": "Price cannot be negative"}), 400
    expiry_date = data.get("expiry_date")
    if expiry_date:
        try:
            datetime.strptime(expiry_date, "%Y-%m-%d")
        except ValueError:
            return jsonify({"message": "Expiry date must be YYYY-MM-DD"}), 400

    user = User.query.get(data["user_id"])
    if not user:
        return jsonify({"message": "User not found"}), 404

    food = FoodListing(
        name=data["name"],
        user_id=user.id,
        stock=data.get("stock", 1),
        price=data.get("price", 0.0),
        expiry_date=expiry_date
    )
    db.session.add(food)
    db.session.commit()
    return jsonify({"message": "Food created", "data": {"id": food.id, "name": food.name, "user_id": food.user_id}}), 201

@food_bp.route("/<int:food_id>", methods=["PUT"])
def update_food(food_id):
    food = FoodListing.query.get(food_id)
    if not food:
        return jsonify({"message": "Food not found"}), 404
    data = request.json
    name = data.get("name", food.name).strip()
    if not name:
        return jsonify({"message": "Name cannot be empty"}), 400
    stock = data.get("stock", food.stock)
    if stock < 0:
        return jsonify({"message": "Stock cannot be negative"}), 400
    price = data.get("price", food.price)
    if price < 0:
        return jsonify({"message": "Price cannot be negative"}), 400
    expiry_date = data.get("expiry_date", food.expiry_date)
    if expiry_date:
        try:
            datetime.strptime(expiry_date, "%Y-%m-%d")
        except ValueError:
            return jsonify({"message": "Expiry date must be YYYY-MM-DD"}), 400
    food.name = name
    food.stock = stock
    food.price = price
    food.expiry_date = expiry_date
    db.session.commit()
    return jsonify({"message": f"Food item {food_id} updated", "data": {"id": food.id, "name": food.name, "user_id": food.user_id}})

@food_bp.route("/<int:food_id>", methods=["DELETE"])
def delete_food(food_id):
    food = FoodListing.query.get(food_id)
    if not food:
        return jsonify({"message": "Food not found"}), 404
    db.session.delete(food)
    db.session.commit()
    return jsonify({"message": f"Food item {food_id} deleted"})
