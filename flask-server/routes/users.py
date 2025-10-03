from flask import Blueprint, jsonify, request
from models import User
from extensions import db
from schemas import UserSchema, UserCreateSchema
from marshmallow import ValidationError

user_bp = Blueprint("users", __name__)
user_schema = UserSchema()
users_schema = UserSchema(many=True)
user_create_schema = UserCreateSchema()

@user_bp.route("/", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify({
        "message": "All users retrieved successfully",
        "data": users_schema.dump(users)
    }), 200

@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({
        "message": f"User {user_id} retrieved successfully",
        "data": user_schema.dump(user)
    }), 200

@user_bp.route("/", methods=["POST"])
def create_user():
    try:
        # Validate input data
        validated_data = user_create_schema.load(request.json)
    except ValidationError as err:
        return jsonify({"message": "Validation error", "errors": err.messages}), 400
    
    # Check if user with email already exists
    existing_user = User.query.filter_by(email=validated_data["email"]).first()
    if existing_user:
        return jsonify({"message": "User with this email already exists"}), 400
    
    user = User(
        name=validated_data["name"],
        email=validated_data["email"],
        role=validated_data["role"],
        firebase_uid=validated_data.get("firebase_uid")
    )
    
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({
            "message": "User created successfully",
            "data": user_schema.dump(user)
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to create user"}), 500

@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    try:
        # Validate input data
        validated_data = user_create_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify({"message": "Validation error", "errors": err.messages}), 400
    
    # Update user attributes
    for key, value in validated_data.items():
        setattr(user, key, value)
    
    try:
        db.session.commit()
        return jsonify({
            "message": f"User {user_id} updated successfully",
            "data": user_schema.dump(user)
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update user"}), 500

@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": f"User {user_id} deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete user"}), 500

@user_bp.route("/by-email/<email>", methods=["GET"])
def get_user_by_email(email):
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({
        "message": f"User with email {email} retrieved successfully",
        "data": user_schema.dump(user)
    }), 200

@user_bp.route("/by-firebase-uid/<firebase_uid>", methods=["GET"])
def get_user_by_firebase_uid(firebase_uid):
    user = User.query.filter_by(firebase_uid=firebase_uid).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({
        "message": f"User with Firebase UID {firebase_uid} retrieved successfully",
        "data": user_schema.dump(user)
    }), 200

@user_bp.route("/sync-firebase", methods=["POST"])
def sync_firebase_user():
    try:
        data = request.json
        firebase_uid = data.get("firebase_uid")
        email = data.get("email")
        name = data.get("name")
        
        if not firebase_uid or not email:
            return jsonify({"message": "Firebase UID and email are required"}), 400
        
        # Check if user already exists by Firebase UID
        existing_user = User.query.filter_by(firebase_uid=firebase_uid).first()
        if existing_user:
            return jsonify({
                "message": "User already exists",
                "data": user_schema.dump(existing_user)
            }), 200
        
        # Check if user exists by email
        existing_email_user = User.query.filter_by(email=email).first()
        if existing_email_user:
            # Update existing user with Firebase UID (preserve existing role)
            existing_email_user.firebase_uid = firebase_uid
            db.session.commit()
            return jsonify({
                "message": "User updated with Firebase UID",
                "data": user_schema.dump(existing_email_user)
            }), 200
        
        # For new users, determine role based on email (legacy fallback)
        if email.endswith('@store.'):
            role = 'store_owner'
        elif email.endswith('@admin.'):
            role = 'admin'
        else:
            role = 'customer'
        
        # Create new user
        user = User(
            name=name or email.split('@')[0],
            email=email,
            role=role,
            firebase_uid=firebase_uid
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            "message": "User created and synced with Firebase",
            "data": user_schema.dump(user)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to sync user with Firebase"}), 500