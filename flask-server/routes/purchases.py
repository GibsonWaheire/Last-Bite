<<<<<<< HEAD
from flask import Blueprint, request, jsonify
from extensions import db
from models import Purchase, User, FoodListing
from schemas import PurchaseSchema, PurchaseCreateSchema
from marshmallow import ValidationError

purchase_bp = Blueprint('purchases', __name__, url_prefix='/api/purchases')

# Initialize schemas
=======
from flask import Blueprint, jsonify, request
from models import Purchase, User, FoodListing
from extensions import db
from schemas import PurchaseSchema, PurchaseCreateSchema
from marshmallow import ValidationError

purchase_bp = Blueprint("purchases", __name__)
>>>>>>> Gibson
purchase_schema = PurchaseSchema()
purchases_schema = PurchaseSchema(many=True)
purchase_create_schema = PurchaseCreateSchema()

@purchase_bp.route("/", methods=["GET"])
def get_purchases():
    purchases = Purchase.query.all()
    return jsonify({
        "message": "All purchases retrieved successfully",
        "data": purchases_schema.dump(purchases)
    }), 200

@purchase_bp.route("/<int:purchase_id>", methods=["GET"])
def get_purchase(purchase_id):
<<<<<<< HEAD
    purchase = Purchase.query.get_or_404(purchase_id)
    return jsonify({
        "message": "Purchase retrieved successfully",
=======
    purchase = Purchase.query.get(purchase_id)
    if not purchase:
        return jsonify({"message": "Purchase not found"}), 404
    return jsonify({
        "message": f"Purchase {purchase_id} retrieved successfully",
>>>>>>> Gibson
        "data": purchase_schema.dump(purchase)
    }), 200

@purchase_bp.route("/", methods=["POST"])
def create_purchase():
    try:
<<<<<<< HEAD
        data = purchase_create_schema.load(request.json)
        
        # Check if user and food exist
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({
                "message": "User not found",
                "errors": {"user_id": "User does not exist"}
            }), 400
        
        food = FoodListing.query.get(data['food_id'])
        if not food:
            return jsonify({
                "message": "Food item not found",
                "errors": {"food_id": "Food item does not exist"}
            }), 400
        
        # Check stock availability
        if food.stock < data['quantity_bought']:
            return jsonify({
                "message": "Insufficient stock",
                "errors": {"quantity_bought": f"Only {food.stock} items available"}
            }), 400
        
        # Update stock
        food.stock -= data['quantity_bought']
        
        purchase = Purchase(**data)
=======
        # Validate input data
        validated_data = purchase_create_schema.load(request.json)
    except ValidationError as err:
        return jsonify({"message": "Validation error", "errors": err.messages}), 400
    
    user = User.query.get(validated_data["user_id"])
    food = FoodListing.query.get(validated_data["food_id"])
    quantity = validated_data["quantity_bought"]

    if not user or not food:
        return jsonify({"message": "User or Food not found"}), 404
    
    if quantity > food.stock:
        return jsonify({"message": "Not enough stock available"}), 400

    try:
        # Update stock
        food.stock -= quantity
        
        # Create purchase
        purchase = Purchase(
            user_id=user.id, 
            food_id=food.id, 
            quantity_bought=quantity
        )
        
>>>>>>> Gibson
        db.session.add(purchase)
        db.session.commit()
        
        return jsonify({
            "message": "Purchase created successfully",
            "data": purchase_schema.dump(purchase)
        }), 201
<<<<<<< HEAD
        
    except ValidationError as e:
        return jsonify({
            "message": "Validation error",
            "errors": e.messages
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Failed to create purchase",
            "errors": str(e)
        }), 500

@purchase_bp.route("/<int:purchase_id>", methods=["PUT"])
def update_purchase(purchase_id):
    try:
        purchase = Purchase.query.get_or_404(purchase_id)
        data = purchase_create_schema.load(request.json, partial=True)
        
        # Handle stock adjustment if quantity changes
        if 'quantity_bought' in data:
            old_quantity = purchase.quantity_bought
            new_quantity = data['quantity_bought']
            difference = new_quantity - old_quantity
            
            # Check if food still exists and has enough stock
            food = FoodListing.query.get(purchase.food_id)
            if not food:
                return jsonify({
                    "message": "Food item not found",
                    "errors": {"food_id": "Food item does not exist"}
                }), 404
            
            if food.stock < difference:
                return jsonify({
                    "message": "Insufficient stock",
                    "errors": {"quantity_bought": f"Only {food.stock} additional items available"}
                }), 400
            
            # Update stock
            food.stock -= difference
        
        for key, value in data.items():
            setattr(purchase, key, value)
        
        db.session.commit()
        
        return jsonify({
            "message": "Purchase updated successfully",
            "data": purchase_schema.dump(purchase)
        }), 200
        
    except ValidationError as e:
        return jsonify({
            "message": "Validation error",
            "errors": e.messages
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Failed to update purchase",
            "errors": str(e)
        }), 500

@purchase_bp.route("/<int:purchase_id>", methods=["DELETE"])
def delete_purchase(purchase_id):
    try:
        purchase = Purchase.query.get_or_404(purchase_id)
        
        # Restore stock
        food = FoodListing.query.get(purchase.food_id)
        if food:
            food.stock += purchase.quantity_bought
        
        db.session.delete(purchase)
        db.session.commit()
        
        return jsonify({
            "message": "Purchase deleted successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Failed to delete purchase",
            "errors": str(e)
        }), 500
=======
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to create purchase"}), 500

@purchase_bp.route("/<int:purchase_id>", methods=["PUT"])
def update_purchase(purchase_id):
    purchase = Purchase.query.get(purchase_id)
    if not purchase:
        return jsonify({"message": "Purchase not found"}), 404
    
    try:
        # Validate input data
        validated_data = purchase_create_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify({"message": "Validation error", "errors": err.messages}), 400
    
    quantity = validated_data.get("quantity_bought", purchase.quantity_bought)
    food = FoodListing.query.get(purchase.food_id)
    
    # Check if new quantity is valid
    if quantity > food.stock + purchase.quantity_bought:
        return jsonify({"message": "Not enough stock available"}), 400
    
    try:
        # Adjust stock
        food.stock += purchase.quantity_bought - quantity
        purchase.quantity_bought = quantity
        
        db.session.commit()
        return jsonify({
            "message": f"Purchase {purchase_id} updated successfully",
            "data": purchase_schema.dump(purchase)
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update purchase"}), 500

@purchase_bp.route("/<int:purchase_id>", methods=["DELETE"])
def delete_purchase(purchase_id):
    purchase = Purchase.query.get(purchase_id)
    if not purchase:
        return jsonify({"message": "Purchase not found"}), 404
    
    try:
        # Restore stock
        food = FoodListing.query.get(purchase.food_id)
        food.stock += purchase.quantity_bought
        
        db.session.delete(purchase)
        db.session.commit()
        return jsonify({"message": f"Purchase {purchase_id} deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete purchase"}), 500
>>>>>>> Gibson
