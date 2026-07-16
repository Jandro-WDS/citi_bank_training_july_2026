from flask import Blueprint, request, jsonify
from services import auth_service
from middleware.auth_middleware import require_admin

auth_bp = Blueprint("auth_bp", __name__)


@auth_bp.route("/api/auth/signup", methods=["POST"])
def signup():
    result = auth_service.signup(request.get_json())
    return jsonify(result.get("data", {"error": result.get("error")})), result["status"]


@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    result = auth_service.login(request.get_json())
    return jsonify(result.get("data", {"error": result.get("error")})), result["status"]


@auth_bp.route("/api/admin", methods=["GET"])
@require_admin
def admin_check():
    return jsonify({"isAdmin": True}), 200