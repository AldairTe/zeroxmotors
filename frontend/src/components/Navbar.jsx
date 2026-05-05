 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const rolLabel = {
    administrador: 'Administrador',
    vendedor: 'Vendedor',
    almacenero: 'Almacenero',
    repartidor: 'Repartidor'
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-64 right-0 z-10">
      <h2 className="text-gray-600 text-sm font-medium">
        Bienvenido al sistema
      </h2>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">
            {usuario?.nombre} {usuario?.apellido}
          </p>
          <p className="text-xs text-yellow-600 font-medium">
            {rolLabel[usuario?.rol]}
          </p>
        </div>
        <div className="bg-yellow-400 text-gray-900 rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm">
          {usuario?.nombre?.charAt(0)}{usuario?.apellido?.charAt(0)}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Navbar;