import { useEffect, useState } from 'react';
import loteService from '../services/loteService';
import productoService from '../services/productoService';
import { useAuth } from '../context/AuthContext';

function Almacen() {
  const { usuario } = useAuth();
  const [lotes, setLotes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetalle, setShowDetalle] = useState(false);
  const [loteDetalle, setLoteDetalle] = useState(null);
  const [tipoModal, setTipoModal] = useState('entrada');
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [form, setForm] = useState({
    proveedor: '',
    motivo: '',
    fecha: new Date().toISOString().split('T')[0],
    productos: []
  });

  const cargarDatos = () => {
    loteService.getAll().then(res => setLotes(res.data));
    productoService.getAll().then(res => setProductos(res.data));
  };

  useEffect(() => { cargarDatos(); }, []);

  // ── Modal ─────────────────────────────────────────────────
  const abrirModal = (tipo) => {
    setTipoModal(tipo);
    setError('');
    setForm({
      proveedor: '',
      motivo: '',
      fecha: new Date().toISOString().split('T')[0],
      productos: [{ producto_id: '', cantidad: 1 }]
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setError('');
  };

  const agregarProducto = () => {
    setForm({ ...form, productos: [...form.productos, { producto_id: '', cantidad: 1 }] });
  };

  const eliminarProducto = (index) => {
    if (form.productos.length === 1) return;
    setForm({ ...form, productos: form.productos.filter((_, i) => i !== index) });
  };

  const handleProductoChange = (index, field, value) => {
    const nuevos = [...form.productos];
    nuevos[index][field] = value;
    setForm({ ...form, productos: nuevos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar que no haya productos duplicados
    const ids = form.productos.map(p => p.producto_id);
    if (new Set(ids).size !== ids.length) {
      setError('Hay productos duplicados en la lista');
      return;
    }

    try {
      await loteService.registrar({ ...form, tipo: tipoModal });
      cerrarModal();
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar');
    }
  };

  // ── Detalle lote ──────────────────────────────────────────
  const verDetalle = async (lote) => {
    const res = await loteService.getById(lote.id);
    setLoteDetalle(res.data);
    setShowDetalle(true);
  };

  // ── Filtro ────────────────────────────────────────────────
  const lotesFiltrados = lotes.filter(l => {
    if (filtro === 'todos') return true;
    return l.tipo === filtro;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Almacén</h2>
        <div className="flex gap-3">
          <button
            onClick={() => abrirModal('entrada')}
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 text-sm"
          >
            ↑ Registrar Entrada
          </button>
          <button
            onClick={() => abrirModal('salida')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 text-sm"
          >
            ↓ Registrar Salida
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        {['todos', 'entrada', 'salida'].map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filtro === f
                ? f === 'entrada' ? 'bg-green-500 text-white'
                : f === 'salida' ? 'bg-red-500 text-white'
                : 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'todos' ? 'Todos' : f === 'entrada' ? '↑ Entradas' : '↓ Salidas'}
          </button>
        ))}
      </div>

      {/* Tabla de lotes */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Proveedor / Motivo</th>
              <th className="px-4 py-3 text-left">Productos</th>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lotesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-400">
                  No hay registros
                </td>
              </tr>
            ) : lotesFiltrados.map(l => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{l.id}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    l.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {l.tipo === 'entrada' ? '↑ Entrada' : '↓ Salida'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {l.proveedor || l.motivo || '—'}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                    {l.total_productos} productos
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{l.usuario || '—'}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(l.fecha).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => verDetalle(l)}
                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Registrar Entrada/Salida */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className={`flex justify-between items-center p-6 border-b`}>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {tipoModal === 'entrada' ? '↑ Registrar Entrada' : '↓ Registrar Salida'}
                </h3>
                <p className="text-sm text-gray-500">
                  {tipoModal === 'entrada' ? 'Ingreso de productos al almacén' : 'Salida de productos del almacén'}
                </p>
              </div>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {tipoModal === 'entrada' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                    <input
                      className="w-full border rounded-lg p-2 text-sm"
                      placeholder="Nombre del proveedor"
                      value={form.proveedor}
                      onChange={e => setForm({ ...form, proveedor: e.target.value })}
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                    <input
                      className="w-full border rounded-lg p-2 text-sm"
                      placeholder="Ej: Despacho de pedido, Ajuste..."
                      value={form.motivo}
                      onChange={e => setForm({ ...form, motivo: e.target.value })}
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    className="w-full border rounded-lg p-2 text-sm"
                    type="date"
                    value={form.fecha}
                    onChange={e => setForm({ ...form, fecha: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Usuario logueado */}
              <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">Responsable</span>
                <span className="text-sm font-semibold text-gray-800">
                  {usuario?.nombre} {usuario?.apellido} — <span className="text-yellow-600 capitalize">{usuario?.rol}</span>
                </span>
              </div>

              {/* Productos */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Productos</label>
                  <button
                    type="button"
                    onClick={agregarProducto}
                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200"
                  >
                    + Agregar producto
                  </button>
                </div>

                {form.productos.map((item, index) => {
                  const prod = productos.find(p => p.id === parseInt(item.producto_id));
                  return (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                      <select
                        className="border rounded-lg p-2 text-sm col-span-7"
                        value={item.producto_id}
                        onChange={e => handleProductoChange(index, 'producto_id', e.target.value)}
                        required
                      >
                        <option value="">Seleccionar producto</option>
                        {productos.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.nombre} (Stock: {p.stock})
                          </option>
                        ))}
                      </select>
                      <input
                        className="border rounded-lg p-2 text-sm col-span-3"
                        type="number"
                        min="1"
                        max={tipoModal === 'salida' ? prod?.stock || 1 : undefined}
                        placeholder="Cant."
                        value={item.cantidad}
                        onChange={e => handleProductoChange(index, 'cantidad', parseInt(e.target.value))}
                        required
                      />
                      {prod && tipoModal === 'salida' && (
                        <span className={`text-xs col-span-1 text-center font-semibold ${prod.stock < item.cantidad ? 'text-red-500' : 'text-green-600'}`}>
                          {prod.stock}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => eliminarProducto(index)}
                        className="col-span-1 text-red-400 hover:text-red-600 text-xl font-bold text-center"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={cerrarModal} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg font-semibold text-sm text-white ${tipoModal === 'entrada' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  {tipoModal === 'entrada' ? '↑ Registrar Entrada' : '↓ Registrar Salida'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalle Lote */}
      {showDetalle && loteDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Detalle — Lote #{loteDetalle.id}
                </h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${loteDetalle.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {loteDetalle.tipo === 'entrada' ? '↑ Entrada' : '↓ Salida'}
                </span>
              </div>
              <button onClick={() => setShowDetalle(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-1 text-sm">
                {loteDetalle.proveedor && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Proveedor</span>
                    <span className="font-medium">{loteDetalle.proveedor}</span>
                  </div>
                )}
                {loteDetalle.motivo && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Motivo</span>
                    <span className="font-medium">{loteDetalle.motivo}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Responsable</span>
                  <span className="font-medium">{loteDetalle.usuario || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha</span>
                  <span className="font-medium">{new Date(loteDetalle.fecha).toLocaleDateString()}</span>
                </div>
              </div>

              <h4 className="font-semibold text-gray-700 text-sm mb-3">Productos</h4>
              <div className="space-y-2">
                {loteDetalle.productos?.map((p, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-800">{p.producto}</span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${loteDetalle.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {loteDetalle.tipo === 'entrada' ? '+' : '-'}{p.cantidad}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Almacen;