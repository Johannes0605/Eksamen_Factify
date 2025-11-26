import NavMenu from './NavMenu';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', margin: 0, padding: 0, background: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)' }}>
      {/* Navbar at the top */}
      <NavMenu />
      
      {/* Main content area */}
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
