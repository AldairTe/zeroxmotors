import { useEffect, useState } from 'react';
import ventaService from '../services/ventaService';
import clienteService from '../services/clienteService';
import productoService from '../services/productoService';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showComprobante, setShowComprobante] = useState(false);
  const [comprobante, setComprobante] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ cliente_id: '', estado: 'pendiente', productos: [] });

  const cargarDatos = () => {
    ventaService.getAll().then(res => setVentas(res.data));
    clienteService.getAll().then(res => setClientes(res.data));
    productoService.getAll().then(res => setProductos(res.data));
  };

  useEffect(() => { cargarDatos(); }, []);

  const abrirModal = (venta = null) => {
    setError('');
    if (venta) {
      ventaService.getById(venta.id).then(res => {
        const data = res.data;
        setForm({
          cliente_id: data.cliente_id,
          estado: data.estado,
          productos: data.productos.map(p => ({
            producto_id: p.producto_id,
            cantidad: p.cantidad,
            precio_unitario: p.precio_unitario,
          })),
        });
        setEditId(venta.id);
      });
    } else {
      setForm({ cliente_id: '', estado: 'pendiente', productos: [] });
      setEditId(null);
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditId(null);
    setError('');
    setForm({ cliente_id: '', estado: 'pendiente', productos: [] });
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
        await ventaService.update(editId, data);
      } else {
        await ventaService.create(data);
      }
      cerrarModal();
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar la venta');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar esta venta?')) {
      await ventaService.delete(id);
      cargarDatos();
    }
  };

  const verComprobante = async (id) => {
    const res = await ventaService.getComprobante(id);
    setComprobante(res.data.comprobante);
    setShowComprobante(true);
  };

  const estadoColor = (estado) => {
    if (estado === 'pagado') return 'bg-green-100 text-green-700';
    if (estado === 'anulado') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ventas</h2>
        <button
          onClick={() => abrirModal()}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500"
        >
          + Nueva Venta
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
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ventas.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">No hay ventas registradas</td>
              </tr>
            ) : ventas.map(v => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{v.id}</td>
                <td className="px-4 py-3">{v.nombre} {v.apellido}</td>
                <td className="px-4 py-3 font-semibold">S/. {v.total}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoColor(v.estado)}`}>
                    {v.estado}
                  </span>
                </td>
                <td className="px-4 py-3">{new Date(v.fecha).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => verComprobante(v.id)} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100">
                      Comprobante
                    </button>
                    <button onClick={() => abrirModal(v)} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(v.id)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nueva/Editar Venta */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">
                {editId ? 'Editar Venta' : 'Nueva Venta'}
              </h3>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Error de stock */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
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
                    <option value="pagado">Pagado</option>
                    <option value="anulado">Anulado</option>
                  </select>
                </div>
              </div>

              {/* Productos */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-700 text-sm">Productos</h4>
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
                ) : form.productos.map((item, index) => {
                  const prod = productos.find(p => p.id === parseInt(item.producto_id));
                  return (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                      <select
                        className="border rounded-lg p-2 text-sm col-span-5"
                        value={item.producto_id}
                        onChange={e => handleProductoChange(index, 'producto_id', e.target.value)}
                        required
                      >
                        <option value="">Seleccionar</option>
                        {productos.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.nombre} (Stock: {p.stock})
                          </option>
                        ))}
                      </select>
                      <input
                        className="border rounded-lg p-2 text-sm col-span-2"
                        type="number"
                        min="1"
                        max={prod?.stock || 999}
                        placeholder="Cant."
                        value={item.cantidad}
                        onChange={e => handleProductoChange(index, 'cantidad', parseInt(e.target.value))}
                        required
                      />
                      <span className="text-sm text-gray-500 col-span-2 text-center">
                        S/. {item.precio_unitario}
                      </span>
                      <span className="text-sm font-semibold text-yellow-600 col-span-2">
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
                  );
                })}
              </div>

              {/* Total */}
              <div className="flex justify-end mb-6">
                <div className="bg-gray-50 rounded-lg px-6 py-3 text-right">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-yellow-500">S/. {calcularTotal()}</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 text-sm"
                >
                  {editId ? 'Actualizar' : 'Registrar Venta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Comprobante */}
      {showComprobante && comprobante && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">Comprobante de Pago</h3>
              <button onClick={() => setShowComprobante(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-yellow-500">ZeroxMotors</h2>
                <p className="text-xs text-gray-400">Sistema de Ventas de Repuestos</p>
                <p className="text-lg font-bold text-gray-800 mt-2">{comprobante.numero}</p>
              </div>
              <div className="border-t border-b py-3 mb-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Cliente:</span>
                  <span className="font-medium">{comprobante.cliente}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha:</span>
                  <span className="font-medium">{new Date(comprobante.fecha).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estado:</span>
                  <span className={`font-semibold ${comprobante.estado === 'pagado' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {comprobante.estado}
                  </span>
                </div>
              </div>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="text-gray-500 text-xs border-b">
                    <th className="text-left py-1">Producto</th>
                    <th className="text-center py-1">Cant.</th>
                    <th className="text-right py-1">Precio</th>
                    <th className="text-right py-1">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {comprobante.productos.map((p, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-1">{p.nombre}</td>
                      <td className="text-center py-1">{p.cantidad}</td>
                      <td className="text-right py-1">S/. {p.precio_unitario}</td>
                      <td className="text-right py-1 font-medium">S/. {(p.cantidad * p.precio_unitario).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">TOTAL</span>
                <span className="text-2xl font-bold text-yellow-500">S/. {comprobante.total}</span>
              </div>
              <button
                onClick={() => window.print()}
                className="w-full mt-4 bg-yellow-400 text-gray-900 py-2 rounded-lg font-semibold hover:bg-yellow-500 text-sm"
              >
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ventas;