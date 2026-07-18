from flask import Flask
from controllers.user_controller import user_bp
from controllers.account_controller import account_bp
from controllers.auth_controller import auth_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
app.register_blueprint(user_bp)
app.register_blueprint(account_bp)
app.register_blueprint(auth_bp)

if __name__ == "main":
    app.run()
