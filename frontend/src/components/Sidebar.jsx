 
import { Link, useLocation } from 'react-router-dom';

const links = [
  { path: '/', label: 'Dashboard' },
  { path: '/clientes', label: 'Clientes' },
  { path: '/productos', label: 'Productos' },
  { path: '/ventas', label: 'Ventas' },
  { path: '/cotizaciones', label: 'Cotizaciones' },
  { path: '/reportes', label: 'Reportes' },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-yellow-400">ZeroxMotors</h1>
        <p className="text-xs text-gray-400 mt-1">Sistema de Ventas</p>
      </div>
      <nav className="flex-1 p-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-colors ${
              location.pathname === link.path
                ? 'bg-yellow-400 text-gray-900 font-semibold'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;