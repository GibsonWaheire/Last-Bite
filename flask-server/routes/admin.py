from flask import Blueprint, jsonify, request
from models import User, FoodListing, Purchase
from extensions import db
from schemas import UserSchema, FoodListingSchema, PurchaseSchema
from marshmallow import ValidationError
from datetime import datetime
import secrets
import hashlib

admin_bp = Blueprint("admin", __name__)
user_schema = UserSchema()
food_schema = FoodListingSchema()
purchase_schema = PurchaseSchema()

# Admin secret key (in production, this should be in env vars)
ADMIN_SECRET_KEY = "lastbite_admin_2024_secret"

@admin_bp.route("/admin/login", methods=["POST"])
def admin_login():
    """Admin login endpoint - separate from regular auth"""
    try:
        data = request.json
        secret_key = data.get("secret_key")
        email = data.get("email")
        
        if not secret_key or secret_key != ADMIN_SECRET_KEY:
            return jsonify({"message": "Invalid admin credentials"}), 401
        
        if not email:
            return jsonify({"message": "Email required"}), 400
        
        # Check if user exists
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        if user.role != 'admin':
            return jsonify({"message": "Access denied. Admin role required"}), 403
        
        # Generate admin session token
        token_data = f"{user.id}:{email}:{datetime.now().isoformat()}"
        admin_token = hashlib.sha256(f"{token_data}:{ADMIN_SECRET_KEY}".encode()).hexdigest()
        
        return jsonify({
            "message": "Admin access granted",
            "data": {
                "user": user_schema.dump(user),
                "admin_token": admin_token,
                "expires_at": datetime.now().isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({"message": "Admin login failed"}), 500

@admin_bp.route("/admin/users", methods=["GET"])
def admin_get_all_users():
    """Get all users for admin"""
    try:
        users = User.query.all()
        return jsonify({
            "message": "All users retrieved",
            "data": [user_schema.dump(user) for user in users]
        }), 200
    except Exception as e:
        return jsonify({"message": "Failed to retrieve users"}), 500

@admin_bp.route("/admin/users/<int:user_id>/toggle-status", methods=["PUT"])
def admin_toggle_user_status(user_id):
    """Enable/disable user account"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        # Toggle user role or add status field (simple implementation)
        new_role = 'admin' if user.role == 'disabled' else user.role
        user.role = new_role
        
        db.session.commit()
        
        return jsonify({
            "message": f"User status updated",
            "data": user_schema.dump(user)
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update user status"}), 500

@admin_bp.route("/admin/foods", methods=["GET"])
def admin_get_all_foods():
    """Get all food listings for admin"""
    try:
        foods = FoodListing.query.all()
        return jsonify({
            "message": "All food listings retrieved",
            "data": [food_schema.dump(food) for food in foods]
        }), 200
    except Exception as e:
        return jsonify({"message": "Failed to retrieve food listings"}), 500

@admin_bp.route("/admin/foods/<int:food_id>", methods=["DELETE"])
def admin_delete_food(food_id):
    """Admin delete food listing"""
    try:
        food = FoodListing.query.get(food_id)
        if not food:
            return jsonify({"message": "Food listing not found"}), 404
        
        db.session.delete(food)
        db.session.commit()
        
        return jsonify({"message": f"Food listing {food_id} deleted by admin"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete food listing"}), 500

@admin_bp.route("/admin/purchases", methods=["GET"])
def admin_get_all_purchases():
    """Get all purchases for admin"""
    try:
        purchases = Purchase.query.all()
        return jsonify({
            "message": "All purchases retrieved",
            "data": [purchase_schema.dump(purchase) for purchase in purchases]
        }), 200
    except Exception as e:
        return jsonify({"message": "Failed to retrieve purchases"}), 500

@admin_bp.route("/admin/stats", methods=["GET"])
def admin_get_stats():
    """Get system statistics for admin dashboard"""
    try:
        # Count users by role
        customer_count = User.query.filter_by(role='customer').count()
        store_owner_count = User.query.filter_by(role='store_owner').count()
        admin_count = User.query.filter_by(role='admin').count()
        total_users = User.query.count()
        
        # Count food listings
        total_foods = FoodListing.query.count()
        
        # Count purchases
        total_purchases = Purchase.query.count()
        
        # Recent activity (last 7 days)
        week_ago = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        recent_users = User.query.filter(User.created_at >= week_ago).count() if hasattr(User, 'created_at') else 0
        recent_foods = FoodListing.query.filter(FoodListing.created_at >= week_ago).count() if hasattr(FoodListing, 'created_at') else 0
        recent_purchases = Purchase.query.filter(Purchase.purchase_date >= week_ago).count()
        
        return jsonify({
            "message": "System statistics retrieved",
            "data": {
                "users": {
                    "total": total_users,
                    "customers": customer_count,
                    "store_owners": store_owner_count,
                    "admins": admin_count
                },
                "foods": {
                    "total": total_foods
                },
                "purchases": {
                    "total": total_purchases,
                    "recent_week": recent_purchases
                },
                "activity": {
                    "new_users_week": recent_users,
                    "new_foods_week": recent_foods,
                    "new_purchases_week": recent_purchases
                }
            }
        }), 200
    except Exception as e:
        return jsonify({"message": "Failed to retrieve statistics"}), 500
