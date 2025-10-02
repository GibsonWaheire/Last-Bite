from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
<<<<<<< HEAD
=======
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False, default='customer')  # customer, store_owner, admin
    firebase_uid = db.Column(db.String(128), unique=True, nullable=True)  # Firebase UID for linking
>>>>>>> Gibson
    
    # One-to-many relationship: User has many FoodListings
    food_listings = db.relationship('FoodListing', backref='owner', lazy=True, cascade='all, delete-orphan')
    
    # Many-to-many relationship: User has many Purchases
    purchases = db.relationship('Purchase', backref='buyer', lazy=True, cascade='all, delete-orphan')

class FoodListing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
<<<<<<< HEAD
=======
    description = db.Column(db.String(500), nullable=True)
    category = db.Column(db.String(50), nullable=False, default='General')
>>>>>>> Gibson
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=1)
    price = db.Column(db.Float, nullable=False, default=0.0)
    expiry_date = db.Column(db.Date, nullable=True)
    
    # Many-to-many relationship: FoodListing has many Purchases
    purchases = db.relationship('Purchase', backref='food_item', lazy=True, cascade='all, delete-orphan')

class Purchase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey('food_listing.id'), nullable=False)
    quantity_bought = db.Column(db.Integer, nullable=False, default=1)
    
    # User-submittable attribute for many-to-many relationship
    purchase_date = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
