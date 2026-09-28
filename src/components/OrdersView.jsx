import { formatCoins, formatPrice, getOrders } from '../lib/store.js';

export default function OrdersView() {
  const orders = getOrders();
  return (
    <main className="content-shell orders-page">
      <div className="page-title"><span className="eyebrow">SEU HISTÓRICO</span><h1>Meus pedidos</h1><p>Pedidos registrados neste navegador.</p></div>
      {orders.length === 0 ? (
        <div className="empty-state"><span className="empty-icon" aria-hidden="true">◷</span><h2>Nenhum pedido por aqui</h2><p>Quando você criar um pedido, ele aparecerá nesta lista.</p></div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-row" key={order.id}>
              <div className="order-row-main"><b>{order.id}</b><span>@{order.username} · {formatCoins(order.coins)} moedas</span><small>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(order.createdAt))}</small></div>
              <div className="order-row-meta"><b>{formatPrice(Math.round(order.price * 100))}</b><span className="status-pill">Pendente</span></div>
            </article>
          ))}
        </div>
      )}
      <div className="local-storage-note"><b>Histórico local</b><span>Os pedidos ficam salvos apenas neste dispositivo e navegador. Eles não são enviados a um servidor.</span></div>
    </main>
  );
}