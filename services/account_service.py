from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from repositories import account_repository, transaction_repository, user_repository
from models.account import (
    account_to_dict,
    transaction_to_dict,
    validate_account_payload,
    get_interest_rate
)


def create_account(data):
    error = validate_account_payload(data)
    if error:
        return {"error": error, "status": 400}

    try:
        user_obj_id = ObjectId(data["userId"])
    except InvalidId:
        return {"error": "Invalid userId", "status": 400}

    user = user_repository.find_by_id(user_obj_id)
    if not user:
        return {"error": "User not found", "status": 404}

    account_data = {
        "userId": user_obj_id,
        "accountType": data["accountType"],
        "balance": 0,
        "interestRate": get_interest_rate(data["accountType"])
    }

    new_id = account_repository.insert_account(account_data)
    new_account = account_repository.find_by_id(new_id)
    return {"data": account_to_dict(new_account), "status": 201}


def get_account(account_id):
    try:
        obj_id = ObjectId(account_id)
    except InvalidId:
        return {"error": "Invalid account id", "status": 400}

    account = account_repository.find_by_id(obj_id)
    if not account:
        return {"error": "Account not found", "status": 404}

    return {"data": account_to_dict(account), "status": 200}

def get_user_accounts(user_id):
    try:
        obj_id = ObjectId(user_id)
    except InvalidId:
        return {"error": "Invalid account id", "status": 400}
    
    accounts = account_repository.find_by_user_id(obj_id)

    if not accounts:
        return {"error": "No accounts found", "status": 404}
    
    # NOT COMPLETE
    return {"data": [ account_to_dict(a) for a in accounts], "status": 200} 


def deposit(account_id, amount):
    try:
        obj_id = ObjectId(account_id)
    except InvalidId:
        return {"error": "Invalid account id", "status": 400}

    if not isinstance(amount, (int, float)) or amount <= 0:
        return {"error": "Amount must be a positive number", "status": 400}

    account = account_repository.find_by_id(obj_id)
    if not account:
        return {"error": "Account not found", "status": 404}

    new_balance = account["balance"] + amount
    account_repository.update_balance(obj_id, new_balance)

    transaction_repository.insert_transaction({
        "accountId": obj_id,
        "type": "DEPOSIT",
        "amount": amount,
        "timestamp": datetime.now(timezone.utc)
    })

    updated_account = account_repository.find_by_id(obj_id)
    return {"data": account_to_dict(updated_account), "status": 200}


def withdraw(account_id, amount):
    try:
        obj_id = ObjectId(account_id)
    except InvalidId:
        return {"error": "Invalid account id", "status": 400}

    if not isinstance(amount, (int, float)) or amount <= 0:
        return {"error": "Amount must be a positive number", "status": 400}

    account = account_repository.find_by_id(obj_id)
    if not account:
        return {"error": "Account not found", "status": 404}

    if account["balance"] < amount:
        return {"error": "Insufficient funds", "status": 400}

    new_balance = account["balance"] - amount
    account_repository.update_balance(obj_id, new_balance)

    transaction_repository.insert_transaction({
        "accountId": obj_id,
        "type": "WITHDRAW",
        "amount": amount,
        "timestamp": datetime.now(timezone.utc)
    })

    updated_account = account_repository.find_by_id(obj_id)
    return {"data": account_to_dict(updated_account), "status": 200}


def get_transactions(account_id):
    try:
        obj_id = ObjectId(account_id)
    except InvalidId:
        return {"error": "Invalid account id", "status": 400}

    account = account_repository.find_by_id(obj_id)
    if not account:
        return {"error": "Account not found", "status": 404}

    txns = transaction_repository.find_by_account_id(obj_id)
    return {"data": [transaction_to_dict(t) for t in txns], "status": 200}