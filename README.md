# User API

Simple Flask + MongoDB Atlas API with CRUD operations for users and their accounts.

## Stack
- Python / Flask
- MongoDB Atlas (via pymongo)
- python-dotenv

## Setup

1. Clone the repo and create a virtual environment:
   ```
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the project root (see `.env.example`):
   ```
   MONGO_URI=your_mongodb_connection_string
   DB_NAME=your_database_name
   ```

4. Run the server:
   ```
   flask run
   ```

## Endpoints
 
### Users
| Method | Route           | Description                             |
|--------|-----------------|-----------------------------------------|
| POST   | /users          | Create a new user                       |
| GET    | /users          | List all users                          |
| GET    | /users/\<id>    | Get a single user                       |
| PATCH  | /users/\<id>    | Update a user                           |
| DELETE | /users/\<id>    | Delete a user and all their data        |
 
### Accounts
| Method | Route                         | Description                            |
|--------|-------------------------------|----------------------------------------|
| POST   | /api/accounts                 | Create an account for a user           |
| GET    | /api/accounts/\<id>           | Get a single account                   |
| POST   | /api/accounts/\<id>/deposit   | Deposit money into an account          |
| POST   | /api/accounts/\<id>/withdraw  | Withdraw money from an account         |
| GET    | /api/accounts/users/\<id>    | Get all accounts belonging to one user |
| DELETE | /api/accounts/\<id>           | Delete an account and its transactions |
 
### Transactions
| Method | Route                                               | Description                         |
|--------|-----------------------------------------------------|-------------------------------------|
| GET    | /api/accounts/\<id>/transactions                    | Get all transactions for an account |
 

## Example: Create user

```
POST /users
Content-Type: application/json

{
  "name": "Jay",
  "email": "jay@test.com",
  "password": "test123"
}
```
