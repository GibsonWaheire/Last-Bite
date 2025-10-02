from database import db

class FoodListing(db.Model):
    __tablename__ = "food_listings"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(255))
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, default=0)

    purchases = db.relationship("Purchase", back_populates="food")
