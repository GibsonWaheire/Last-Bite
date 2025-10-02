from database import db

class Store(db.Model):
    __tablename__ = "stores"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(255))
    contact = db.Column(db.String(120))

    # relationship: one store has many foods
    foods = db.relationship("FoodListing", back_populates="store")
