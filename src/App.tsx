import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppErrorBoundary from './components/AppErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageProvider';
import { ThemeProvider, useTheme } from './context/ThemeProvider';
import { Toaster } from 'sonner';

const Home = lazy(() => import('./pages/Home'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const Login = lazy(() => import('./pages/Login'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const InfoPage = lazy(() => import('./pages/InfoPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }), [pathname]);
  return null;
}

function RouteAwareErrorBoundary({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return <AppErrorBoundary key={location.pathname}>{children}</AppErrorBoundary>;
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen font-sans selection:bg-primary selection:text-dark">
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai" element={<ServicePage category="ai" />} />
            <Route path="/cards" element={<ServicePage category="card" />} />
            <Route path="/graphics" element={<ServicePage category="graphic" />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/track-order" element={<OrderTrackingPage />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="/terms" element={<InfoPage type="terms" />} />
            <Route path="/privacy" element={<InfoPage type="privacy" />} />
            <Route path="/about" element={<InfoPage type="about" />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  return (
    <CartProvider>
      <Toaster position="top-center" expand={false} richColors theme={theme} />
      <Router>
        <RouteAwareErrorBoundary>
          <AppRoutes />
        </RouteAwareErrorBoundary>
      </Router>
    </CartProvider>
  );
}
