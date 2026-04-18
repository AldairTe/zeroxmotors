import { useEffect, useState } from 'react';
import cotizacionService from '../services/cotizacionService';
import clienteService from '../services/clienteService';
import productoService from '../services/productoService';

function Cotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ cliente_id: '', estado: 'pendiente', vigencia: '', productos: [] });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const cargarCotizaciones = () => cotizacionService.getAll().then(res => setCotizaciones(res.data));

  useEffect(() => {
    cargarCotizaciones();
    clienteService.getAll().then(res => setClientes(res.data));
    productoService.getAll().then(res => setProductos(res.data));
  }, []);

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

  const calcularTotal = () => {
    return form.productos.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, total: calcularTotal() };
    if (editId) {
      await cotizacionService.update(editId, data);
    } else {
      await cotizacionService.create(data);
    }
    setForm({ cliente_id: '', estado: 'pendiente', vigencia: '', productos: [] });
    setEditId(null);
    setShowForm(false);
    cargarCotizaciones();
  };

  const handleEdit = async (cotizacion) => {
    const res = await cotizacionService.getById(cotizacion.id);
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
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar cotización?')) {
      await cotizacionService.delete(id);
      cargarCotizaciones();
    }
  };

  const handleConvertir = async (id) => {
    if (confirm('¿Convertir esta cotización en venta?')) {
      await cotizacionService.convertirAVenta(id);
      cargarCotizaciones();
    }
  };

  const estadoColor = (estado) => {
    if (estado === 'aprobado') return 'bg-green-100 text-green-700';
    if (estado === 'rechazado') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Cotizaciones</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ cliente_id: '', estado: 'pendiente', vigencia: '', productos: [] }); }}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500"
        >
          + Nueva Cotización
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <select className="border rounded-lg p-2" value={form.cliente_id} onChange={e => setForm({ ...form, cliente_id: e.target.value })} required>
              <option value="">Seleccionar cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
              ))}
            </select>
            <select className="border rounded-lg p-2" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>
            <input className="border rounded-lg p-2" type="date" value={form.vigencia} onChange={e => setForm({ ...form, vigencia: e.target.value })} required />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700">Productos</h3>
              <button type="button" onClick={agregarProducto} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200">
                + Agregar producto
              </button>
            </div>

            {form.productos.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4 border rounded-lg">Sin productos agregados</p>
            )}

            {form.productos.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 mb-2 items-center">
                <select
                  className="border rounded-lg p-2 col-span-2"
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
                  className="border rounded-lg p-2"
                  type="number"
                  min="1"
                  placeholder="Cant."
                  value={item.cantidad}
                  onChange={e => handleProductoChange(index, 'cantidad', parseInt(e.target.value))}
                  required
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">
                    S/. {(item.cantidad * item.precio_unitario).toFixed(2)}
                  </span>
                  <button type="button" onClick={() => eliminarProducto(index)} className="text-red-400 hover:text-red-600 text-lg font-bold">×</button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mb-4">
            <div className="bg-gray-50 rounded-lg px-6 py-3 text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-yellow-500">S/. {calcularTotal()}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500">
              {editId ? 'Actualizar' : 'Guardar'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
              Cancelar
            </button>
          </div>
        </form>
      )}

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
            {cotizaciones.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{c.id}</td>
                <td className="px-4 py-3 font-medium">{c.nombre} {c.apellido}</td>
                <td className="px-4 py-3">S/. {c.total}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoColor(c.estado)}`}>
                    {c.estado}
                  </span>
                </td>
                <td className="px-4 py-3">{c.vigencia?.split('T')[0]}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {c.estado === 'pendiente' && (
                      <button onClick={() => handleConvertir(c.id)} className="text-green-600 hover:underline text-xs font-semibold">
                        → Venta
                      </button>
                    )}
                    <button onClick={() => handleEdit(c)} className="text-blue-500 hover:underline">Editar</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cotizaciones;