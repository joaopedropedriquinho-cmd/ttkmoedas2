import { useEffect, useState } from 'react';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import OrderDialog from './components/OrderDialog.jsx';
import OrdersView from './components/OrdersView.jsx';
import RechargeForm from './components/RechargeForm.jsx';
import { createOrder, getCoinBalance } from './lib/store.js';

const infoPages = {
  terms: { eyebrow: 'INFORMAÇÕES', title: 'Termos', text: 'Esta versão é uma demonstração local. Os pedidos são registrados apenas no navegador, não geram cobrança e não acionam qualquer recarga. Antes de operar comercialmente, configure um canal de atendimento, regras de cancelamento e condições de pagamento.' },
  privacy: { eyebrow: 'INFORMAÇÕES', title: 'Privacidade', text: 'O nome de usuário informado e os dados do pedido ficam no armazenamento local deste navegador. Esta demonstração não envia esses dados a um servidor. Limpar os dados do navegador remove o histórico local.' },
  support: { eyebrow: 'ATENDIMENTO', title: 'Suporte', text: 'O canal de suporte ainda não foi configurado nesta demonstração. Não faça pagamentos até que um canal de atendimento e instruções verificáveis sejam disponibilizados.' },
};

export default function App() {
  const [page, setPage] = useState('home');
  const [balance, setBalance] = useState(getCoinBalance);
  const [activeOrder, setActiveOrder] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function showToast(message, type = 'success') {
    setToast({ message, type });
  }

  function navigate(target) {
    if (target === 'recharge') {
      setPage('home');
      window.setTimeout(() => document.getElementById('recharge')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
    } else {
      setPage(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleCreateOrder(details) {
    try {
      const order = createOrder({ ...details, paymentMethod: 'Pix' });
      setBalance(getCoinBalance());
      setActiveOrder(order);
      showToast('Pedido registrado neste navegador.');
    } catch (error) {
      showToast(error.message || 'Não foi possível registrar o pedido.', 'error');
    }
  }

  return (
    <div className={`app-shell ${page === 'home' ? 'home-app' : ''}`}>
      <Header balance={balance} page={page} onNavigate={navigate} />
      {page === 'home' ? (
        <main className="content-shell" id="recharge">
          <div className="intro-strip"><span className="intro-mark" aria-hidden="true">✳</span><span><b>Uma recarga sem complicação.</b><small>Você escolhe o pacote; o pedido fica registrado para processamento manual.</small></span><span className="strip-arrow" aria-hidden="true">↘</span></div>
          <RechargeForm onCreateOrder={handleCreateOrder} />
        </main>
      ) : page === 'orders' ? <OrdersView key={page} /> : (
        <main className="content-shell info-page"><div className="info-page-card"><span className="eyebrow">{infoPages[page]?.eyebrow}</span><h1>{infoPages[page]?.title}</h1><p>{infoPages[page]?.text}</p><button className="back-link" onClick={() => navigate('home')}>← Voltar ao início</button></div></main>
      )}
      <Footer onNavigate={navigate} />
      {activeOrder && <OrderDialog order={activeOrder} onClose={() => setActiveOrder(null)} onToast={showToast} />}
      {toast && <div className={`toast ${toast.type}`} role="status" aria-live="polite"><span aria-hidden="true">{toast.type === 'error' ? '!' : '✓'}</span>{toast.message}</div>}
    </div>
  );
}