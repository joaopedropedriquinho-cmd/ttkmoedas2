import { useState } from 'react';
import { formatCoins } from '../lib/store.js';

export default function Header({ balance, page, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (target) => {
    onNavigate(target);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => navigate('home')} aria-label="TTK Moedas, início">
          <span className="brand-coin" aria-hidden="true">T</span>
          <span className="brand-name">TTK <b>MOEDAS</b><small>RECARGA INDEPENDENTE</small></span>
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
          <button className={page === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('home')}>Início</button>
          <button className="nav-link" onClick={() => navigate('recharge')}>Recarregar</button>
          <button className={page === 'orders' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('orders')}>Meus pedidos</button>
        </nav>
        <div className="balance-chip" aria-live="polite">
          <span className="balance-coin" aria-hidden="true">¢</span>
          <span className="balance-copy"><b>{formatCoins(balance)}</b><small>moedas disponíveis</small></span>
        </div>
        <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}