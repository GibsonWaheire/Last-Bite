from flask import Blueprint, jsonify, request
from extensions import db
from models import User
from flask_marshmallow import Marshmallow

user_bp = Blueprint("users", __name__)
ma = Marshmallow()

# Marshmallow schema
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True
        load_instance = True

user_schema = UserSchema()
users_schema = UserSchema(many=True)

# GET /api/users - fetch all users
@user_bp.route("/", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify({"message": "All users", "data": users_schema.dump(users)}), 200

# GET /api/users/<id> - fetch single user
@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({"message": f"User {user_id}", "data": user_schema.dump(user)}), 200

# POST /api/users - create new user
@user_bp.route("/", methods=["POST"])
def create_user():
    data = request.json
    name = data.get("name")

    if not name:
        return jsonify({"error": "Name is required"}), 400

    user = User(name=name)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created", "data": user_schema.dump(user)}), 201

# PUT /api/users/<id> - update user
@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json

    user.name = data.get("name", user.name)
    db.session.commit()

    return jsonify({"message": f"User {user_id} updated", "data": user_schema.dump(user)}), 200

# DELETE /api/users/<id> - delete user
@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": f"User {user_id} deleted"}), 200
