# routes/purchases.py
from flask import Blueprint, jsonify, request

purchase_bp = Blueprint("purchases", __name__)

# GET /api/purchases - fetch all purchases
@purchase_bp.route("/", methods=["GET"])
def get_purchases():
    return jsonify({"message": "All purchases", "data": []})

# GET /api/purchases/<id> - fetch single purchase
@purchase_bp.route("/<int:purchase_id>", methods=["GET"])
def get_purchase(purchase_id):
    return jsonify({"message": f"Purchase {purchase_id}", "data": None})

# POST /api/purchases - create new purchase
@purchase_bp.route("/", methods=["POST"])
def create_purchase():
    data = request.json
    return jsonify({"message": "Purchase created", "data": data}), 201

# PUT /api/purchases/<id> - update purchase
@purchase_bp.route("/<int:purchase_id>", methods=["PUT"])
def update_purchase(purchase_id):
    data = request.json
    return jsonify({"message": f"Purchase {purchase_id} updated", "data": data})

# DELETE /api/purchases/<id> - delete purchase
@purchase_bp.route("/<int:purchase_id>", methods=["DELETE"])
def delete_purchase(purchase_id):
    return jsonify({"message": f"Purchase {purchase_id} deleted"}), 200
