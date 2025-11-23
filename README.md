# DreTAM - Corporate Travel Allowance Management

DreTAM is a modern web application for managing corporate travel claims. It features role-based access control (Admin, Manager, Employee), dark mode, and export functionality.

## Features

*   **Role-Based Access**:
    *   **Admin**: Manage users, approve/reject claims, view reports.
    *   **Manager**: View all claims, view statistics.
    *   **Employee**: Submit claims, delete pending claims, view history.
*   **Secure Authentication**: Google Sign-In via Firebase Auth.
*   **Dark Mode**: Fully supported dark theme with system preference detection.
*   **Export**: Export filtered claim reports to Excel (XLSX) and CSV.
*   **PWA**: Progressive Web App support (installable on mobile).

## Setup Instructions

### Prerequisites
*   Node.js (v18 or higher)
*   Firebase Account

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd DreTAM
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    *   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    *   Open `.env` and fill in your Firebase configuration keys.
    *   Set `VITE_ADMIN_EMAIL` to your Google email address to gain Admin access.

4.  Run the development server:
    ```bash
    npm run dev
    ```

## Firebase Setup

1.  Create a project at [console.firebase.google.com](https://console.firebase.google.com/).
2.  Enable **Authentication** (Google Provider).
3.  Enable **Firestore Database**.
4.  Copy your web app configuration keys into the `.env` file.

## Deployment

To deploy to Firebase Hosting:

```bash
npm run build
firebase deploy
```

## License

[MIT](LICENSE)
