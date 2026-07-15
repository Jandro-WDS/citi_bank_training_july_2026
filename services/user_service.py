from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import DuplicateKeyError
from repositories import user_repository, account_repository, transaction_repository
from models.user import hash_password, user_to_dict, validate_user_payload


def create_user(data):
    error = validate_user_payload(data)
    if error:
        return {"error": error, "status": 400}

    data["password"] = hash_password(data["password"])

    try:
        new_id = user_repository.insert_user(data)
    except DuplicateKeyError:
        return {"error": "Email already exists", "status": 409}

    new_user = user_repository.find_by_id(new_id)
    return {"data": user_to_dict(new_user), "status": 201}


def get_all_users():
    users = user_repository.find_all()
    return {"data": [user_to_dict(u) for u in users], "status": 200}


def get_user_by_id(id):
    try:
        obj_id = ObjectId(id)
    except InvalidId:
        return {"error": "Invalid user id", "status": 400}

    user = user_repository.find_by_id(obj_id)
    if not user:
        return {"error": "User not found", "status": 404}

    return {"data": user_to_dict(user), "status": 200}


def update_user(id, data):
    try:
        obj_id = ObjectId(id)
    except InvalidId:
        return {"error": "Invalid user id", "status": 400}

    if "password" in data:
        data["password"] = hash_password(data["password"])

    result = user_repository.update_by_id(obj_id, data)
    if result.matched_count == 0:
        return {"error": "User not found", "status": 404}

    updated_user = user_repository.find_by_id(obj_id)
    return {"data": user_to_dict(updated_user), "status": 200}


def delete_user(id):
    try:
        obj_id = ObjectId(id)
    except InvalidId:
        return {"error": "Invalid user id", "status": 400}

    result = user_repository.delete_by_id(obj_id)
    if result.deleted_count == 0:
        return {"error": "User not found", "status": 404}
    
    accounts = account_repository.find_by_user_id(obj_id)
    for account in accounts:
        transaction_repository.delete_by_account_id(account["_id"])
        account_repository.delete_by_id(account["_id"])

    return {"data": {"message": "User deleted"}, "status": 200}