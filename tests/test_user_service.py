import pytest
from unittest.mock import patch, MagicMock
from bson import ObjectId


@patch("services.user_service.user_repository")
class TestCreateUser:

    def test_create_user_success(self, mock_user_repo):
        fake_id = ObjectId()
        mock_user_repo.insert_user.return_value = fake_id
        mock_user_repo.find_by_id.return_value = {
            "_id": fake_id,
            "name": "Jay",
            "email": "jay@test.com",
            "password": "hashed"
        }

        from services.user_service import create_user
        result = create_user({"name": "Jay", "email": "jay@test.com", "password": "test123"})

        assert result["status"] == 201
        assert result["data"]["name"] == "Jay"
        assert "password" not in result["data"]

    def test_create_user_missing_field(self, mock_user_repo):
        from services.user_service import create_user
        result = create_user({"name": "Jay", "email": "jay@test.com"})  # missing password

        assert result["status"] == 400