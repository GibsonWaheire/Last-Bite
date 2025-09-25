from flask import Blueprint, jsonify, request
from models import User
from extensions import db

user_bp = Blueprint("users", __name__)

@user_bp.route("/", methods=["GET"])
def get_users():
    users = User.query.all()
    data = [{"id": u.id, "name": u.name} for u in users]
    return jsonify({"message": "All users", "data": data})

@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    u = User.query.get(user_id)
    if not u:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"message": f"User {user_id}", "data": {"id": u.id, "name": u.name}})

@user_bp.route("/", methods=["POST"])
def create_user():
    data = request.json
    if not data.get("name") or len(data["name"].strip()) == 0:
        return jsonify({"message": "Name is required"}), 400
    user = User(name=data["name"].strip())
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created", "data": {"id": user.id, "name": user.name}}), 201

@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    data = request.json
    name = data.get("name", "").strip()
    if not name:
        return jsonify({"message": "Name cannot be empty"}), 400
    user.name = name
    db.session.commit()
    return jsonify({"message": f"User {user_id} updated", "data": {"id": user.id, "name": user.name}})

@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User {user_id} deleted"})
