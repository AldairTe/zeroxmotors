import { useEffect, useState } from 'react';
import productoService from '../services/productoService';
import movimientoService from '../services/movimientoService';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: '' });
  const [movForm, setMovForm] = useState({ tipo: 'entrada', cantidad: 1, motivo: '' });

  const cargarProductos = () => productoService.getAll().then(res => setProductos(res.data));

  useEffect(() => { cargarProductos(); }, []);

  // ── Modal Producto ────────────────────────────────────────
  const abrirModal = (producto = null) => {
    setError('');
    if (producto) {
      setForm(producto);
      setEditId(producto.id);
    } else {
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: '' });
      setEditId(null);
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditId(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await productoService.update(editId, form);
      } else {
        await productoService.create(form);
      }
      cerrarModal();
      cargarProductos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este producto?')) {
      await productoService.delete(id);
      cargarProductos();
    }
  };

  // ── Modal Movimiento ──────────────────────────────────────
  const abrirMovimientoModal = (producto) => {
    setProductoSeleccionado(producto);
    setMovForm({ tipo: 'entrada', cantidad: 1, motivo: '' });
    setError('');
    setShowMovimientoModal(true);
  };

  const cerrarMovimientoModal = () => {
    setShowMovimientoModal(false);
    setProductoSeleccionado(null);
    setError('');
  };

  const handleMovimiento = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await movimientoService.registrar({
        producto_id: productoSeleccionado.id,
        ...movForm
      });
      cerrarMovimientoModal();
      cargarProductos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar movimiento');
    }
  };

  // ── Modal Historial ───────────────────────────────────────
  const abrirHistorial = async (producto) => {
    setProductoSeleccionado(producto);
    const res = await movimientoService.getByProducto(producto.id);
    setMovimientos(res.data);
    setShowHistorialModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
        <button
          onClick={() => abrirModal()}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Grid de productos */}
      {productos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No hay productos registrados</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {p.imagen
                  ? <img src={p.imagen} alt={p.nombre} className="h-full w-full object-contain p-4" />
                  : <span className="text-gray-400 text-sm">Sin imagen</span>
                }
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800">{p.nombre}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{p.categoria}</span>
                </div>
                <p className="text-gray-500 text-sm mb-3">{p.descripcion}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-yellow-500">S/. {p.precio}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    Stock: {p.stock}
                  </span>
                </div>
                {/* Acciones */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => abrirMovimientoModal(p)}
                    className="text-center text-sm bg-green-50 text-green-600 py-1.5 rounded-lg hover:bg-green-100 font-medium"
                  >
                    Entrada/Salida
                  </button>
                  <button
                    onClick={() => abrirHistorial(p)}
                    className="text-center text-sm bg-purple-50 text-purple-600 py-1.5 rounded-lg hover:bg-purple-100 font-medium"
                  >
                    Historial
                  </button>
                  <button
                    onClick={() => abrirModal(p)}
                    className="text-center text-sm bg-blue-50 text-blue-600 py-1.5 rounded-lg hover:bg-blue-100"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-center text-sm bg-red-50 text-red-600 py-1.5 rounded-lg hover:bg-red-100"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nuevo/Editar Producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">
                {editId ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    className="w-full border rounded-lg p-2 text-sm"
                    placeholder="Nombre del producto"
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <input
                    className="w-full border rounded-lg p-2 text-sm"
                    placeholder="Ej: Frenos, Motor"
                    value={form.categoria}
                    onChange={e => setForm({ ...form, categoria: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/.)</label>
                  <input
                    className="w-full border rounded-lg p-2 text-sm"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.precio}
                    onChange={e => setForm({ ...form, precio: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock inicial</label>
                  <input
                    className="w-full border rounded-lg p-2 text-sm"
                    type="number"
                    placeholder="0"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  className="w-full border rounded-lg p-2 text-sm"
                  placeholder="Descripción del producto"
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
                <input
                  className="w-full border rounded-lg p-2 text-sm"
                  placeholder="https://..."
                  value={form.imagen}
                  onChange={e => setForm({ ...form, imagen: e.target.value })}
                />
                {form.imagen && (
                  <img src={form.imagen} alt="preview" className="h-24 object-contain rounded-lg border mt-2" />
                )}
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={cerrarModal} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm">
                  Cancelar
                </button>
                <button type="submit" className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 text-sm">
                  {editId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Entrada/Salida */}
      {showMovimientoModal && productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Movimiento de Stock</h3>
                <p className="text-sm text-gray-500">{productoSeleccionado.nombre}</p>
              </div>
              <button onClick={cerrarMovimientoModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>
            <form onSubmit={handleMovimiento} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* Stock actual */}
              <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">Stock actual</span>
                <span className={`font-bold text-lg ${productoSeleccionado.stock > 10 ? 'text-green-600' : 'text-red-600'}`}>
                  {productoSeleccionado.stock} unidades
                </span>
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de movimiento</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMovForm({ ...movForm, tipo: 'entrada' })}
                    className={`py-3 rounded-lg text-sm font-semibold border-2 transition-colors ${movForm.tipo === 'entrada' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}
                  >
                    ↑ Entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovForm({ ...movForm, tipo: 'salida' })}
                    className={`py-3 rounded-lg text-sm font-semibold border-2 transition-colors ${movForm.tipo === 'salida' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500'}`}
                  >
                    ↓ Salida
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input
                  className="w-full border rounded-lg p-2 text-sm"
                  type="number"
                  min="1"
                  value={movForm.cantidad}
                  onChange={e => setMovForm({ ...movForm, cantidad: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                <input
                  className="w-full border rounded-lg p-2 text-sm"
                  placeholder="Ej: Compra a proveedor, Ajuste de inventario..."
                  value={movForm.motivo}
                  onChange={e => setMovForm({ ...movForm, motivo: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={cerrarMovimientoModal} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg font-semibold text-sm text-white ${movForm.tipo === 'entrada' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  Registrar {movForm.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Historial */}
      {showHistorialModal && productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Historial de Movimientos</h3>
                <p className="text-sm text-gray-500">{productoSeleccionado.nombre}</p>
              </div>
              <button onClick={() => setShowHistorialModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>
            <div className="p-6">
              {movimientos.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Sin movimientos registrados</p>
              ) : (
                <div className="space-y-3">
                  {movimientos.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${m.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'}`}>
                          {m.tipo === 'entrada' ? '↑' : '↓'}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{m.motivo}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(m.fecha).toLocaleDateString()} — {m.usuario || 'Sistema'}
                          </p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm px-3 py-1 rounded-full ${m.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {m.tipo === 'entrada' ? '+' : '-'}{m.cantidad}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;