#!/usr/bin/env python3
"""
Last Bite CLI - Command Line Interface for administrative tasks
Usage: python cli.py [command] [options]
"""

import sys
import argparse
import sqlite3
from datetime import datetime, date
from pathlib import Path

# Set up database path
DB_PATH = Path("flask-server/instance/lastbite.db")

def get_db_connection():
    """Get database connection"""
    if not DB_PATH.exists():
        print(f"❌ Database not found at {DB_PATH}")
        print("Make sure the Flask server has been run at least once to create the database.")
        sys.exit(1)
    return sqlite3.connect(DB_PATH)

def list_users():
    """List all users"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, name, email, role, firebase_uid 
        FROM user 
        ORDER BY id
    """)
    
    users = cursor.fetchall()
    conn.close()
    
    if not users:
        print("📝 No users found")
        return
    
    print("👥 Users:")
    print(f"{'ID':<4} {'Name':<20} {'Email':<30} {'Role':<12} {'Firebase UID'}")
    print("-" * 90)
    
    for user in users:
        uid_display = user[4][:20] + "..." if user[4] and len(user[4]) > 20 else user[4] or "None"
        print(f"{user[0]:<4} {user[1]:<20} {user[2]:<30} {user[3]:<12} {uid_display}")

def list_foods():
    """List all food listings"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT f.id, f.name, f.price, f.stock, f.expiry_date, u.name, u.email, f.user_id
        FROM food_listing f 
        JOIN user u ON f.user_id = u.id 
        ORDER BY f.id
    """)
    
    foods = cursor.fetchall()
    conn.close()
    
    if not foods:
        print("🍽️ No food listings found")
        return
    
    print("🍽️ Food Listings:")
    print(f"{'ID':<4} {'Name':<25} {'Price':<8} {'Stock':<>} {'Expiry':<12} {'Owner'}")
    print("-" * 80)
    
    for food in foods:
        expiry_str = food[4] if food[4] else "No expiry"
        print(f"{food[0]:<4} {food[1]:<25} Ksh{food[2]:<7} {food[3]:<6} {expiry_str:<12} {food[5]}")

def list_purchases():
    """List all purchases"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT p.id, p.quantity_bought, p.purchase_date, 
               u.name as buyer_name, u.email as buyer_email,
               f.name as food_name, f.price, ow.name as owner_name
        FROM purchase p 
        JOIN user u ON p.user_id = u.id
        JOIN food_listing f ON p.food_id = f.id
        JOIN user ow ON f.user_id = ow.id
        ORDER BY p.purchase_date DESC
    """)
    
    purchases = cursor.fetchall()
    conn.close()
    
    if not purchases:
        print("🛒 No purchases found")
        return
    
    print("🛒 Purchases:")
    print(f"{'ID':<4} {'Qty':<4} {'Amount':<8} {'Date':<20} {'Buyer':<20} {'Food Item':<25} {'Store Owner'}")
    print("-" * 120)
    
    for purchase in purchases:
        amount = purchase[6] * purchase[1]  # price * quantity
        date_str = purchase[2][:16] if purchase[2] else "Unknown"
        print(f"{purchase[0]:<4} {purchase[1]:<4} Ksh{amount:<7} {date_str:<20} {purchase[3]:<20} {purchase[5]:<25} {purchase[7]}")

def add_user():
    """Add a new user"""
    try:
        name = input("👤 Enter user name: ").strip()
        email = input("📧 Enter email: ").strip()
        
        print("🎭 Available roles: customer, store_owner, admin")
        role = input("🎭 Enter role (customer): ").strip()
        if not role:
            role = "customer"
        
        if role not in ["customer", "store_owner", "admin"]:
            print("❌ Invalid role. Must be 'customer', 'store_owner', or 'admin'")
            return
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO user (name, email, role) 
            VALUES (?, ?, ?)
        """, (name, email, role))
        
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        
        print(f"✅ User '{name}' added successfully with ID {user_id}")
        
    except sqlite3.IntegrityError:
        print("❌ Error: Email already exists")
    except Exception as e:
        print(f"❌ Error adding user: {e}")

def delete_food():
    """Delete a food listing"""
    food_id = input("🍽️ Enter food ID to delete: ").strip()
    
    try:
        food_id = int(food_id)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if food exists
        cursor.execute("SELECT id, name FROM food_listing WHERE id = ?", (food_id,))
        food = cursor.fetchone()
        
        if not food:
            print(f"❌ Food listing with ID {food_id} not found")
            conn.close()
            return
        
        # Delete the food
        cursor.execute("DELETE FROM food_listing WHERE id = ?", (food_id,))
        conn.commit()
        conn.close()
        
        print(f"✅ Food listing '{food[1]}' (ID: {food_id}) deleted successfully")
        
    except ValueError:
        print("❌ Please enter a valid numeric ID")
    except Exception as e:
        print(f"❌ Error deleting food: {e}")

def show_stats():
    """Show statistics"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get counts
    cursor.execute("SELECT COUNT(*) FROM user")
    user_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM food_listing")
    food_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM purchase")
    purchase_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM user WHERE role = 'customer'")
    customer_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM user WHERE role = 'store_owner'")
    store_owner_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM user WHERE role = 'admin'")
    admin_count = cursor.fetchone()[0]
    
    conn.close()
    
    print("📊 Last Bite Database Statistics:")
    print("-" * 40)
    print(f"👥 Total Users: {user_count}")
    print(f"   👤 Customers: {customer_count}")
    print(f"   🏪 Store Owners: {store_owner_count}")
    print(f"   👨‍💼 Admins: {admin_count}")
    print(f"🍽️ Food Listings: {food_count}")
    print(f"🛒 Total Purchases: {purchase_count}")

def main():
    """Main CLI function"""
    parser = argparse.ArgumentParser(description='Last Bite CLI - Admin interface')
    parser.add_argument('command', nargs='?', default='stats',
                       choices=['users', 'foods', 'purchases', 'add-user', 'delete-food', 'stats'],
                       help='Command to execute')
    
    args = parser.parse_args()
    
    print("🎯 Last Bite CLI - Admin Interface")
    print("=" * 50)
    
    if args.command == 'users':
        list_users()
    elif args.command == 'foods':
        list_foods()
    elif args.command == 'purchases':
        list_purchases()
    elif args.command == 'add-user':
        add_user()
    elif args.command == 'delete-food':
        delete_food()
    elif args.command == 'stats':
        show_stats()
    
    print("\n💡 Available commands:")
    print("   pyhton cli.py users         - List all users")
    print("   python cli.py foods         - List all food listings") 
    print("   python cli.py purchases     - List all purchases")
    print("   python cli.py add-user      - Add new user")
    print("   python cli.py delete-food   - Delete food listing")
    print("   python cli.py stats         - Show database statistics")

if __name__ == "__main__":
    main()
