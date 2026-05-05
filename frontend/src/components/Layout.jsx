import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;