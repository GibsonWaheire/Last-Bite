from flask import Blueprint, jsonify, request
from models import FoodListing, User
from extensions import db
from schemas import FoodListingSchema, FoodListingCreateSchema
from marshmallow import ValidationError
from datetime import datetime

food_bp = Blueprint("foods", __name__)
food_schema = FoodListingSchema()
foods_schema = FoodListingSchema(many=True)
food_create_schema = FoodListingCreateSchema()

@food_bp.route("/", methods=["GET"])
def get_foods():
    foods = FoodListing.query.all()
    return jsonify({
        "message": "All food items retrieved successfully",
        "data": foods_schema.dump(foods)
    }), 200

@food_bp.route("/<int:food_id>", methods=["GET"])
def get_food(food_id):
    food = FoodListing.query.get(food_id)
    if not food:
        return jsonify({"message": "Food not found"}), 404
    return jsonify({
        "message": f"Food item {food_id} retrieved successfully",
        "data": food_schema.dump(food)
    }), 200

@food_bp.route("/", methods=["POST"])
def create_food():
    try:
        # Validate input data
        validated_data = food_create_schema.load(request.json)
    except ValidationError as err:
        return jsonify({"message": "Validation error", "errors": err.messages}), 400
    
    # Check if user exists
    user = User.query.get(validated_data["user_id"])
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Create food listing
    food = FoodListing(
        name=validated_data["name"],
        user_id=validated_data["user_id"],
        stock=validated_data["stock"],
        price=validated_data["price"],
        expiry_date=validated_data.get("expiry_date")
    )
    
    try:
        db.session.add(food)
        db.session.commit()
        return jsonify({
            "message": "Food listing created successfully",
            "data": food_schema.dump(food)
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to create food listing"}), 500

@food_bp.route("/<int:food_id>", methods=["PUT"])
def update_food(food_id):
    food = FoodListing.query.get(food_id)
    if not food:
        return jsonify({"message": "Food not found"}), 404
    
    try:
        # Validate input data
        validated_data = food_create_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify({"message": "Validation error", "errors": err.messages}), 400
    
    # Update food attributes
    for key, value in validated_data.items():
        setattr(food, key, value)
    
    try:
        db.session.commit()
        return jsonify({
            "message": f"Food item {food_id} updated successfully",
            "data": food_schema.dump(food)
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update food listing"}), 500

@food_bp.route("/<int:food_id>", methods=["DELETE"])
def delete_food(food_id):
    food = FoodListing.query.get(food_id)
    if not food:
        return jsonify({"message": "Food not found"}), 404
    
    try:
        db.session.delete(food)
        db.session.commit()
        return jsonify({"message": f"Food item {food_id} deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete food listing"}), 500
