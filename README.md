# 🎆 Sivakasi Sparkles — Modern Crackers E-Commerce Frontend

A modern, responsive, high-performance Crackers & Fireworks E-Commerce Web Application built using **React.js (JSX)**, **Tailwind CSS v4**, **React Router DOM**, **Axios**, and **Lucide React**. Designed to deliver an Indian Diwali crackers shopping experience direct from Sivakasi factory manufacturers.

---

## 🌟 Key Features

### 🛍️ Public User Storefront (No Login / Signup Required)
- **Guest-First Experience**: Browse all products, add items to cart, and place orders without creating an account.
- **Persistent Shopping Cart**: Maintained in `localStorage` across page reloads and browser restarts.
- **Global Debounced Search**: Fast search across 3,000+ crackers by product name, category, or product code (e.g. `SPK-101`, `ATB-501`).
- **Catalog Management (3,000+ Items)**: Server-side pagination and faceted filtering (Category, Price Range, In-Stock Only, Sorting).
- **Product Details**: Image previews, sound/sparkle ratings, burn durations, pieces per pack, and safety recommendations.
- **Festive Coupons**: Built-in support for promo codes like `DIWALI2026` (10% extra discount) and `SIVAKASI100` (flat ₹100 off).
- **Checkout & Confirmation**: Complete address input, payment method selection (UPI/QR, COD, Net Banking), and animated order confirmation with celebratory confetti.

### 🛡️ Admin Portal (Protected Route with JWT Authentication)
- **Protected Routes**: Guarded by `ProtectedRoute` and authentication state/token.
- **Dashboard**: Real-time KPI metric cards, weekly revenue & orders chart, category sales share, recent orders, and low-stock alerts.
- **Inventory Management**: Controls 3,000+ products with server-side pagination, search, category filters, Add/Edit modal, stock counters, pricing, discount calculation, and active/inactive toggles.
- **Order Fulfillment**: Track customer orders, search by Order ID or phone, inspect items and delivery address, and update status (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **Revenue Analytics**: Turnover figures, Average Order Value (AOV), monthly trend graphs, and top-selling crackers breakdown.

---

## 🏗️ Architecture & Folder Structure

```
src/
├── admin/                      # Admin pages
│   ├── AdminDashboard.jsx      # Metrics, charts, low stock alerts
│   ├── AdminInventory.jsx      # 3000+ products management & CRUD modal
│   ├── AdminLogin.jsx          # Admin JWT login form
│   ├── AdminOrders.jsx         # Orders table & inspect modal
│   └── AdminRevenue.jsx        # Revenue analytics & charts
├── components/
│   └── common/
│       ├── ConfirmationModal.jsx # Accessible destructive action modal
│       ├── FestiveBanner.jsx   # Festive countdown & promotional ribbons
│       ├── Footer.jsx          # Sivakasi address, trust badges, newsletter
│       ├── GlobalSearchModal.jsx # Debounced search modal
│       ├── Navbar.jsx          # Desktop & mobile responsive navigation
│       ├── Pagination.jsx      # Server-side pagination controls
│       ├── ProductCard.jsx     # Card with prices, badges & quick buy
│       └── SkeletonLoader.jsx  # Pulse loading placeholders
├── context/
│   ├── AuthContext.jsx         # Admin token & login state
│   ├── CartContext.jsx         # Persistent guest cart & discounts
│   └── ToastContext.jsx        # Floating notifications container
├── hooks/
│   ├── useAuth.js
│   ├── useCart.js
│   ├── useDebounce.js          # Search debounce hook
│   └── useToast.js
├── layouts/
│   ├── AdminLayout.jsx         # Admin sidebar, topbar, and drawer
│   └── MainLayout.jsx          # Storefront layout with sticky cart
├── pages/
│   ├── About.jsx               # Heritage, certifications & safety
│   ├── Cart.jsx                # Cart items, coupon, subtotal
│   ├── Checkout.jsx            # Guest delivery form & payment
│   ├── Contact.jsx             # Contact cards & map placeholder
│   ├── Home.jsx                # Hero, categories, bestsellers
│   ├── OrderSuccess.jsx        # Confirmed order & confetti blast
│   ├── ProductDetails.jsx      # Specs, safety advice & related items
│   └── Shop.jsx                # Complete 3000+ catalog with filters
├── routes/
│   ├── AppRoutes.jsx           # Main routing registry
│   └── ProtectedRoute.jsx      # Admin route guard
├── services/
│   ├── api.js                  # Centralized Axios client & fallback engine
│   ├── authService.js          # /auth/login & token verification
│   ├── categoryService.js      # /categories endpoint
│   ├── dashboardService.js     # /admin/dashboard/stats
│   ├── inventoryService.js     # /admin/inventory CRUD
│   ├── orderService.js         # /orders & /admin/orders
│   ├── productService.js       # /products catalog & search
│   └── revenueService.js       # /admin/revenue analytics
└── utils/
    ├── constants.js            # Categories, order statuses & colors
    ├── formatters.js           # Indian currency (₹) & dates
    └── mockData.js             # High-fidelity 3000+ product catalog
```

---

## ⚡ Setup & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend API URL
Create or edit `.env` in the project root:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch at `http://127.0.0.1:5173/`.

### 4. Admin Credentials
- **URL**: `http://127.0.0.1:5173/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

---

## 🔌 Python FastAPI Backend Compatibility

The Axios service layer is pre-configured to communicate with standard FastAPI REST endpoints:

| Service | Method | Endpoint | Description |
|---|---|---|---|
| Products | `GET` | `/api/products` | Paginated catalog (`page`, `limit`, `category`, `search`, `sort_by`, `price_min`, `price_max`, `in_stock`) |
| Products | `GET` | `/api/products/:id` | Single product detail |
| Categories | `GET` | `/api/categories` | Dynamic categories list |
| Orders | `POST` | `/api/orders` | Create guest order |
| Orders | `GET` | `/api/admin/orders` | Admin orders list (`search`, `status`, `page`, `limit`) |
| Orders | `PATCH` | `/api/admin/orders/:id/status` | Update order status |
| Auth | `POST` | `/api/auth/login` | Admin login returning Bearer JWT token |
| Inventory | `GET` | `/api/admin/inventory` | Paginated admin inventory controller |
| Inventory | `POST` | `/api/admin/inventory` | Create new product |
| Inventory | `PUT` | `/api/admin/inventory/:id` | Update product |
| Inventory | `DELETE` | `/api/admin/inventory/:id` | Delete product |
| Dashboard | `GET` | `/api/admin/dashboard/stats` | Summary KPI metrics & charts |
| Revenue | `GET` | `/api/admin/revenue` | Financial metrics & category shares |

*Note: In the absence of a live FastAPI server, the application automatically activates high-fidelity mock data fallbacks, ensuring all 3,000+ products, search, cart, checkout, and admin functions are fully interactive.*
