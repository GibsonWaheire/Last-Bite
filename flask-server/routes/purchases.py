from flask import Blueprint, jsonify, request
from models import Purchase, User, FoodListing
from extensions import db
from schemas import PurchaseSchema, PurchaseCreateSchema
from marshmallow import ValidationError

purchase_bp = Blueprint("purchases", __name__)
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
    purchase = Purchase.query.get(purchase_id)
    if not purchase:
        return jsonify({"message": "Purchase not found"}), 404
    return jsonify({
        "message": f"Purchase {purchase_id} retrieved successfully",
        "data": purchase_schema.dump(purchase)
    }), 200

@purchase_bp.route("/", methods=["POST"])
def create_purchase():
    try:
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
        
        db.session.add(purchase)
        db.session.commit()
        
        return jsonify({
            "message": "Purchase created successfully",
            "data": purchase_schema.dump(purchase)
        }), 201
    except Exception:
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
    except Exception:
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
    except Exception:
        db.session.rollback()
        return jsonify({"message": "Failed to delete purchase"}), 500
