const STORAGE_KEY = 'ttkmoedas.demo.v1';
export const INITIAL_BALANCE = 1_000_000_000;

function getState() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initialState = { balance: INITIAL_BALANCE, orders: [] };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }

  try {
    const saved = JSON.parse(raw);
    return {
      balance: Number.isSafeInteger(saved.balance) && saved.balance >= 0 ? saved.balance : INITIAL_BALANCE,
      orders: Array.isArray(saved.orders) ? saved.orders : [],
    };
  } catch {
    return { balance: INITIAL_BALANCE, orders: [] };
  }
}

function saveState(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getCoinBalance() {
  try {
    return getState().balance;
  } catch {
    return INITIAL_BALANCE;
  }
}

export function consumeCoins(amount) {
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error('A quantidade de moedas precisa ser válida.');
  }

  const state = getState();
  if (amount > state.balance) {
    throw new Error('O estoque disponível não é suficiente para esse pacote.');
  }

  const nextBalance = state.balance - amount;
  saveState({ ...state, balance: nextBalance });
  return nextBalance;
}

export function resetCoinBalance() {
  const state = getState();
  saveState({ ...state, balance: INITIAL_BALANCE });
}

export function generateOrderId(existingOrders = getOrders()) {
  let id;
  do {
    id = `TTK-${String(Math.floor(100_000 + Math.random() * 900_000))}`;
  } while (existingOrders.some((order) => order.id === id));
  return id;
}

export function createOrder({ username, coins, priceCents, paymentMethod = 'Pix' }) {
  const normalizedUsername = String(username ?? '').trim().replace(/^@+/, '');
  if (!/^[a-zA-Z0-9._]{2,24}$/.test(normalizedUsername)) {
    throw new Error('O nome de usuário não está em um formato válido.');
  }
  if (!Number.isSafeInteger(coins) || coins <= 0 || !Number.isSafeInteger(priceCents) || priceCents <= 0) {
    throw new Error('Confira o pacote escolhido antes de continuar.');
  }

  const state = getState();
  if (coins > state.balance) {
    throw new Error('O estoque disponível não é suficiente para esse pacote.');
  }

  const order = {
    id: generateOrderId(state.orders),
    username: normalizedUsername,
    coins,
    price: priceCents / 100,
    paymentMethod,
    status: 'Pendente',
    createdAt: new Date().toISOString(),
  };
  saveState({ balance: state.balance - coins, orders: [order, ...state.orders] });
  return order;
}

export function getOrders() {
  try {
    return getState().orders;
  } catch {
    return [];
  }
}

export function getOrderById(id) {
  return getOrders().find((order) => order.id === id) ?? null;
}

export function normalizeUsername(value) {
  return String(value ?? '').trim().replace(/^@+/, '');
}

export function validateUsername(value) {
  const username = normalizeUsername(value);
  if (!username) return { username, error: 'Digite seu nome de usuário do TikTok.' };
  if (username.length < 2) return { username, error: 'O nome de usuário precisa ter pelo menos 2 caracteres.' };
  if (username.length > 24 || !/^[a-zA-Z0-9._]+$/.test(username)) {
    return { username, error: 'Use apenas letras, números, ponto e sublinhado.' };
  }
  return { username, error: '' };
}

export const formatCoins = (amount) => new Intl.NumberFormat('pt-BR').format(amount);
export const formatPrice = (priceCents) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceCents / 100);