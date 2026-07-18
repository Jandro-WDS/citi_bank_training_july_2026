import os
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta
from repositories import user_repository
from models.user import validate_user_payload, hash_password

def signup(data):

    error = validate_user_payload(data)
    
    if error:
        return {"error": error, "status": 400}

    existing = user_repository.find_by_email(data["email"])
    if existing:
        return {"error": "User already exists", "status": 409}

    hashed = hash_password(data["password"])

    user_repository.insert_user({
        "name": data["name"],
        "email": data["email"],
        "password": hashed,
        "role": "user"
    })

    return {"data": {"message": "User created successfully"}, "status": 201}


def login(data):
    
    if not data.get("email") or not data.get("password"):
        return {"error": "Invalid credentials", "status": 401}

    user = user_repository.find_by_email(data["email"])
    if not user:
        return {"error": "Invalid credentials1", "status": 401}

    password_valid = bcrypt.checkpw(data["password"].encode(), user["password"].encode())
    if not password_valid:
        return {"error": "Invalid credentials2", "status": 401}
    
    role = user["role"]

    token = jwt.encode(
        {
            "id": str(user["_id"]),
            "email": user["email"],
            "role": role,
            "exp": datetime.now(timezone.utc) + timedelta(hours=8)
        },
        os.environ.get("JWT_SECRET"),
        algorithm="HS256"
    )

    return {"data": {"token": token}, "status": 200}