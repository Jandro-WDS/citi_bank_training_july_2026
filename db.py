import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()


MONGO_URI = os.environ.get("MONGO_URI")
DB_NAME = os.environ.get("DB_NAME")

assert MONGO_URI is not None
assert DB_NAME is not None

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_collection = db["users"]
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_collection = db["users"]

if __name__ == "__main__":
    try:
        client.admin.command("ping")
        print("Connected to MongoDB Atlas successfully.")
    except Exception as e:
        print("Connection failed:", e)