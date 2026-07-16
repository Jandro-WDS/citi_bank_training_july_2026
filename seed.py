import random
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from bson import ObjectId
from db import users_collection, accounts_collection, transactions_collection
from models.user import hash_password

load_dotenv()

ACCOUNT_TYPES = ["SAVINGS", "CHECKING"]
INTEREST_RATES = {"SAVINGS": 0.02, "CHECKING": 0.0005}

NAMES = [
    "Jay Doe", "Jane Smith", "Bob Johnson", "Alice Brown", "Carlos Rivera",
    "Emily Davis", "Marcus Lee", "Sofia Patel", "James Wilson", "Mia Thompson"
]

def clear_collections():
    users_collection.delete_many({})
    accounts_collection.delete_many({})
    transactions_collection.delete_many({})
    print("Cleared existing data.")

def seed_users():
    users = []
    for i, name in enumerate(NAMES):
        email = f"{name.split()[0].lower()}{i}@test.com"
        users.append({
            "name": name,
            "email": email,
            "password": hash_password("password123"),
            "role": "user"
        })

    result = users_collection.insert_many(users)
    print(f"Inserted {len(result.inserted_ids)} users.")
    return result.inserted_ids

def seed_accounts(user_ids):
    account_ids = []

    for user_id in user_ids:
        num_accounts = random.randint(2, 5)
        # ensure at least one of each type if num_accounts >= 2
        types = random.sample(ACCOUNT_TYPES, 2)
        if num_accounts > 2:
            types += random.choices(ACCOUNT_TYPES, k=num_accounts - 2)

        for account_type in types:
            account = {
                "userId": user_id,
                "accountType": account_type,
                "balance": round(random.uniform(100, 10000), 2),
                "interestRate": INTEREST_RATES[account_type]
            }
            result = accounts_collection.insert_one(account)
            account_ids.append(result.inserted_id)

    print(f"Inserted {len(account_ids)} accounts.")
    return account_ids

def seed_transactions(account_ids):
    txn_count = 0

    for account_id in account_ids:
        account = accounts_collection.find_one({"_id": account_id})

        if not account:
            continue
        
        balance = account["balance"]
        num_txns = random.randint(2, 10)

        for i in range(num_txns):
            txn_type = random.choice(["DEPOSIT", "WITHDRAW"])
            amount = round(random.uniform(10, 500), 2)

            # dont let balance go negative
            if txn_type == "WITHDRAW" and balance < amount:
                txn_type = "DEPOSIT"

            if txn_type == "DEPOSIT":
                balance += amount
            else:
                balance -= amount

            transactions_collection.insert_one({
                "accountId": account_id,
                "type": txn_type,
                "amount": amount,
                "timestamp": datetime.now(timezone.utc) - timedelta(days=random.randint(0, 90))
            })
            txn_count += 1

        # update final balance after all transactions
        accounts_collection.update_one(
            {"_id": account_id},
            {"$set": {"balance": round(balance, 2)}}
        )

    print(f"Inserted {txn_count} transactions.")

if __name__ == "__main__":
    clear_collections()
    user_ids = seed_users()
    account_ids = seed_accounts(user_ids)
    seed_transactions(account_ids)
    print("Seeding complete.")