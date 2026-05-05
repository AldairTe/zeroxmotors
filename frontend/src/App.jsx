import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import Cotizaciones from './pages/Cotizaciones';
import Reportes from './pages/Reportes';
import Almacen from './pages/Almacen';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          } />
          <Route path="/clientes" element={
            <PrivateRoute roles={['administrador', 'vendedor']}>
              <Layout><Clientes /></Layout>
            </PrivateRoute>
          } />
          <Route path="/productos" element={
            <PrivateRoute roles={['administrador', 'almacenero']}>
              <Layout><Productos /></Layout>
            </PrivateRoute>
          } />
          <Route path="/ventas" element={
            <PrivateRoute roles={['administrador', 'vendedor']}>
              <Layout><Ventas /></Layout>
            </PrivateRoute>
          } />
          <Route path="/cotizaciones" element={
            <PrivateRoute roles={['administrador', 'vendedor']}>
              <Layout><Cotizaciones /></Layout>
            </PrivateRoute>
          } />
          <Route path="/reportes" element={
            <PrivateRoute roles={['administrador']}>
              <Layout><Reportes /></Layout>
            </PrivateRoute>
          } />
          <Route path="/almacen" element={
            <PrivateRoute roles={['administrador', 'almacenero']}>
              <Layout><Almacen /></Layout>
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}