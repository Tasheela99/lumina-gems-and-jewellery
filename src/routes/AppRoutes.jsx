// src/routes/AppRoutes.jsx
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AboutPage from '../pages/AboutPage';
import AdminPage from '../pages/AdminPage';
import CartPage from '../pages/CartPage';
import CollectionDetailPage from '../pages/CollectionDetailPage';
import CollectionsPage from '../pages/CollectionsPage';
import ContactPage from '../pages/ContactPage';
import GemsPage from '../pages/GemsPage';
import GemstoneDetailPage from '../pages/GemstoneDetailPage';
import GemstoneGuidePage from '../pages/GemstoneGuidePage';
import HomePage from '../pages/HomePage';
import JewelryPage from '../pages/JewelryPage';
import ProductDetailPage from '../pages/ProductDetailPage';

const AppRoutes = ({ mode, onToggleColorMode }) => (
  <Routes>
    {/* Admin has its own full-page layout */}
    <Route path="/admin" element={<AdminPage mode={mode} onToggleColorMode={onToggleColorMode} />} />

    {/* All other routes use the main layout (Navbar + Footer) */}
    <Route
      path="/"
      element={
        <MainLayout mode={mode} onToggleColorMode={onToggleColorMode}>
          <HomePage />
        </MainLayout>
      }
    />
    <Route
      path="/gems"
      element={
        <MainLayout mode={mode} onToggleColorMode={onToggleColorMode}>
          <GemsPage />
        </MainLayout>
      }
    />
    <Route
      path="/jewelry"
      element={
        <MainLayout mode={mode} onToggleColorMode={onToggleColorMode}>
          <JewelryPage />
        </MainLayout>
      }
    />
    <Route
      path="/collections"
      element={
        <MainLayout mode={mode} onToggleColorMode={onToggleColorMode}>
          <CollectionsPage />
        </MainLayout>
      }
    />
    <Route
      path="/collections/:slug"
      element={
        <MainLayout mode={mode} onToggleColorMode={onToggleColorMode}>
          <CollectionDetailPage />
        </MainLayout>
      }
    />
    <Route
      path="/gemstone-guide"
      element={
        <MainLayout mode={mode} onToggleColorMode={onToggleColorMode}>
          <GemstoneGuidePage />
        </MainLayout>
      }
    />
    <Route
      path="/gemstone-guide/:id"
      element={
        <MainLayout mode={mode} onToggleColorMode={onToggleColorMode}>
          <GemstoneDetailPage />
        </MainLayout>
      }
    />
    <Route
      path="/product/:id"
      element={
        <MainLayout mode={mode} onToggleColorMode={onToggleColorMode}>
          <ProductDetailPage />
        </MainLayout>
      }
    />
    <Route
      path="/cart"
      element={
        <MainLayout mode={mode} onToggleColorMode={onToggleColorMode}>
          <CartPage />
        </MainLayout>
      }
    />
    <Route
      path="/about"
      element={
        <MainLayout mode={mode} onToggleColorMode={onToggleColorMode}>
          <AboutPage />
        </MainLayout>
      }
    />
    <Route
      path="/contact"
      element={
        <MainLayout mode={mode} onToggleColorMode={onToggleColorMode}>
          <ContactPage />
        </MainLayout>
      }
    />

    {/* 404 fallback */}
    <Route
      path="*"
      element={
        <MainLayout mode={mode} onToggleColorMode={onToggleColorMode}>
          <HomePage />
        </MainLayout>
      }
    />
  </Routes>
);

export default AppRoutes;
