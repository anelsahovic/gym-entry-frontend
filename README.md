# 🏋️‍♂️ Gym Entry Frontend

![Demo App](/public/cover.png)

---

### Demo QR Code to scan

![Demo App](/public/CARD1.png)

A modern, responsive frontend application for managing gym memberships, users, and memberships. Built with **React 19**, **TypeScript**, **Vite**, and styled with **Tailwind CSS**. The app features QR code scanning for quick member lookup, robust form validation, interactive charts, and smooth user experience with animations.

🌐 **Live Demo**: [Gym Entry on Vercel](https://anelsahovic-gym-entry.vercel.app/)

🌐 **Backend API**: [Github Repo](https://github.com/anelsahovic/gym-entry-backend)

---

## Features

- **User Authentication** with username and password, including role-based access control.
- **QR Code Scanning** to quickly retrieve and display member data.
- **Membership Management** with CRUD operations, search, sorting, pagination, and validation.
- **User Management** with profile editing, role protection, and pagination.
- **Interactive Dashboard** displaying charts for insights and analytics.
- **Responsive Layout** with sidebar and topbar, optimized for desktop and mobile.
- **Form Validation** powered by `react-hook-form` and `zod`.
- **Notifications** and smooth animations with `sonner` and `framer-motion`.
- **State Management** and data fetching using `swr`.
- Integration of Radix UI components for accessible dropdowns, dialogs, tooltips, and more.
- Built with scalable and maintainable code architecture using TypeScript.

---

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS + `tailwind-merge`
- Axios for API requests
- React Hook Form + Zod for validation
- Recharts for data visualization
- Radix UI component primitives
- SWR for data fetching and caching
- HTML5 QR Code Scanner integration
- Framer Motion for animations

---

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

---

## Recent Updates

- Added interactive charts to dashboard
- Implemented QR code scanning and member lookup
- Manual membership search and extension features
- Pagination and sorting on users, members, and memberships pages
- Dialogs for editing and deleting memberships with validation
- User profile page with role-protected editing
- Login with username and improved authentication flow
- Responsive sidebar and topbar with logout functionality

---

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Configure environment variable `VITE_API_URL` to point to your backend API

---

## License

[MIT](LICENSE)

---

_This project is actively maintained and designed to provide a seamless experience for gym staff and members management._
