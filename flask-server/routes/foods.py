<<<<<<< HEAD
from flask import Blueprint, request, jsonify
from extensions import db
from models import FoodListing, User
from schemas import FoodListingSchema, FoodListingCreateSchema
from marshmallow import ValidationError

food_bp = Blueprint('foods', __name__, url_prefix='/api/foods')

# Initialize schemas
=======
from flask import Blueprint, jsonify, request
from models import FoodListing, User
from extensions import db
from schemas import FoodListingSchema, FoodListingCreateSchema
from marshmallow import ValidationError
from datetime import datetime

food_bp = Blueprint("foods", __name__)
>>>>>>> Gibson
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
<<<<<<< HEAD
    food = FoodListing.query.get_or_404(food_id)
    return jsonify({
        "message": "Food item retrieved successfully",
=======
    food = FoodListing.query.get(food_id)
    if not food:
        return jsonify({"message": "Food not found"}), 404
    return jsonify({
        "message": f"Food item {food_id} retrieved successfully",
>>>>>>> Gibson
        "data": food_schema.dump(food)
    }), 200

@food_bp.route("/", methods=["POST"])
def create_food():
    try:
<<<<<<< HEAD
        data = food_create_schema.load(request.json)
        
        # Check if user exists
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({
                "message": "User not found",
                "errors": {"user_id": "User does not exist"}
            }), 400
        
        food = FoodListing(**data)
        db.session.add(food)
        db.session.commit()
        
        return jsonify({
            "message": "Food item created successfully",
            "data": food_schema.dump(food)
        }), 201
        
    except ValidationError as e:
        return jsonify({
            "message": "Validation error",
            "errors": e.messages
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Failed to create food item",
            "errors": str(e)
        }), 500

@food_bp.route("/<int:food_id>", methods=["PUT"])
def update_food(food_id):
    try:
        food = FoodListing.query.get_or_404(food_id)
        data = food_create_schema.load(request.json, partial=True)
        
        for key, value in data.items():
            setattr(food, key, value)
        
        db.session.commit()
        
        return jsonify({
            "message": "Food item updated successfully",
            "data": food_schema.dump(food)
        }), 200
        
    except ValidationError as e:
        return jsonify({
            "message": "Validation error",
            "errors": e.messages
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Failed to update food item",
            "errors": str(e)
        }), 500

@food_bp.route("/<int:food_id>", methods=["DELETE"])
def delete_food(food_id):
    try:
        food = FoodListing.query.get_or_404(food_id)
        db.session.delete(food)
        db.session.commit()
        
        return jsonify({
            "message": "Food item deleted successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Failed to delete food item",
            "errors": str(e)
        }), 500
=======
        # Validate input data
        validated_data = food_create_schema.load(request.json)
    except ValidationError as err:
        return jsonify({"message": "Validation error", "errors": err.messages}), 400
    
    # Get user_id from request headers or body
    user_id = request.json.get("user_id")
    if not user_id:
        return jsonify({"message": "User ID is required"}), 400
    
    # Check if user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Create food listing
    food = FoodListing(
        name=validated_data["name"],
        description=validated_data.get("description"),
        category=validated_data["category"],
        user_id=user_id,
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
>>>>>>> Gibson
