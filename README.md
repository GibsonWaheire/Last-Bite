# 🍎 FoodRescue - Buy Discounted Food Before It Expires

A full-stack web application that connects customers with discounted food items from stores before they expire, reducing food waste while helping people save money on groceries.

## 💡 Project Overview

**Background & Why This Matters:**
Food waste is a huge problem—stores and restaurants throw away tons of food every day just because it's close to expiry, while many people struggle with high grocery bills. FoodRescue helps connect these two sides: customers can buy perfectly good food at a discount, and stores reduce waste and recover some costs.

## 🚀 Core Features (MVP)

- **Browse Listings**: Users can see all available discounted food items
- **Create Listings**: Store owners can post food items that are close to expiry (with name, price, expiry date, and stock)
- **Purchase Food**: Customers can buy food from the listings, choosing the quantity
- **View Purchases**: Users can check their purchase history
- **Validation**: Quantity bought cannot exceed stock; expiry date must be valid, etc.

## 🏗️ Technical Architecture

### Models & Relationships

- **User** (buyers & store owners)
- **FoodListing** (posted by a store owner) - *One-to-Many relationship with User*
- **Purchase** (many-to-many between User & FoodListing, includes quantity_bought) - *Many-to-Many with extra attribute*

### Database Relationships
- User → FoodListing (One-to-Many)
- User ↔ FoodListing (Many-to-Many through Purchase)
- Purchase includes `quantity_bought` as extra attribute

## 🎯 Stretch Features

- Search & filter by category (e.g., dairy, bakery, produce)
- Countdown showing "expires in X days"
- Dashboard stats for stores (e.g., "20 items saved from waste")
- Real-time notifications for new listings
- Geolocation-based store discovery

## 🛠️ Tech Stack

### Frontend (Client)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** components for accessibility
- **React Router** for navigation
- **React Query** for state management
- **React Hook Form** with Zod validation

### Backend (Server)
- **Node.js** with Express.js
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Morgan** for request logging
- **JWT** for authentication (planned)
- **Database** (TBD - PostgreSQL/MongoDB)

## 📁 Project Structure

```
foodrescue/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── assets/        # Images and static files
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Backend Express API
│   ├── src/
│   │   ├── routes/        # API route definitions
│   │   ├── controllers/   # Route controllers
│   │   ├── models/       # Data models
│   │   ├── middleware/   # Custom middleware
│   │   └── utils/        # Utility functions
│   └── package.json       # Backend dependencies
└── package.json           # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/GibsonWaheire/Last-Bite.git
cd Last-Bite
```

2. **Install all dependencies:**
```bash
npm run install:all
```

3. **Set up environment variables:**
```bash
cd server
cp env.example .env
# Edit .env with your configuration
```

### Development

**Run both client and server:**
```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3001 (Express API)

**Run individual services:**
```bash
npm run dev:client    # Frontend only
npm run dev:server    # Backend only
```

### Production

**Build and start:**
```bash
npm run build    # Build frontend
npm start        # Start production server
```

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Food Listings
- `GET /api/foods` - Get all food listings
- `GET /api/foods/:id` - Get specific food listing
- `POST /api/foods` - Create new food listing
- `PUT /api/foods/:id` - Update food listing
- `DELETE /api/foods/:id` - Delete food listing

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/:id` - Get specific store
- `POST /api/stores` - Create new store
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store

## 👥 Team Members

This project is developed by a team of 4 developers:

1. **Gibson Waheire** - Full Stack Developer
2. **Abigail Kemuma** - Frontend Developer  
3. **Abdihakim Ali** - Backend Developer
4. **Melisa Wanjiku** - UI/UX Designer

## 🎯 Project Requirements Met

✅ **3 Models**: User, FoodListing, Purchase  
✅ **One-to-Many Relationship**: User → FoodListing  
✅ **Many-to-Many Relationship**: User ↔ FoodListing (through Purchase)  
✅ **Extra Attribute**: `quantity_bought` in Purchase model  
✅ **CRUD Operations**: Full Create, Read, Update, Delete functionality  
✅ **Validations**: Data validation on both frontend and backend  
✅ **Multiple Routes**: React Router with multiple page routes  
✅ **Full-Stack**: Complete frontend and backend implementation  

## 🌱 Impact

This project addresses real-world problems:
- **Reduces Food Waste**: Helps stores sell food before it expires
- **Saves Money**: Customers get quality food at discounted prices
- **Environmental Impact**: Reduces food waste going to landfills
- **Community Building**: Connects local stores with community members

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built with ❤️ by the FoodRescue Team**