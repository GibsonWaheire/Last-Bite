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
    
    user = User(name=validated_data["name"])
    
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
