from flask import Blueprint, request, jsonify
from services import account_service

account_bp = Blueprint("account_bp", __name__)

# create acount
@account_bp.route("/api/accounts", methods=["POST"])
def create_account():
    result = account_service.create_account(request.get_json())
    return jsonify(result.get("data", {"error": result.get("error")})), result["status"]

# get one account by account id
@account_bp.route("/api/accounts/<id>", methods=["GET"])
def get_account(id):
    result = account_service.get_account(id)
    return jsonify(result.get("data", {"error": result.get("error")})), result["status"]

# get accounts by user id
@account_bp.route("/api/accounts/user/<id>", methods=["GET"])
def get_accounts(id):
    result = account_service.get_user_accounts(id)
    return jsonify(result.get("data", {"error": result.get("error")})), result["status"]

#  deposit
@account_bp.route("/api/accounts/<id>/deposit", methods=["POST"])
def deposit(id):
    data = request.get_json()
    result = account_service.deposit(id, data.get("amount"))
    return jsonify(result.get("data", {"error": result.get("error")})), result["status"]

# withdraw
@account_bp.route("/api/accounts/<id>/withdraw", methods=["POST"])
def withdraw(id):
    data = request.get_json()
    result = account_service.withdraw(id, data.get("amount"))
    return jsonify(result.get("data", {"error": result.get("error")})), result["status"]

# show transaction history
@account_bp.route("/api/accounts/<id>/transactions", methods=["GET"])
def get_transactions(id):
    result = account_service.get_transactions(id)
    return jsonify(result.get("data", {"error": result.get("error")})), result["status"]