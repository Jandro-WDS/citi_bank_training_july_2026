from db import users_collection

def insert_user(data):
    result = users_collection.insert_one(data)
    return result.inserted_id


def find_all():
    return list(users_collection.find())


def find_by_id(obj_id):
    return users_collection.find_one({"_id": obj_id})

def find_by_email(email):
    return users_collection.find_one({"email": email})


def update_by_id(obj_id, data):
    return users_collection.update_one({"_id": obj_id}, {"$set": data})


def delete_by_id(obj_id):
    return users_collection.delete_one({"_id": obj_id})