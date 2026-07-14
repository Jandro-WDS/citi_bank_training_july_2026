# User API

Simple Flask + MongoDB Atlas API with CRUD operations for users.

## Stack
- Python / Flask
- MongoDB Atlas (via pymongo)
- python-dotenv

## Setup

1. Clone the repo and create a virtual environment:
   ```
   python3 -m venv venv
   source venv/bin/activate.fish
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

| Method | Route          | Description         |
|--------|----------------|----------------------|
| POST   | /users         | Create a new user    |
| GET    | /users         | List all users       |
| GET    | /users/id    | Get a single user    |
| DELETE | /users/id    | Delete a user         |

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
