from db import transactions_collection

def insert_transaction(data):
    result = transactions_collection.insert_one(data)
    return result.inserted_id

def find_by_account_id(account_id):
    return list(transactions_collection.find({"accountId": account_id}))