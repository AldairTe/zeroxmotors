import { useEffect, useState } from 'react';
import clienteService from '../services/clienteService';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ tipo_documento: 'DNI', numero_documento: '', nombre: '', apellido: '', telefono: '', email: '', direccion: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const cargarClientes = () => {
    clienteService.getAll().then(res => setClientes(res.data));
  };

  useEffect(() => { cargarClientes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await clienteService.update(editId, form);
    } else {
      await clienteService.create(form);
    }
    setForm({ tipo_documento: 'DNI', numero_documento: '', nombre: '', apellido: '', telefono: '', email: '', direccion: '' });
    setEditId(null);
    setShowForm(false);
    cargarClientes();
  };

  const handleEdit = (cliente) => {
    setForm(cliente);
    setEditId(cliente.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar cliente?')) {
      await clienteService.delete(id);
      cargarClientes();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ tipo_documento: 'DNI', numero_documento: '', nombre: '', apellido: '', telefono: '', email: '', direccion: '' }); }}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500"
        >
          + Nuevo Cliente
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 grid grid-cols-2 gap-4">
          <select className="border rounded-lg p-2" value={form.tipo_documento} onChange={e => setForm({ ...form, tipo_documento: e.target.value })}>
            <option value="DNI">DNI</option>
            <option value="RUC">RUC</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
          <input className="border rounded-lg p-2" placeholder="Número de documento" value={form.numero_documento} onChange={e => setForm({ ...form, numero_documento: e.target.value })} required />
          <input className="border rounded-lg p-2" placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
          <input className="border rounded-lg p-2" placeholder="Apellido" value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} required />
          <input className="border rounded-lg p-2" placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
          <input className="border rounded-lg p-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="border rounded-lg p-2 col-span-2" placeholder="Dirección" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
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

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Documento</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Teléfono</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Dirección</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clientes.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded mr-1">{c.tipo_documento}</span>
                  {c.numero_documento}
                </td>
                <td className="px-4 py-3 font-medium">{c.nombre} {c.apellido}</td>
                <td className="px-4 py-3">{c.telefono}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.direccion}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(c)} className="text-blue-500 hover:underline">Editar</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clientes;