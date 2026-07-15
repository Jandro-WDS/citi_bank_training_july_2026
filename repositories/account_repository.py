from db import accounts_collection

def insert_account(data):
    result = accounts_collection.insert_one(data)
    return result.inserted_id

def find_by_id(obj_id):
    return accounts_collection.find_one({"_id": obj_id})

def find_by_user_id(obj_id):
    return accounts_collection.find({"userId": obj_id})

def update_balance(obj_id, new_balance):
    return accounts_collection.update_one(
        {"_id": obj_id}, {"$set": {"balance": new_balance}}
    )

def delete_by_id(obj_id):
    return accounts_collection.delete_one({"_id": obj_id})