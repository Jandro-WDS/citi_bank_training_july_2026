import bcrypt

def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def user_to_dict(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "encrypted password" : user["password"]
    }

def validate_user_payload(data, require_all=True):
    required_fields = ["name", "email", "password"]
    if require_all:
        for field in required_fields:
            if field not in data or not data[field]:
                return f"Missing required field: {field}"
    return None

