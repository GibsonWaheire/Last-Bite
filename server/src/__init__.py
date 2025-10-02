from flask import Flask
from flask_cors import CORS
from .database import db
from .routes.user_routes import user_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Database configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(user_bp)

    # Home route
    @app.route("/")
    def home():
        return {"message": "Flask is running!"}

    return app
