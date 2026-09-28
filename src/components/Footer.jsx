export default function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand"><b>TTK <span>MOEDAS</span></b><small>Serviço independente de recarga.</small><small>Não afiliado nem operado pelo TikTok.</small></div>
        <nav className="footer-links" aria-label="Informações"><button onClick={() => onNavigate('terms')}>Termos</button><button onClick={() => onNavigate('privacy')}>Privacidade</button><button onClick={() => onNavigate('support')}>Suporte</button></nav>
        <span className="footer-copyright">© {new Date().getFullYear()} TTK Moedas</span>
      </div>
    </footer>
  );
}