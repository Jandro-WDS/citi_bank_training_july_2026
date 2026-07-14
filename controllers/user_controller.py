from flask import Blueprint, request, jsonify
from services import user_service

user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/users", methods=["POST"])
def create_user():
    result = user_service.create_user(request.get_json())
    return jsonify(result.get("data", {"error": result.get("error")})), result["status"]


@user_bp.route("/users", methods=["GET"])
def get_users():
    result = user_service.get_all_users()
    return jsonify(result["data"]), result["status"]


@user_bp.route("/users/<id>", methods=["GET"])
def get_user(id):
    result = user_service.get_user_by_id(id)
    return jsonify(result.get("data", {"error": result.get("error")})), result["status"]


@user_bp.route("/users/<id>", methods=["PATCH"])
def update_user(id):
    result = user_service.update_user(id, request.get_json())
    return jsonify(result.get("data", {"error": result.get("error")})), result["status"]


@user_bp.route("/users/<id>", methods=["DELETE"])
def delete_user(id):
    result = user_service.delete_user(id)
    return jsonify(result.get("data", {"error": result.get("error")})), result["status"]