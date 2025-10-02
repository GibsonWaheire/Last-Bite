from marshmallow import Schema, fields, validate
from models import User, FoodListing, Purchase

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)

class FoodListingSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    user_id = fields.Int(required=True)
    stock = fields.Int(required=True)
    price = fields.Float(required=True)
    expiry_date = fields.Date(allow_none=True)

class PurchaseSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    food_id = fields.Int(required=True)
    quantity_bought = fields.Int(required=True)
    purchase_date = fields.DateTime(dump_only=True)

# Validation schemas for input
class UserCreateSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))

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
