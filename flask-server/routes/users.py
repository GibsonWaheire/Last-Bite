# routes/users.py
from flask import Blueprint, jsonify, request

user_bp = Blueprint("users", __name__)

# GET /api/users - fetch all users
@user_bp.route("/", methods=["GET"])
def get_users():
    return jsonify({"message": "All users", "data": []})

# GET /api/users/<id> - fetch single user
@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    return jsonify({"message": f"User {user_id}", "data": None})

# POST /api/users - create new user
@user_bp.route("/", methods=["POST"])
def create_user():
    data = request.json
    return jsonify({"message": "User created", "data": data}), 201

# PUT /api/users/<id> - update user
@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.json
    return jsonify({"message": f"User {user_id} updated", "data": data})

# DELETE /api/users/<id> - delete user
@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    return jsonify({"message": f"User {user_id} deleted"}), 200
