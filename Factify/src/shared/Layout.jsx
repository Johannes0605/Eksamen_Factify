import NavMenu from './NavMenu';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', margin: 0, padding: 0, background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)' }}>
      {/* Navbar at the top */}
      <NavMenu />
      
      {/* Main content area */}
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
