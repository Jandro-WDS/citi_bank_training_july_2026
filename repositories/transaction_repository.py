from db import transactions_collection

def insert_transaction(data):
    result = transactions_collection.insert_one(data)
    return result.inserted_id

def find_by_account_id(account_id):
    return list(transactions_collection.find({"accountId": account_id}))

# idk if i should implement a delte transaction by id
def delete_by_id(obj_id):
    return transactions_collection.delete_one({"_id": obj_id})

def delete_by_account_id(account_id):
    return transactions_collection.delete_many({"accountId": account_id})
