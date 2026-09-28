# TTK MOEDAS

Interface responsiva para registrar pedidos demonstrativos de recarga manual. O projeto usa React, Vite e JavaScript.

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm

## Instalar e executar

```bash
npm install
npm run dev
```

## Produção

```bash
npm run build
npm run preview
```

## Estrutura

- `src/components/`: cabeçalho, formulário, pedidos, modal e rodapé.
- `src/lib/store.js`: validação, formatação, estoque e persistência local.
- `src/App.jsx`: navegação e coordenação do fluxo.
- `public/`: favicon.

## Limites desta versão

Os pedidos e o estoque são armazenados no `localStorage` deste navegador. Não há servidor, consulta ao TikTok, integração Pix, cobrança ou envio automático de moedas. Um pedido fica pendente e requer conferência e processamento manual por um operador; o canal de suporte precisa ser configurado antes de qualquer uso comercial. O estoque é uma demonstração local e não é compartilhado entre dispositivos.