import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AuthLayout from "./layouts/AuthLayout"
import PublicLayout from "./layouts/PublicLayout"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"
import VerifyEmail from "./pages/auth/VerifyEmail"
import ResetPassword from "./pages/auth/ResetPassword"
import DashboardLayout from "./layouts/DashboardLayout"
import DashboardHome from "./pages/dashboard/DashboardHome"
import UploadNote from "./pages/notes/UploadNote"
import NoteDetail from "./pages/notes/NoteDetail"
import Library from "./pages/notes/Library"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminLayout from "./layouts/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import UsersManager from "./pages/admin/UsersManager"
import NotesManager from "./pages/admin/NotesManager"
import UploadsManager from "./pages/admin/UploadsManager"
import AdminSettings from "./pages/admin/AdminSettings"
import Analytics from "./pages/admin/Analytics"
import GeneratedNotes from "./pages/dashboard/GeneratedNotes"
import Flashcards from "./pages/dashboard/Flashcards"
import UserUploads from "./pages/dashboard/UserUploads"
import Settings from "./pages/dashboard/Settings"
import { AuthProvider } from "./contexts/AuthContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import { LoadingProvider } from "./contexts/LoadingContext"
import { Toaster } from "react-hot-toast"
import AnimatedCursor from "./components/ui/AnimatedCursor"
import LoadingOverlay from "./components/ui/LoadingOverlay"
import LoadingBar from "./components/ui/LoadingBar"
import { useLoading } from "./contexts/LoadingContext"
import "./App.css"

const queryClient = new QueryClient()

function GlobalRouteListener() {
  const location = useLocation();
  const { hide } = useLoading();
  
  useEffect(() => {
    hide();
  }, [location.pathname, hide]);

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    element: <GlobalRouteListener />,
    children: [
      {
        path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "register",
        element: <Navigate to="/auth/register" replace />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      }
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      }
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: "notes/upload",
            element: <UploadNote />,
          },
          {
            path: "notes/:id",
            element: <NoteDetail />,
          },
          {
            path: "library",
            element: <Library />,
          },
          {
            path: "generated-notes",
            element: <GeneratedNotes />,
          },
          {
            path: "flashcards",
            element: <Flashcards />,
          },
          {
            path: "uploads",
            element: <UserUploads />,
          },
          {
            path: "settings",
            element: <Settings />,
          }
          // Future nested dashboard routes go here
        ],
      }
    ]
  },
  {
    path: "/admin",
    children: [
      {
        path: "login",
        element: <AdminLogin />,
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: "dashboard",
                element: <AdminDashboard />,
              },
              {
                path: "users",
                element: <UsersManager />,
              },
              {
                path: "notes",
                element: <NotesManager />,
              },
              {
                path: "uploads",
                element: <UploadsManager />,
              },
              {
                path: "settings",
                element: <AdminSettings />,
              },
              {
                path: "analytics",
                element: <Analytics />,
              }
            ],
          },
        ],
      },
    ],
  }
  ]
}
])

function AppInner() {
  const { isLoading } = useLoading();
  return (
    <>
      <AnimatedCursor />
      <LoadingBar isLoading={isLoading} />
      <LoadingOverlay />
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
            backdropFilter: 'blur(12px)',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <AuthProvider>
            <AppInner />
          </AuthProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
