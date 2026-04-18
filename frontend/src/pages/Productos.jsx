import { useEffect, useState } from 'react';
import productoService from '../services/productoService';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const cargarProductos = () => {
    productoService.getAll().then(res => setProductos(res.data));
  };

  useEffect(() => { cargarProductos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await productoService.update(editId, form);
    } else {
      await productoService.create(form);
    }
    setForm({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: '' });
    setEditId(null);
    setShowForm(false);
    cargarProductos();
  };

  const handleEdit = (producto) => {
    setForm(producto);
    setEditId(producto.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar producto?')) {
      await productoService.delete(id);
      cargarProductos();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: '' }); }}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500"
        >
          + Nuevo Producto
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 grid grid-cols-2 gap-4">
          <input className="border rounded-lg p-2" placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
          <input className="border rounded-lg p-2" placeholder="Categoría" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} />
          <input className="border rounded-lg p-2" placeholder="Precio" type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} required />
          <input className="border rounded-lg p-2" placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
          <input className="border rounded-lg p-2 col-span-2" placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
          <input className="border rounded-lg p-2 col-span-2" placeholder="URL de imagen" value={form.imagen} onChange={e => setForm({ ...form, imagen: e.target.value })} />
          {form.imagen && (
            <div className="col-span-2">
              <img src={form.imagen} alt="preview" className="h-32 object-contain rounded-lg border" />
            </div>
          )}
          <div className="col-span-2 flex gap-2">
            <button type="submit" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500">
              {editId ? 'Actualizar' : 'Guardar'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
              Cancelar
            </button>
          </div>
        </form>
      )}

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
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  Stock: {p.stock}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="flex-1 text-center text-sm bg-blue-50 text-blue-600 py-1.5 rounded-lg hover:bg-blue-100">
                  Editar
                </button>
                <button onClick={() => handleDelete(p.id)} className="flex-1 text-center text-sm bg-red-50 text-red-600 py-1.5 rounded-lg hover:bg-red-100">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Productos;