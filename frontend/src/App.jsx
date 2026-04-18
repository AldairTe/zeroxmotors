import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import Cotizaciones from './pages/Cotizaciones';
import Reportes from './pages/Reportes';

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="ml-64 flex-1 min-h-screen bg-gray-100 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/cotizaciones" element={<Cotizaciones />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;