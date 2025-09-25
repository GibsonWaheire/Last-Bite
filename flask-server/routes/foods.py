from flask import Blueprint, jsonify, request, abort
from extensions import db
from models import FoodListing, User
from datetime import datetime

food_bp = Blueprint("foods", __name__)

# Marshmallow schema
from flask_marshmallow import Marshmallow
ma = Marshmallow()

class FoodListingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = FoodListing
        include_fk = True

food_schema = FoodListingSchema()
foods_schema = FoodListingSchema(many=True)

# GET /api/foods - fetch all food listings
@food_bp.route("/", methods=["GET"])
def get_foods():
    foods = FoodListing.query.all()
    return jsonify({"message": "All food items", "data": foods_schema.dump(foods)}), 200

# GET /api/foods/<id> - fetch single food item
@food_bp.route("/<int:food_id>", methods=["GET"])
def get_food(food_id):
    food = FoodListing.query.get_or_404(food_id)
    return jsonify({"message": f"Food item {food_id}", "data": food_schema.dump(food)}), 200

# POST /api/foods - create new food listing
@food_bp.route("/", methods=["POST"])
def create_food():
    data = request.json
    # Validate required fields
    name = data.get("name")
    user_id = data.get("user_id")
    if not name or not user_id:
        return jsonify({"error": "Name and user_id are required"}), 400

    # Optional: expiry_date validation
    expiry_date_str = data.get("expiry_date")
    if expiry_date_str:
        try:
            expiry_date = datetime.strptime(expiry_date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid expiry_date format. Use YYYY-MM-DD."}), 400
    else:
        expiry_date = None

    # Check user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": f"User {user_id} does not exist"}), 404

    # Create food listing
    food = FoodListing(
        name=name,
        user_id=user_id,
        expiry_date=expiry_date,
        stock=data.get("stock", 0),
        price=data.get("price", 0)
    )
    db.session.add(food)
    db.session.commit()

    return jsonify({"message": "Food created", "data": food_schema.dump(food)}), 201

# PUT /api/foods/<id> - update food listing
@food_bp.route("/<int:food_id>", methods=["PUT"])
def update_food(food_id):
    food = FoodListing.query.get_or_404(food_id)
    data = request.json

    food.name = data.get("name", food.name)
    food.stock = data.get("stock", food.stock)
    food.price = data.get("price", food.price)

    expiry_date_str = data.get("expiry_date")
    if expiry_date_str:
        try:
            food.expiry_date = datetime.strptime(expiry_date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid expiry_date format. Use YYYY-MM-DD."}), 400

    db.session.commit()
    return jsonify({"message": f"Food item {food_id} updated", "data": food_schema.dump(food)}), 200

# DELETE /api/foods/<id> - delete food listing
@food_bp.route("/<int:food_id>", methods=["DELETE"])
def delete_food(food_id):
    food = FoodListing.query.get_or_404(food_id)
    db.session.delete(food)
    db.session.commit()
    return jsonify({"message": f"Food item {food_id} deleted"}), 200
