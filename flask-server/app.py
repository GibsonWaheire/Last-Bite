from flask import Flask
from flask_cors import CORS
from extensions import db  # keep extensions separate

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lastbite.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    CORS(app)

    # Register blueprints (import inside function to avoid circular imports)
    from routes.foods import food_bp
    from routes.users import user_bp
    from routes.purchases import purchase_bp

    app.register_blueprint(food_bp, url_prefix="/api/foods")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(purchase_bp, url_prefix="/api/purchases")

    @app.route("/")
    def home():
        return "Last Bite Rescue API is running!"


    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()  # create tables if not exist
    app.run(debug=True)
