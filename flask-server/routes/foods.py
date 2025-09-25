# routes/foods.py
from flask import Blueprint, jsonify, request

food_bp = Blueprint("foods", __name__)

# GET /api/foods - fetch all food listings
@food_bp.route("/", methods=["GET"])
def get_foods():
    return jsonify({"message": "All food items", "data": []})

# GET /api/foods/<id> - fetch single food item
@food_bp.route("/<int:food_id>", methods=["GET"])
def get_food(food_id):
    return jsonify({"message": f"Food item {food_id}", "data": None})

# POST /api/foods - create new food listing
@food_bp.route("/", methods=["POST"])
def create_food():
    data = request.json
    return jsonify({"message": "Food created", "data": data}), 201

# PUT /api/foods/<id> - update food listing
@food_bp.route("/<int:food_id>", methods=["PUT"])
def update_food(food_id):
    data = request.json
    return jsonify({"message": f"Food item {food_id} updated", "data": data})

# DELETE /api/foods/<id> - delete food listing
@food_bp.route("/<int:food_id>", methods=["DELETE"])
def delete_food(food_id):
    return jsonify({"message": f"Food item {food_id} deleted"}), 200
