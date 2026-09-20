// ==========================================================================
// ODDAWORLD Store - State Management (Cart, Wishlist, Compare, Account)
// ==========================================================================

class Store {
  constructor() {
    this.STORAGE_KEYS = {
      CART: 'oddaworld_cart_v1',
      WISHLIST: 'oddaworld_wishlist_v1',
      COMPARE: 'oddaworld_compare_v1',
      USER: 'oddaworld_user_v1',
      ORDERS: 'oddaworld_orders_v1'
    };

    this.listeners = new Set();

    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.compare = this.loadCompare();
    this.user = this.loadUser();
    this.orders = this.loadOrders();
  }

  // --- PUB/SUB ---
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event, payload) {
    this.listeners.forEach(cb => {
      try {
        cb(event, payload);
      } catch (err) {
        console.error('Store listener error:', err);
      }
    });
  }

  // --- CART MANAGEMENT ---
  loadCart() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.CART);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load cart from localStorage:', e);
    }
    // Default initial cart with 1 sample item (Glow Hydration Cream) to immediately show conversion
    return {
      items: [
        {
          productId: "prod-1",
          quantity: 1,
          price: 48,
          name: "Glow Hydration Cream",
          image: "assets/images/oddaworld_moisturizer_1788781145087.jpg",
          volume: "50ml / 1.7 fl oz"
        }
      ],
      appliedPromo: null
    };
  }

  saveCart() {
    try {
      localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(this.cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage:', e);
    }
  }

  addToCart(productId, quantity = 1) {
    const product = ODDA_DATA.products.find(p => p.id === productId);
    if (!product) return;

    const existing = this.cart.items.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.items.push({
        productId: product.id,
        quantity: quantity,
        price: product.price,
        name: product.name,
        image: product.image,
        volume: product.volume
      });
    }

    this.saveCart();
    this.notify('cart:updated', this.cart);
    this.notify('toast', {
      type: 'success',
      title: 'Ajouté au Panier',
      message: `${quantity}x ${product.name} a été ajouté à votre rituel.`
    });
  }

  updateQuantity(productId, newQty) {
    if (newQty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const item = this.cart.items.find(i => i.productId === productId);
    if (item) {
      item.quantity = newQty;
      this.saveCart();
      this.notify('cart:updated', this.cart);
    }
  }

  removeFromCart(productId) {
    const item = this.cart.items.find(i => i.productId === productId);
    this.cart.items = this.cart.items.filter(i => i.productId !== productId);
    this.saveCart();
    this.notify('cart:updated', this.cart);
    if (item) {
      this.notify('toast', {
        type: 'info',
        title: 'Article retiré',
        message: `${item.name} a été retiré de votre panier.`
      });
    }
  }

  clearCart() {
    this.cart.items = [];
    this.cart.appliedPromo = null;
    this.saveCart();
    this.notify('cart:updated', this.cart);
  }

  applyPromoCode(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Veuillez saisir un code promo valide.' };
    }

    const promo = ODDA_DATA.promoCodes[cleanCode];
    if (!promo) {
      return { success: false, message: 'Code promotionnel invalide ou expiré.' };
    }

    this.cart.appliedPromo = {
      code: cleanCode,
      ...promo
    };

    this.saveCart();
    this.notify('cart:updated', this.cart);
    return {
      success: true,
      message: `Code ${cleanCode} appliqué avec succès ! (${promo.desc})`
    };
  }

  removePromoCode() {
    this.cart.appliedPromo = null;
    this.saveCart();
    this.notify('cart:updated', this.cart);
  }

  getCartCount() {
    return this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartSubtotal() {
    return this.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getCartDiscount() {
    const subtotal = this.getCartSubtotal();
    if (!this.cart.appliedPromo) return 0;

    if (this.cart.appliedPromo.discountPercent) {
      return (subtotal * this.cart.appliedPromo.discountPercent) / 100;
    }
    return 0;
  }

  getCartShipping() {
    const subtotal = this.getCartSubtotal();
    if (this.cart.items.length === 0) return 0;
    if (this.cart.appliedPromo && this.cart.appliedPromo.freeShipping) return 0;
    if (subtotal >= ODDA_DATA.brand.freeShippingThreshold) return 0;
    return 4.90;
  }

  getCartTotal() {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0) return 0;
    const discount = this.getCartDiscount();
    const shipping = this.getCartShipping();
    return Math.max(0, subtotal - discount + shipping);
  }

  getFreeShippingRemaining() {
    const subtotal = this.getCartSubtotal();
    const remaining = ODDA_DATA.brand.freeShippingThreshold - subtotal;
    return remaining > 0 ? remaining : 0;
  }

  // --- WISHLIST MANAGEMENT ---
  loadWishlist() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.WISHLIST);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ["prod-2", "prod-4"]; // default wishlist favorites
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.STORAGE_KEYS.WISHLIST, JSON.stringify(this.wishlist));
    } catch (e) {}
  }

  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    const product = ODDA_DATA.products.find(p => p.id === productId);
    let added = false;

    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(productId);
      added = true;
    }

    this.saveWishlist();
    this.notify('wishlist:updated', this.wishlist);

    if (product) {
      this.notify('toast', {
        type: added ? 'success' : 'info',
        title: added ? 'Favoris' : 'Retiré des Favoris',
        message: added ? `${product.name} a été ajouté à votre liste d'envies.` : `${product.name} a été retiré de votre liste.`
      });
    }

    return added;
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  // --- COMPARE MANAGEMENT (Max 3) ---
  loadCompare() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.COMPARE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  }

  saveCompare() {
    try {
      localStorage.setItem(this.STORAGE_KEYS.COMPARE, JSON.stringify(this.compare));
    } catch (e) {}
  }

  toggleCompare(productId) {
    const index = this.compare.indexOf(productId);
    const product = ODDA_DATA.products.find(p => p.id === productId);

    if (index > -1) {
      this.compare.splice(index, 1);
      this.saveCompare();
      this.notify('compare:updated', this.compare);
      this.notify('toast', {
        type: 'info',
        title: 'Comparateur',
        message: `${product?.name} retiré du comparateur.`
      });
      return false;
    } else {
      if (this.compare.length >= 3) {
        this.notify('toast', {
          type: 'warning',
          title: 'Limite atteinte',
          message: 'Vous pouvez comparer au maximum 3 soins simultanément.'
        });
        return false;
      }
      this.compare.push(productId);
      this.saveCompare();
      this.notify('compare:updated', this.compare);
      this.notify('toast', {
        type: 'success',
        title: 'Comparateur',
        message: `${product?.name} ajouté au comparateur.`
      });
      return true;
    }
  }

  isInCompare(productId) {
    return this.compare.includes(productId);
  }

  clearCompare() {
    this.compare = [];
    this.saveCompare();
    this.notify('compare:updated', this.compare);
  }

  // --- USER & ORDERS ---
  loadUser() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      isLoggedIn: true,
      firstName: "Éléonore",
      lastName: "Laurent",
      email: "eleonore.laurent@paris.fr",
      phone: "+33 6 42 18 90 23",
      address: "14 Rue de la Paix (ou lien Google Maps)",
      country: "France",
      glowPoints: 480,
      tier: "Membre Éclat Or (15% cumulés)"
    };
  }

  saveUser() {
    try {
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(this.user));
    } catch (e) {}
  }

  loadOrders() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: "ODDA-78921",
        date: "28 Août 2026",
        total: 82.00,
        status: "Livrée",
        statusCode: "delivered",
        items: [
          { name: "Radiant Glow Serum", qty: 1, price: 54 },
          { name: "Gentle Micro-Exfoliating Powder", qty: 1, price: 36 }
        ]
      },
      {
        id: "ODDA-84109",
        date: "12 Juillet 2026",
        total: 48.00,
        status: "Livrée",
        statusCode: "delivered",
        items: [
          { name: "Glow Hydration Cream", qty: 1, price: 48 }
        ]
      }
    ];
  }

  saveOrders() {
    try {
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
    } catch (e) {}
  }

  addOrder(orderData) {
    const newOrder = {
      id: `ODDA-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      ...orderData,
      status: "En préparation",
      statusCode: "processing"
    };

    this.orders.unshift(newOrder);
    this.saveOrders();

    // Reward points for order
    const pointsEarned = Math.round(orderData.total * ODDA_DATA.brand.loyaltyRate);
    this.user.glowPoints = (this.user.glowPoints || 0) + pointsEarned;
    this.saveUser();

    this.clearCart();
    this.notify('order:created', newOrder);
    this.notify('user:updated', this.user);

    return newOrder;
  }
}

// Global store instance
const store = new Store();
window.store = store;
