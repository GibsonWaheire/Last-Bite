from flask import Blueprint, jsonify, request
from models import FoodListing, User
from extensions import db

food_bp = Blueprint("foods", __name__)

# GET all foods
@food_bp.route("/", methods=["GET"])
def get_foods():
    foods = FoodListing.query.all()
    data = [{"id": f.id, "name": f.name, "user_id": f.user_id,
             "stock": getattr(f, "stock", None),
             "price": getattr(f, "price", None),
             "expiry_date": getattr(f, "expiry_date", None)} for f in foods]
    return jsonify({"message": "All food items", "data": data})

# GET single food
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

# POST create food
@food_bp.route("/", methods=["POST"])
def create_food():
    data = request.json
    if not data.get("name") or not data.get("user_id"):
        return jsonify({"message": "Name and user_id required"}), 400
    user = User.query.get(data["user_id"])
    if not user:
        return jsonify({"message": "User not found"}), 404
    food = FoodListing(name=data["name"], user_id=data["user_id"])
    db.session.add(food)
    db.session.commit()
    return jsonify({"message": "Food created", "data": {"id": food.id, "name": food.name, "user_id": food.user_id}}), 201

# PUT update food
@food_bp.route("/<int:food_id>", methods=["PUT"])
def update_food(food_id):
    food = FoodListing.query.get(food_id)
    if not food:
        return jsonify({"message": "Food not found"}), 404
    data = request.json
    food.name = data.get("name", food.name)
    food.user_id = data.get("user_id", food.user_id)
    db.session.commit()
    return jsonify({"message": f"Food item {food_id} updated", "data": {"id": food.id, "name": food.name, "user_id": food.user_id}})

# DELETE food
@food_bp.route("/<int:food_id>", methods=["DELETE"])
def delete_food(food_id):
    food = FoodListing.query.get(food_id)
    if not food:
        return jsonify({"message": "Food not found"}), 404
    db.session.delete(food)
    db.session.commit()
    return jsonify({"message": f"Food item {food_id} deleted"})
