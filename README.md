# Modern E-commerce Platform

A modern, responsive e-commerce platform built with React and Firebase, featuring a sleek UI and robust e-commerce functionality.

## Features

- Interactive Hero Section with slide animations
- Product catalog with categories
- Shopping cart functionality
- User authentication
- Contact form
- Responsive navigation
- Modern UI with Tailwind CSS
- Firebase integration for backend services

## Tech Stack

- React
- Firebase (Authentication and Database)
- Tailwind CSS
- React Router
- React Icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cherinet-woyesa/modern_ecommerce.git
cd modern_ecommerce/ecommerce-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ecommerce-frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── sections/      # Reusable page sections
│   ├── services/      # API and backend services
│   ├── utils/         # Utility functions
│   ├── App.js
│   ├── index.js
│   └── ...other config files
└── public/           # Static assets
```

## Key Components

- **HeroSection**: Interactive hero banner with slide animations
- **Navbar**: Responsive navigation bar
- **Product Sections**: Category-based product displays
- **Contact Form**: User feedback and inquiry form
- **Firebase Integration**: Authentication and database services

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to the React community
- Special thanks to Firebase for backend services
- Inspired by modern e-commerce platforms and UI/UX best practices
