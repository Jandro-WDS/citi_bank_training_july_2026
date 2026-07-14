from flask import Blueprint, request, jsonify
from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import DuplicateKeyError
from db import users_collection
from models.user import hash_password, user_to_dict, validate_user_payload

user_bp =Blueprint("user_bp" , __name__)

# create user
@user_bp.route("/users", methods = ["POST"])
def create_user():
    data = request.get_json()
    error = validate_user_payload(data)
    if error:
        return jsonify({"error": error}), 400

    data["password"] = hash_password(data["password"])

    try:
        result = users_collection.insert_one(data)
    except DuplicateKeyError:
        return jsonify({"error": "Email already exists"}), 409

    new_user = users_collection.find_one({"_id": result.inserted_id})
    return jsonify(user_to_dict(new_user)), 201

# list users
@user_bp.route("/users", methods = ["GET"])
def get_users():
    users=users_collection.find()
    return jsonify([user_to_dict(u) for u in users])

# list one user
@user_bp.route("/users/<id>", methods=["GET"])
def get_user(id):
    try:
        obj_id = ObjectId(id)
    except InvalidId:
        return jsonify({"error": "Invalid user id"}), 400

    user = users_collection.find_one({"_id": obj_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user_to_dict(user)), 200

@user_bp.route("/users/<id>", methods=["DELETE"])
def delete_user(id):
    try:
        obj_id = ObjectId(id)
    except InvalidId:
        return jsonify({"error": "Invalid user id"}), 400

    result = users_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "User deleted"}), 200

