from flask import Flask
from flask_cors import CORS
import os
from extensions import db, ma  # keep extensions separate

def create_app():
    app = Flask(__name__)
    
    # Database configuration - use PostgreSQL on Heroku, SQLite locally
    if 'DATABASE_URL' in os.environ:
        # Heroku PostgreSQL - normalize URL for SQLAlchemy
        database_url = os.environ['DATABASE_URL']
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    else:
        # Local SQLite
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lastbite.db'
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    CORS(app)

    # Register blueprints (import inside function to avoid circular imports)
    from routes.foods import food_bp
    from routes.users import user_bp
    from routes.purchases import purchase_bp
    from routes.admin import admin_bp

    app.register_blueprint(food_bp, url_prefix="/api/foods")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(purchase_bp, url_prefix="/api/purchases")
    app.register_blueprint(admin_bp, url_prefix="/api")

    @app.route("/")
    def home():
        return "Last Bite Rescue API is running!"

    return app


# Create the app instance
app = create_app()

# Initialize database tables
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
