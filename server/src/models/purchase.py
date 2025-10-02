from database import db

class Purchase(db.Model):
    __tablename__ = "purchases"

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey("food_listings.id"), nullable=False)

    user = db.relationship("User", back_populates="purchases")
    food = db.relationship("FoodListing", back_populates="purchases")
