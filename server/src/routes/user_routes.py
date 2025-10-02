from flask import Blueprint, request, jsonify
from ..models.user import User
from ..database import db

user_bp = Blueprint("users", __name__, url_prefix="/api/users")

# --- GET all users ---
@user_bp.route("/", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "name": u.name, "email": u.email} for u in users])

# --- POST a new user ---
@user_bp.route("/", methods=["POST"])
def create_user():
    data = request.get_json()
    user = User(name=data["name"], email=data["email"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"id": user.id, "name": user.name, "email": user.email}), 201

# --- GET a single user by ID ---
@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({"id": user.id, "name": user.name, "email": user.email})

# --- PATCH (update) a user ---
@user_bp.route("/<int:user_id>", methods=["PATCH"])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if "name" in data:
        user.name = data["name"]
    if "email" in data:
        user.email = data["email"]
    
    db.session.commit()
    return jsonify({"id": user.id, "name": user.name, "email": user.email})

# --- DELETE a user ---
@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User {user_id} deleted successfully"})
