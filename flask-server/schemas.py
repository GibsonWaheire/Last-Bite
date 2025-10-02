from marshmallow import Schema, fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from models import User, FoodListing, Purchase

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True

class FoodListingSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = FoodListing
        load_instance = True
        include_fk = True

class PurchaseSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Purchase
        load_instance = True
        include_fk = True

# Validation schemas for input
class UserCreateSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Str(required=True, validate=validate.Email())
    role = fields.Str(required=True, validate=validate.OneOf(['customer', 'store_owner', 'admin']))
    firebase_uid = fields.Str(allow_none=True)

class FoodListingCreateSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    user_id = fields.Int(required=True)
    stock = fields.Int(validate=validate.Range(min=0), missing=1)
    price = fields.Float(validate=validate.Range(min=0), missing=0.0)
    expiry_date = fields.Date(allow_none=True)

class PurchaseCreateSchema(Schema):
    user_id = fields.Int(required=True)
    food_id = fields.Int(required=True)
    quantity_bought = fields.Int(required=True, validate=validate.Range(min=1))
