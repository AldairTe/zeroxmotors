import { useEffect, useState } from 'react';
import cotizacionService from '../services/cotizacionService';
import clienteService from '../services/clienteService';
import productoService from '../services/productoService';

function Cotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetalle, setShowDetalle] = useState(false);
  const [cotizacionDetalle, setCotizacionDetalle] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ cliente_id: '', estado: 'pendiente', vigencia: '', productos: [] });

  const cargarDatos = () => {
    cotizacionService.getAll().then(res => setCotizaciones(res.data));
    clienteService.getAll().then(res => setClientes(res.data));
    productoService.getAll().then(res => setProductos(res.data));
  };

  useEffect(() => { cargarDatos(); }, []);

  // ── Modal Cotización ──────────────────────────────────────
  const abrirModal = (cotizacion = null) => {
    setError('');
    if (cotizacion) {
      cotizacionService.getById(cotizacion.id).then(res => {
        const data = res.data;
        setForm({
          cliente_id: data.cliente_id,
          estado: data.estado,
          vigencia: data.vigencia?.split('T')[0],
          productos: data.productos.map(p => ({
            producto_id: p.producto_id,
            cantidad: p.cantidad,
            precio_unitario: p.precio_unitario,
          })),
        });
        setEditId(cotizacion.id);
      });
    } else {
      setForm({ cliente_id: '', estado: 'pendiente', vigencia: '', productos: [] });
      setEditId(null);
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditId(null);
    setError('');
  };

  const agregarProducto = () => {
    setForm({ ...form, productos: [...form.productos, { producto_id: '', cantidad: 1, precio_unitario: 0 }] });
  };

  const eliminarProducto = (index) => {
    setForm({ ...form, productos: form.productos.filter((_, i) => i !== index) });
  };

  const handleProductoChange = (index, field, value) => {
    const nuevos = [...form.productos];
    nuevos[index][field] = value;
    if (field === 'producto_id') {
      const prod = productos.find(p => p.id === parseInt(value));
      if (prod) nuevos[index].precio_unitario = prod.precio;
    }
    setForm({ ...form, productos: nuevos });
  };

  const calcularTotal = () =>
    form.productos.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = { ...form, total: calcularTotal() };
      if (editId) {
        await cotizacionService.update(editId, data);
      } else {
        await cotizacionService.create(data);
      }
      cerrarModal();
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar esta cotización?')) {
      await cotizacionService.delete(id);
      cargarDatos();
    }
  };

  const handleConvertir = async (id) => {
    if (confirm('¿Convertir esta cotización en venta? Se descontará el stock automáticamente.')) {
      try {
        await cotizacionService.convertirAVenta(id);
        cargarDatos();
      } catch (err) {
        alert(err.response?.data?.error || 'Error al convertir');
      }
    }
  };

  // ── Modal Detalle ─────────────────────────────────────────
  const verDetalle = async (cotizacion) => {
    const res = await cotizacionService.getById(cotizacion.id);
    setCotizacionDetalle(res.data);
    setShowDetalle(true);
  };

  const estadoColor = (estado) => {
    if (estado === 'aprobado') return 'bg-green-100 text-green-700';
    if (estado === 'rechazado') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Cotizaciones</h2>
        <button
          onClick={() => abrirModal()}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500"
        >
          + Nueva Cotización
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Vigencia</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cotizaciones.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">No hay cotizaciones registradas</td>
              </tr>
            ) : cotizaciones.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.id}</td>
                <td className="px-4 py-3">{c.nombre} {c.apellido}</td>
                <td className="px-4 py-3 font-semibold">S/. {c.total}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoColor(c.estado)}`}>
                    {c.estado}
                  </span>
                </td>
                <td className="px-4 py-3">{c.vigencia?.split('T')[0] || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => verDetalle(c)} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">
                      Ver
                    </button>
                    {c.estado === 'pendiente' && (
                      <>
                        <button onClick={() => handleConvertir(c.id)} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 font-semibold">
                          → Venta
                        </button>
                        <button onClick={() => abrirModal(c)} className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded hover:bg-yellow-100">
                          Editar
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDelete(c.id)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nueva/Editar Cotización */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">
                {editId ? 'Editar Cotización' : 'Nueva Cotización'}
              </h3>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <select
                    className="w-full border rounded-lg p-2 text-sm"
                    value={form.cliente_id}
                    onChange={e => setForm({ ...form, cliente_id: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    className="w-full border rounded-lg p-2 text-sm"
                    value={form.estado}
                    onChange={e => setForm({ ...form, estado: e.target.value })}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vigencia</label>
                  <input
                    className="w-full border rounded-lg p-2 text-sm"
                    type="date"
                    value={form.vigencia}
                    onChange={e => setForm({ ...form, vigencia: e.target.value })}
                    required
                  />
                </div>
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

                {form.productos.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4 border rounded-lg">
                    Sin productos — haz clic en "Agregar producto"
                  </p>
                ) : form.productos.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                    <select
                      className="border rounded-lg p-2 text-sm col-span-6"
                      value={item.producto_id}
                      onChange={e => handleProductoChange(index, 'producto_id', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar producto</option>
                      {productos.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre} — S/. {p.precio}</option>
                      ))}
                    </select>
                    <input
                      className="border rounded-lg p-2 text-sm col-span-2"
                      type="number"
                      min="1"
                      placeholder="Cant."
                      value={item.cantidad}
                      onChange={e => handleProductoChange(index, 'cantidad', parseInt(e.target.value))}
                      required
                    />
                    <span className="text-sm text-gray-500 col-span-2 text-center">
                      S/. {item.precio_unitario}
                    </span>
                    <span className="text-sm font-semibold text-yellow-600 col-span-1">
                      S/. {(item.cantidad * item.precio_unitario).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => eliminarProducto(index)}
                      className="col-span-1 text-red-400 hover:text-red-600 text-xl font-bold text-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="bg-gray-50 rounded-lg px-6 py-3 text-right">
                  <p className="text-xs text-gray-500">Total estimado</p>
                  <p className="text-2xl font-bold text-yellow-500">S/. {calcularTotal()}</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={cerrarModal} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm">
                  Cancelar
                </button>
                <button type="submit" className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 text-sm">
                  {editId ? 'Actualizar' : 'Guardar Cotización'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {showDetalle && cotizacionDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Detalle Cotización #{cotizacionDetalle.id}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${estadoColor(cotizacionDetalle.estado)}`}>
                  {cotizacionDetalle.estado}
                </span>
              </div>
              <button onClick={() => setShowDetalle(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Cliente</span>
                  <span className="font-medium">{cotizacionDetalle.nombre} {cotizacionDetalle.apellido}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Vigencia</span>
                  <span className="font-medium">{cotizacionDetalle.vigencia?.split('T')[0] || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha</span>
                  <span className="font-medium">{new Date(cotizacionDetalle.fecha).toLocaleDateString()}</span>
                </div>
              </div>

              <h4 className="font-semibold text-gray-700 text-sm mb-3">Productos</h4>
              <div className="space-y-2 mb-4">
                {cotizacionDetalle.productos?.map((p, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="font-medium text-gray-800">{p.nombre}</span>
                    <div className="text-right">
                      <p className="text-gray-500">{p.cantidad} × S/. {p.precio_unitario}</p>
                      <p className="font-semibold text-yellow-600">S/. {(p.cantidad * p.precio_unitario).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t pt-3">
                <span className="font-bold text-gray-700">TOTAL</span>
                <span className="text-2xl font-bold text-yellow-500">S/. {cotizacionDetalle.total}</span>
              </div>

              {cotizacionDetalle.estado === 'pendiente' && (
                <button
                  onClick={() => {
                    setShowDetalle(false);
                    handleConvertir(cotizacionDetalle.id);
                  }}
                  className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 text-sm"
                >
                  → Convertir a Venta
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cotizaciones;