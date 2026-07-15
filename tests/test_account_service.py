import pytest
from unittest.mock import patch, MagicMock
from bson import ObjectId


# mock the repository so no real DB calls are made
@patch("services.account_service.account_repository")
@patch("services.account_service.user_repository")
class TestCreateAccount:

    def test_create_account_success(self, mock_user_repo, mock_account_repo):
        fake_user_id = str(ObjectId())
        fake_account_id = ObjectId()

        mock_user_repo.find_by_id.return_value = {"_id": ObjectId(fake_user_id)}
        mock_account_repo.insert_account.return_value = fake_account_id
        mock_account_repo.find_by_id.return_value = {
            "_id": fake_account_id,
            "userId": ObjectId(fake_user_id),
            "accountType": "SAVINGS",
            "balance": 0,
            "interestRate": 0.02
        }

        from services.account_service import create_account
        result = create_account({"userId": fake_user_id, "accountType": "SAVINGS"})

        assert result["status"] == 201
        assert result["data"]["accountType"] == "SAVINGS"
        assert result["data"]["interestRate"] == 0.02
        assert result["data"]["balance"] == 0

    def test_create_account_missing_fields(self, mock_user_repo, mock_account_repo):
        from services.account_service import create_account
        result = create_account({"userId": "123"})  # missing accountType

        assert result["status"] == 400
        assert "error" in result

    def test_create_account_invalid_type(self, mock_user_repo, mock_account_repo):
        fake_user_id = str(ObjectId())
        mock_user_repo.find_by_id.return_value = {"_id": ObjectId(fake_user_id)}

        from services.account_service import create_account
        result = create_account({"userId": fake_user_id, "accountType": "CREDIT"})

        assert result["status"] == 400
        assert "Invalid accountType" in result["error"]

    def test_create_account_user_not_found(self, mock_user_repo, mock_account_repo):
        mock_user_repo.find_by_id.return_value = None

        from services.account_service import create_account
        result = create_account({"userId": str(ObjectId()), "accountType": "SAVINGS"})

        assert result["status"] == 404


@patch("services.account_service.account_repository")
@patch("services.account_service.transaction_repository")
class TestDeposit:

    def test_deposit_success(self, mock_txn_repo, mock_account_repo):
        fake_id = str(ObjectId())
        obj_id = ObjectId(fake_id)

        mock_account_repo.find_by_id.side_effect = [
            {"_id": obj_id, "userId": ObjectId(), "accountType": "SAVINGS", "balance": 100, "interestRate": 0.02},
            {"_id": obj_id, "userId": ObjectId(), "accountType": "SAVINGS", "balance": 600, "interestRate": 0.02}
        ]

        from services.account_service import deposit
        result = deposit(fake_id, 500)

        assert result["status"] == 200
        assert result["data"]["balance"] == 600
        mock_txn_repo.insert_transaction.assert_called_once()

    def test_deposit_negative_amount(self, mock_txn_repo, mock_account_repo):
        from services.account_service import deposit
        result = deposit(str(ObjectId()), -50)

        assert result["status"] == 400

    def test_deposit_invalid_id(self, mock_txn_repo, mock_account_repo):
        from services.account_service import deposit
        result = deposit("not-a-valid-id", 100)

        assert result["status"] == 400


@patch("services.account_service.account_repository")
@patch("services.account_service.transaction_repository")
class TestWithdraw:

    def test_withdraw_success(self, mock_txn_repo, mock_account_repo):
        fake_id = str(ObjectId())
        obj_id = ObjectId(fake_id)

        mock_account_repo.find_by_id.side_effect = [
            {"_id": obj_id, "userId": ObjectId(), "accountType": "CHECKING", "balance": 500, "interestRate": 0.0005},
            {"_id": obj_id, "userId": ObjectId(), "accountType": "CHECKING", "balance": 300, "interestRate": 0.0005}
        ]

        from services.account_service import withdraw
        result = withdraw(fake_id, 200)

        assert result["status"] == 200
        assert result["data"]["balance"] == 300

    def test_withdraw_insufficient_funds(self, mock_txn_repo, mock_account_repo):
        fake_id = str(ObjectId())
        obj_id = ObjectId(fake_id)

        mock_account_repo.find_by_id.return_value = {
            "_id": obj_id, "userId": ObjectId(), "accountType": "SAVINGS", "balance": 50, "interestRate": 0.02
        }

        from services.account_service import withdraw
        result = withdraw(fake_id, 200)

        assert result["status"] == 400
        assert "Insufficient funds" in result["error"]