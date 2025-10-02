from flask import Blueprint, request, jsonify
from extensions import db
from models import FoodListing, User
from schemas import FoodListingSchema, FoodListingCreateSchema
from marshmallow import ValidationError

food_bp = Blueprint('foods', __name__, url_prefix='/api/foods')

# Initialize schemas
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
    food = FoodListing.query.get_or_404(food_id)
    return jsonify({
        "message": "Food item retrieved successfully",
        "data": food_schema.dump(food)
    }), 200

@food_bp.route("/", methods=["POST"])
def create_food():
    try:
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
