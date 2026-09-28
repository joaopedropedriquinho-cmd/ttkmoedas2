import { useState } from 'react';
import { formatCoins, formatPrice, validateUsername } from '../lib/store.js';

const packages = [
  { coins: 350, priceCents: 994, oldPriceCents: 1988 },
  { coins: 700, priceCents: 1987, oldPriceCents: 3974 },
  { coins: 1400, priceCents: 3974, oldPriceCents: 7949 },
  { coins: 3500, priceCents: 9934, oldPriceCents: 19867 },
  { coins: 7000, priceCents: 19867, oldPriceCents: 39734 },
  { coins: 17500, priceCents: 49664, oldPriceCents: 99328 },
];

function RoseInfo() {
  return <div className="rose-info"><span className="rose-icon" aria-hidden="true">🌹</span><span><b>Rosa</b><small>1 rosa = 1.000 moedas</small></span><span className="rose-coin">1.000 <small>moedas</small></span></div>;
}

function CouponBadge() {
  return <div className="coupon-line"><span className="coupon-check" aria-hidden="true">✓</span><span><b>Cupom aplicado!</b><small>Desconto demonstrativo no pedido</small></span><span className="discount-badge">50% OFF</span></div>;
}

function CoinPackages({ selected, onSelect }) {
  return (
    <div className="package-grid" role="group" aria-label="Pacotes de moedas">
      {packages.map((item) => {
        const isSelected = selected?.coins === item.coins;
        return (
          <button key={item.coins} type="button" className={`package-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(item)} aria-pressed={isSelected}>
            <span className="package-top"><span className="package-coin" aria-hidden="true">¢</span><span className="package-discount">50% OFF</span></span>
            <b className="package-amount">{formatCoins(item.coins)} <small>moedas</small></b>
            <span className="package-price">{formatPrice(item.priceCents)}</span>
            <s className="package-old-price">{formatPrice(item.oldPriceCents)}</s>
          </button>
        );
      })}
    </div>
  );
}

function OrderSummary({ username, selected }) {
  return (
    <section className="summary-section" aria-labelledby="summary-title">
      <h3 id="summary-title">Resumo do pedido</h3>
      <div className="summary-box">
        <div><span>Usuário</span><b>{username ? `@${username}` : 'Aguardando validação'}</b></div>
        <div><span>Moedas</span><b>{selected ? formatCoins(selected.coins) : '—'}</b></div>
        <div><span>Desconto</span><b className="summary-discount">50%</b></div>
        <div className="summary-total"><span>Total</span><b>{selected ? formatPrice(selected.priceCents) : '—'}</b></div>
      </div>
    </section>
  );
}

function PaymentMethod() {
  return (
    <section className="payment-section" aria-labelledby="payment-title">
      <h3 id="payment-title">Método de pagamento</h3>
      <div className="payment-card">
        <span className="pix-mark" aria-hidden="true"><i /><i /><i /><i /></span>
        <span className="payment-copy"><b>Pagamento via Pix</b><small>As instruções serão combinadas manualmente após a conferência do pedido.</small></span>
        <span className="radio-selected" aria-label="Pix selecionado"><i /></span>
      </div>
      <p className="payment-note">Esta demonstração não processa pagamentos nem gera cobranças Pix.</p>
    </section>
  );
}

export default function RechargeForm({ onCreateOrder }) {
  const [rawUsername, setRawUsername] = useState('');
  const [verifiedUsername, setVerifiedUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [selected, setSelected] = useState(null);
  const [formError, setFormError] = useState('');

  function checkUsername() {
    const result = validateUsername(rawUsername);
    setUsernameError(result.error);
    setVerifiedUsername(result.error ? '' : result.username);
    setFormError('');
    return result;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = checkUsername();
    if (result.error) return;
    if (!selected) {
      setFormError('Escolha um pacote de moedas.');
      return;
    }
    onCreateOrder({ username: result.username, ...selected });
  }

  return (
    <form className="recharge-card" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <div><span className="eyebrow">SUA RECARGA, DO SEU JEITO</span><h1>Recarregar</h1><p>Escolha a quantidade de moedas que deseja recarregar.</p></div>
        <span className="heading-stamp" aria-hidden="true">¢</span>
      </div>

      <section className="username-section" aria-labelledby="username-label">
        <label id="username-label" htmlFor="username">Nome de usuário do TikTok</label>
        <div className={`username-control ${usernameError ? 'has-error' : ''} ${verifiedUsername ? 'is-valid' : ''}`}>
          <span className="at-prefix" aria-hidden="true">@</span>
          <input id="username" name="username" autoComplete="off" value={rawUsername} onChange={(event) => { setRawUsername(event.target.value); setVerifiedUsername(''); setUsernameError(''); setFormError(''); }} placeholder="seuusuario" aria-describedby="username-hint username-feedback" aria-invalid={Boolean(usernameError)} />
          <button type="button" className="verify-button" onClick={checkUsername}>Verificar</button>
        </div>
        <div className="username-feedback" id="username-feedback" aria-live="polite">
          {usernameError && <span className="error-text">{usernameError}</span>}
          {verifiedUsername && <span className="success-text">✓ Formato válido; não consultamos o TikTok.</span>}
        </div>
        <small className="field-hint" id="username-hint">Digite com ou sem @. Conferimos somente o formato do nome.</small>
      </section>

      <RoseInfo />

      <section className="packages-section" aria-labelledby="packages-title">
        <div className="section-title-row"><div><h2 id="packages-title">Escolha seu pacote</h2><p>Moedas para presentear e aproveitar as lives.</p></div><span className="section-count">06 opções</span></div>
        <CouponBadge />
        <p className="savings-copy">Recarregue suas moedas com economia.<br /><span>Economize até 50% em comparação com a compra pelo aplicativo.</span></p>
        <CoinPackages selected={selected} onSelect={(item) => { setSelected(item); setFormError(''); }} />
      </section>

      <OrderSummary username={verifiedUsername} selected={selected} />
      <PaymentMethod />

      {formError && <p className="form-error" role="alert">{formError}</p>}
      <button className="submit-button" type="submit"><span>Recarregar</span><span aria-hidden="true">→</span></button>
      <p className="manual-note"><span aria-hidden="true">i</span> Pedido local, com processamento manual. Nenhuma recarga é automática.</p>
    </form>
  );
}