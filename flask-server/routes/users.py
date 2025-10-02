from flask import Blueprint, request, jsonify
from extensions import db
from models import User
from schemas import UserSchema, UserCreateSchema
from marshmallow import ValidationError

user_bp = Blueprint('users', __name__, url_prefix='/api/users')

# Initialize schemas
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
    user = User.query.get_or_404(user_id)
    return jsonify({
        "message": "User retrieved successfully",
        "data": user_schema.dump(user)
    }), 200

@user_bp.route("/", methods=["POST"])
def create_user():
    try:
        data = user_create_schema.load(request.json)
        
        user = User(**data)
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            "message": "User created successfully",
            "data": user_schema.dump(user)
        }), 201
        
    except ValidationError as e:
        return jsonify({
            "message": "Validation error",
            "errors": e.messages
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Failed to create user",
            "errors": str(e)
        }), 500

@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        data = user_create_schema.load(request.json, partial=True)
        
        for key, value in data.items():
            setattr(user, key, value)
        
        db.session.commit()
        
        return jsonify({
            "message": "User updated successfully",
            "data": user_schema.dump(user)
        }), 200
        
    except ValidationError as e:
        return jsonify({
            "message": "Validation error",
            "errors": e.messages
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Failed to update user",
            "errors": str(e)
        }), 500

@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            "message": "User deleted successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Failed to delete user",
            "errors": str(e)
        }), 500
