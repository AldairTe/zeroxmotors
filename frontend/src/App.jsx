import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import Cotizaciones from './pages/Cotizaciones';
import Reportes from './pages/Reportes';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/clientes" element={
            <PrivateRoute roles={['administrador', 'vendedor']}><Clientes /></PrivateRoute>
          } />
          <Route path="/productos" element={
            <PrivateRoute roles={['administrador', 'almacenero']}><Productos /></PrivateRoute>
          } />
          <Route path="/ventas" element={
            <PrivateRoute roles={['administrador', 'vendedor']}><Ventas /></PrivateRoute>
          } />
          <Route path="/cotizaciones" element={
            <PrivateRoute roles={['administrador', 'vendedor']}><Cotizaciones /></PrivateRoute>
          } />
          <Route path="/reportes" element={
            <PrivateRoute roles={['administrador']}><Reportes /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}