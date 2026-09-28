import { useEffect, useRef, useState } from 'react';
import { formatCoins, formatPrice } from '../lib/store.js';

export default function OrderDialog({ order, onClose, onToast }) {
  const closeRef = useRef(null);
  const [copyLabel, setCopyLabel] = useState('Copiar número do pedido');

  useEffect(() => {
    closeRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  async function copyOrderId() {
    try {
      await navigator.clipboard.writeText(order.id);
      setCopyLabel('Pedido copiado!');
      onToast('Número do pedido copiado.');
    } catch {
      onToast('Não foi possível copiar. Anote o número do pedido.', 'error');
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="order-dialog" role="dialog" aria-modal="true" aria-labelledby="order-dialog-title">
        <button className="dialog-close" onClick={onClose} ref={closeRef} aria-label="Fechar pedido">×</button>
        <div className="order-success-icon" aria-hidden="true">✓</div>
        <span className="eyebrow">REGISTRO LOCAL</span>
        <h2 id="order-dialog-title">Pedido criado!</h2>
        <p className="dialog-intro">Anote o número para acompanhar com o suporte.</p>
        <div className="order-id-box"><span>Número do pedido</span><b>{order.id}</b></div>
        <div className="dialog-details">
          <div><span>Usuário</span><b>@{order.username}</b></div>
          <div><span>Moedas</span><b>{formatCoins(order.coins)}</b></div>
          <div><span>Total</span><b>{formatPrice(Math.round(order.price * 100))}</b></div>
          <div><span>Pagamento</span><b>{order.paymentMethod}</b></div>
          <div><span>Status</span><b className="pending-status">Aguardando pagamento</b></div>
        </div>
        <p className="dialog-disclaimer">Seu pedido foi salvo somente neste navegador e será processado manualmente. Nenhum pagamento foi cobrado e nenhuma moeda foi enviada.</p>
        <button className="copy-button" onClick={copyOrderId}><span aria-hidden="true">▣</span>{copyLabel}</button>
        <button className="dialog-done" onClick={onClose}>Fechar</button>
      </section>
    </div>
  );
}