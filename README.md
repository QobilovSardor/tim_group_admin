# Admin Panel for Backend API

A modern, responsive React-based admin panel built with TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Features

- **Services Management**: CRUD operations for services with image uploads
- **Reviews Management**: CRUD operations for customer reviews
- **Distributors Management**: Manage distributor partners
- **Projects Management**: Manage portfolio projects
- **Dashboard**: Overview statistics and quick actions
- **Modern UI**: Clean design with light/dark mode support and responsive layout
- **Theming**: Easy-to-customize color scheme

## 🛠 Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🏃‍♂️ Running the Project

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🎨 Customizing Colors

The primary color (currently Cyan/Light Blue) can be easily changed in `src/index.css`.

Find the `:root` and `.dark` variables and update the `--primary` HSL values:

```css
:root {
  /* Cyan-500: 187 85% 43% */
  --primary: 187 85% 43%;
}

.dark {
  /* Cyan-500: 187 85% 53% */
  --primary: 187 85% 53%;
}
```

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # Sidebar, Navbar, Layout
│   ├── forms/        # Form components (ServiceForm, etc.)
│   └── common/       # Shared components (DataTable, ImageUpload, etc.)
├── pages/
│   ├── Dashboard.tsx
│   ├── services/     # Services CRUD pages
│   ├── reviews/      # Reviews CRUD pages
│   ├── distributors/ # Distributors CRUD pages
│   └── projects/     # Projects CRUD pages
├── lib/
│   ├── api.ts        # Axios setup and API calls
│   └── types.ts      # TypeScript interfaces
└── App.tsx           # Routing configuration
```

## 🔌 API Integration

The admin panel expects the following API endpoints:

- `GET /our-services`, `POST /our-services`, `PUT/DELETE /our-services/:id`
- `GET /reviews`, `POST /reviews`, `PUT/DELETE /reviews/:id`
- `GET /distributors`, `POST /distributors`, `PUT/DELETE /distributors/:id`
- `GET /our-projects`, `POST /our-projects`, `PUT/DELETE /our-projects/:id`

All Create/Update requests should be `multipart/form-data` to support image uploads.
