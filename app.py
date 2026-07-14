from flask import Flask
from controllers.user_controller import user_bp
from controllers.account_controller import account_bp

app = Flask(__name__)
app.register_blueprint(user_bp)
app.register_blueprint(account_bp)

if __name__ == "main":
    app.run()
