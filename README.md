# SwapIt: Sustainable Clothing Swap Platform

## Overview

EcoSwap is a full-stack web application designed to promote sustainable fashion by enabling users to swap pre-owned clothing items locally. Users can register, manage their wardrobe, browse nearby listings with geolocation support and send messages to arrange swaps

### Key Features
- **User   Authentication**: Secure registration, login, and logout with token-based auth.
- **Wardrobe Management**: Add, view, and manage personal clothing listings with image uploads, categories, conditions, and location tagging.
- **Browse Listings**: Discover nearby swaps using geolocation (fallback to all public listings). View item details, eco-impact, and distance.
- **Messaging System**: Send messages to listing owners directly from the browse page; view and mark messages as read in the inbox.
- **Eco-Impact Tracking**: Each listing calculates CO₂ savings based on item category and condition (e.g., reusing cotton items saves ~2-5 kg CO₂).
- **Responsive Design**: Mobile-first UI with Bootstrap for cross-device compatibility.
- **Security**: Auth tokens stored in localStorage; API requests include authorization headers.

## Tech Stack

### Backend
- **Framework**: Django 4.x with Django REST Framework (DRF) for APIs.
- **Database**: PostgreSQL with GeoDjango for location-based queries (PointField for coordinates).
- **Authentication**: DRF Token Authentication (custom token on login).
- **Other**: Pillow for image handling, Django CORS for frontend integration, Django Admin for data management.

### Frontend
- **Framework**: React 18.x with Vite for fast builds.
- **Routing**: React Router DOM.
- **UI Library**: Bootstrap 5.x with react-bootstrap for components (grid, cards, forms).
- **HTTP Client**: Axios with interceptors for auth tokens.
- **Icons**: Lucide React.
- **Notifications**: React Hot Toast for user feedback.
- **Animations**: Framer Motion for smooth transitions.
- **Other**: GeoLocation API for nearby searches; FormData for image uploads.

### Development Tools
- **Package Managers**: npm/yarn (frontend), pip (backend).
- **Environment**: Python 3.10+, Node.js 18+.
- **Testing**: Basic unit tests (expandable with Jest/Django tests).
- **Deployment**: Ready for Vercel/Netlify (frontend) and Heroku/Railway (backend).

## Prerequisites

- **Backend**:
  - Python 3.10+ and pip.
  - PostgreSQL 13+ (with PostGIS extension for GeoDjango).
  - Virtual environment (e.g., `venv` or `conda`).

- **Frontend**:
  - Node.js 18+ and npm/yarn.

- **Other**:
  - Git for version control.
  - Browser with geolocation support (e.g., Chrome, Firefox).