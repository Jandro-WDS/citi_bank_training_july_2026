VALID_ACCOUNT_TYPES = ["SAVINGS", "CHECKING"]

INTEREST_RATES = {
    "SAVINGS": 0.02,   # 2% APY
    "CHECKING": 0.0005  # 0.05% APY
}


def validate_account_payload(data):
    if "userId" not in data or not data["userId"]:
        return "Missing required field: userId"

    if "accountType" not in data or not data["accountType"]:
        return "Missing required field: accountType"

    if data["accountType"] not in VALID_ACCOUNT_TYPES:
        return f"Invalid accountType. Must be one of: {', '.join(VALID_ACCOUNT_TYPES)}"

    return None


def get_interest_rate(account_type):
    return INTEREST_RATES.get(account_type, 0)

def account_to_dict(account):
    return {
        "id": str(account["_id"]),
        "userId": str(account["userId"]),
        "accountType": account["accountType"],
        "balance": account["balance"],
        "interestRate": account["interestRate"]
    }

def transaction_to_dict(txn):
    return {
        "id": str(txn["_id"]),
        "accountId": str(txn["accountId"]),
        "type": txn["type"],
        "amount": txn["amount"],
        "timestamp": txn["timestamp"].isoformat()
    }