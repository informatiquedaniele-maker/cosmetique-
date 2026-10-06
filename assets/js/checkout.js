// ==========================================================================
// ODDAWORLD - Checkout Flow & Simulated Payment Engine
// ==========================================================================

class CheckoutManager {
  constructor() {
    this.currentStep = 1;
    this.selectedShipping = {
      id: 'colissimo',
      name: 'Colissimo Domicile (48-72h)',
      price: 0 // Will depend on cart threshold
    };
    this.paymentMethod = 'card';
  }

  get modal() {
    return document.getElementById('checkout-modal');
  }

  open() {
    const modal = this.modal;
    if (!modal) return;

    if (!store || !store.cart || store.cart.items.length === 0) {
      if (store && store.notify) {
        store.notify('toast', {
          type: 'warning',
          title: 'Panier vide',
          message: 'Votre panier est vide. Découvrez notre catalogue pour débuter votre rituel.'
        });
      }
      return;
    }

    this.currentStep = 1;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.render();
  }

  close() {
    const modal = this.modal;
    if (modal) {
      modal.classList.remove('open');
    }
    document.body.style.overflow = '';
  }

  setStep(step) {
    this.currentStep = step;
    this.render();
  }

  selectPaymentMethod(method) {
    this.paymentMethod = method;
    this.render();
  }

  formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '').substring(0, 16);
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formatted;

    const preview = document.getElementById('card-preview-number');
    if (preview) {
      preview.textContent = formatted || '•••• •••• •••• ••••';
    }
  }

  formatCardExpiry(input) {
    let value = input.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    input.value = value;

    const preview = document.getElementById('card-preview-expiry');
    if (preview) {
      preview.textContent = value || 'MM/AA';
    }
  }

  updateCardHolder(input) {
    const preview = document.getElementById('card-preview-holder');
    if (preview) {
      preview.textContent = input.value.toUpperCase() || 'VOTRE NOM';
    }
  }

  render() {
    const mainEl = document.getElementById('checkout-main-content');
    const sidebarEl = document.getElementById('checkout-sidebar-content');
    if (!mainEl || !sidebarEl) return;

    const subtotal = store.getCartSubtotal();
    const discount = store.getCartDiscount();
    const shipping = store.getCartShipping();
    const total = store.getCartTotal();

    // Render Order Summary in Sidebar
    sidebarEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h4 style="font-size: 1.15rem; font-weight: 600;">Votre Panier (${store.getCartCount()})</h4>
        <span class="badge-pill badge-sage">Sécurisé SSL 256-bit</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; max-height: 240px; overflow-y: auto;">
        ${store.cart.items.map(item => `
          <div style="display: flex; gap: 12px; align-items: center;">
            <img src="${item.image}" style="width: 52px; height: 52px; border-radius: 6px; object-fit: cover; background: #EEE;">
            <div style="flex: 1;">
              <div style="font-size: 0.88rem; font-weight: 600; line-height: 1.2;">${item.name}</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">${item.volume} · Qté : ${item.quantity}</div>
            </div>
            <div style="font-weight: 700; font-size: 0.9rem;">${item.price * item.quantity} €</div>
          </div>
        `).join('')}
      </div>

      <div style="border-top: 1px solid #E2E8DE; padding-top: 16px; display: flex; flex-direction: column; gap: 8px;">
        <div class="flex-between" style="font-size: 0.88rem; color: var(--text-secondary);">
          <span>Sous-total</span>
          <span>${subtotal.toFixed(2)} €</span>
        </div>
        ${discount > 0 ? `
          <div class="flex-between" style="font-size: 0.88rem; color: #2E7D32; font-weight: 600;">
            <span>Remise (${store.cart.appliedPromo?.code})</span>
            <span>-${discount.toFixed(2)} €</span>
          </div>
        ` : ''}
        <div class="flex-between" style="font-size: 0.88rem; color: var(--text-secondary);">
          <span>Livraison</span>
          <span>${shipping === 0 ? '<strong style="color:#2E7D32;">Offerte</strong>' : `${shipping.toFixed(2)} €`}</span>
        </div>
        <div class="flex-between" style="border-top: 1px dashed #CAD5C6; padding-top: 12px; margin-top: 6px; font-size: 1.25rem; font-weight: 700; color: var(--primary-dark);">
          <span>Total</span>
          <span>${total.toFixed(2)} €</span>
        </div>
      </div>

      <div style="margin-top: 24px; padding: 14px; background: #FFF; border-radius: var(--radius-sm); border: 1px solid #E1E9DD; font-size: 0.78rem; color: var(--text-secondary); display: flex; gap: 10px; align-items: center;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #2E7D32; flex-shrink: 0;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <div>
          <strong>Garantie Éclat 30 Jours</strong> : Retours 100% gratuits & remboursement sous 48h en cas d'insatisfaction.
        </div>
      </div>
    `;

    // Render Steps in Main Content
    if (this.currentStep === 1) {
      mainEl.innerHTML = `
        <div class="flex-between" style="margin-bottom: 24px;">
          <div>
            <span class="badge-pill badge-sage">Étape 1 sur 3</span>
            <h3 style="font-size: 1.6rem; margin-top: 6px;">Coordonnées & Livraison</h3>
          </div>
          <button class="modal-close-btn" onclick="checkoutManager.close()">✕</button>
        </div>

        <form id="checkout-form-step1" onsubmit="event.preventDefault(); checkoutManager.validateStep1();">
          <div class="form-group">
            <label>Adresse e-mail (pour confirmation et suivi)</label>
            <input type="email" class="form-control" id="checkout-email" value="${store.user.email}" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Prénom</label>
              <input type="text" class="form-control" id="checkout-fname" value="${store.user.firstName}" required>
            </div>
            <div class="form-group">
              <label>Nom</label>
              <input type="text" class="form-control" id="checkout-lname" value="${store.user.lastName}" required>
            </div>
          </div>

          <div class="form-group">
            <div class="flex-between" style="margin-bottom: 6px;">
              <label style="margin-bottom: 0;">Adresse ou Lien de position Google Maps 📍</label>
              <button type="button" id="btn-gps-location" class="filter-pill" style="padding: 3px 10px; font-size: 0.72rem; color: var(--primary-forest);" onclick="checkoutManager.useCurrentLocation()">
                📍 Utiliser ma position GPS
              </button>
            </div>
            <input type="text" class="form-control" id="checkout-address" 
                   placeholder="Collez votre lien Google Maps (ex: https://maps.app.goo.gl/...) ou votre adresse" 
                   value="${store.user.address || ''}" required>
            <small style="display: block; margin-top: 5px; color: var(--text-muted); font-size: 0.76rem;">
              💡 Vous pouvez coller directement un lien de partage Google Maps pour un repérage GPS ultra-précis par le livreur.
            </small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Pays</label>
              <select class="form-control" id="checkout-country">
                <optgroup label="★ Recommandés">
                  <option value="France" selected>🇫🇷 France</option>
                  <option value="Belgique">🇧🇪 Belgique</option>
                  <option value="Suisse">🇨🇭 Suisse</option>
                  <option value="Luxembourg">🇱🇺 Luxembourg</option>
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="Maroc">🇲🇦 Maroc</option>
                  <option value="Tunisie">🇹🇳 Tunisie</option>
                  <option value="Algérie">🇩🇿 Algérie</option>
                  <option value="Sénégal">🇸🇳 Sénégal</option>
                  <option value="Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
                </optgroup>
                <optgroup label="Europe">
                  <option value="Allemagne">🇩🇪 Allemagne</option>
                  <option value="Autriche">🇦🇹 Autriche</option>
                  <option value="Espagne">🇪🇸 Espagne</option>
                  <option value="Italie">🇮🇹 Italie</option>
                  <option value="Pays-Bas">🇳🇱 Pays-Bas</option>
                  <option value="Portugal">🇵🇹 Portugal</option>
                  <option value="Royaume-Uni">🇬🇧 Royaume-Uni</option>
                  <option value="Irlande">🇮🇪 Irlande</option>
                  <option value="Danemark">🇩🇰 Danemark</option>
                  <option value="Suède">🇸🇪 Suède</option>
                  <option value="Norvège">🇳🇴 Norvège</option>
                  <option value="Finlande">🇫🇮 Finlande</option>
                  <option value="Pologne">🇵🇱 Pologne</option>
                  <option value="Hongrie">🇭🇺 Hongrie</option>
                  <option value="Tchéquie">🇨🇿 Tchéquie</option>
                  <option value="Roumanie">🇷🇴 Roumanie</option>
                  <option value="Grèce">🇬🇷 Grèce</option>
                  <option value="Croatie">🇭🇷 Croatie</option>
                  <option value="Slovaquie">🇸🇰 Slovaquie</option>
                  <option value="Slovénie">🇸🇮 Slovénie</option>
                  <option value="Bulgarie">🇧🇬 Bulgarie</option>
                  <option value="Serbie">🇷🇸 Serbie</option>
                  <option value="Ukraine">🇺🇦 Ukraine</option>
                  <option value="Russie">🇷🇺 Russie</option>
                </optgroup>
                <optgroup label="Amériques">
                  <option value="États-Unis">🇺🇸 États-Unis</option>
                  <option value="Mexique">🇲🇽 Mexique</option>
                  <option value="Brésil">🇧🇷 Brésil</option>
                  <option value="Argentine">🇦🇷 Argentine</option>
                  <option value="Colombie">🇨🇴 Colombie</option>
                  <option value="Chili">🇨🇱 Chili</option>
                  <option value="Pérou">🇵🇪 Pérou</option>
                  <option value="Venezuela">🇻🇪 Venezuela</option>
                  <option value="Bolivie">🇧🇴 Bolivie</option>
                  <option value="Uruguay">🇺🇾 Uruguay</option>
                  <option value="Paraguay">🇵🇾 Paraguay</option>
                  <option value="Equateur">🇪🇨 Equateur</option>
                  <option value="Guyana">🇬🇾 Guyana</option>
                  <option value="Suriname">🇸🇷 Suriname</option>
                </optgroup>
                <optgroup label="Afrique">
                  <option value="Cameroun">🇨🇲 Cameroun</option>
                  <option value="Mali">🇲🇱 Mali</option>
                  <option value="Burkina Faso">🇧🇫 Burkina Faso</option>
                  <option value="Guinée">🇬🇳 Guinée</option>
                  <option value="Niger">🇳🇪 Niger</option>
                  <option value="Togo">🇹🇬 Togo</option>
                  <option value="Bénin">🇧🇯 Bénin</option>
                  <option value="Congo">🇨🇬 Congo</option>
                  <option value="RDC">🇨🇩 Rép. Dém. du Congo</option>
                  <option value="Gabon">🇬🇦 Gabon</option>
                  <option value="Madagascar">🇲🇬 Madagascar</option>
                  <option value="Réunion">🇷🇪 Réunion (France)</option>
                  <option value="Martinique">🇲🇶 Martinique (France)</option>
                  <option value="Guadeloupe">🇬🇵 Guadeloupe (France)</option>
                  <option value="Guyane">🇬🇫 Guyane (France)</option>
                  <option value="Maurice">🇲🇺 Maurice</option>
                  <option value="Djibouti">🇩🇯 Djibouti</option>
                  <option value="Éthiopie">🇪🇹 Éthiopie</option>
                  <option value="Kenya">🇰🇪 Kenya</option>
                  <option value="Nigeria">🇳🇬 Nigeria</option>
                  <option value="Ghana">🇬🇭 Ghana</option>
                  <option value="Tanzanie">🇹🇿 Tanzanie</option>
                  <option value="Rwanda">🇷🇼 Rwanda</option>
                  <option value="Ouganda">🇺🇬 Ouganda</option>
                  <option value="Zambie">🇿🇲 Zambie</option>
                  <option value="Zimbabwe">🇿🇼 Zimbabwe</option>
                  <option value="Afrique du Sud">🇿🇦 Afrique du Sud</option>
                  <option value="Namibie">🇳🇦 Namibie</option>
                  <option value="Angola">🇦🇴 Angola</option>
                  <option value="Mozambique">🇲🇿 Mozambique</option>
                </optgroup>
                <optgroup label="Asie &amp; Océanie">
                  <option value="Japon">🇯🇵 Japon</option>
                  <option value="Chine">🇨🇳 Chine</option>
                  <option value="Corée du Sud">🇰🇷 Corée du Sud</option>
                  <option value="Inde">🇮🇳 Inde</option>
                  <option value="Indonésie">🇮🇩 Indonésie</option>
                  <option value="Malaisie">🇲🇾 Malaisie</option>
                  <option value="Singapour">🇸🇬 Singapour</option>
                  <option value="Thaïlande">🇹🇭 Thaïlande</option>
                  <option value="Vietnam">🇻🇳 Vietnam</option>
                  <option value="Philippines">🇵🇭 Philippines</option>
                  <option value="Pakistan">🇵🇰 Pakistan</option>
                  <option value="Bangladesh">🇧🇩 Bangladesh</option>
                  <option value="Sri Lanka">🇱🇰 Sri Lanka</option>
                  <option value="Australie">🇦🇺 Australie</option>
                  <option value="Nouvelle-Zélande">🇳🇿 Nouvelle-Zélande</option>
                </optgroup>
                <optgroup label="Moyen-Orient">
                  <option value="Liban">🇱🇧 Liban</option>
                  <option value="Émirats arabes unis">🇦🇪 Émirats arabes unis</option>
                  <option value="Qatar">🇶🇦 Qatar</option>
                  <option value="Arabie saoudite">🇸🇦 Arabie saoudite</option>
                  <option value="Turquie">🇹🇷 Turquie</option>
                  <option value="Israël">🇮🇱 Israël</option>
                  <option value="Jordanie">🇯🇴 Jordanie</option>
                  <option value="Koweit">🇰🇼 Koweit</option>
                  <option value="Bahreïn">🇧🇭 Bahreïn</option>
                  <option value="Oman">🇴🇲 Oman</option>
                  <option value="Irak">🇮🇶 Irak</option>
                </optgroup>
              </select>
            </div>
            <div class="form-group">
              <label>Téléphone portable</label>
              <input type="tel" class="form-control" id="checkout-phone" value="${store.user.phone}" required>
            </div>
          </div>

          <div style="padding-top: 20px; border-top: 1px solid #ECEEE8; display: flex; justify-content: flex-end;">
            <button type="submit" class="btn-primary" style="padding: 12px 28px;">
              Continuer vers la livraison →
            </button>
          </div>
        </form>
      `;
    } else if (this.currentStep === 2) {
      mainEl.innerHTML = `
        <div class="flex-between" style="margin-bottom: 24px;">
          <div>
            <span class="badge-pill badge-sage">Étape 2 sur 3</span>
            <h3 style="font-size: 1.6rem; margin-top: 6px;">Mode d'Expédition</h3>
          </div>
          <button class="modal-close-btn" onclick="checkoutManager.close()">✕</button>
        </div>

        <div style="margin-bottom: 30px;">
          <!-- Single Delivery Method: Home Delivery Only -->
          <div style="border: 1.5px solid var(--primary-forest); border-radius: var(--radius-md); padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; background: #F8FAF6; gap: 16px;">
            <div style="display: flex; gap: 16px; align-items: center; flex: 1;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: #EEF4EB; display: flex; align-items: center; justify-content: center; color: var(--primary-forest); flex-shrink: 0;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <div>
                <div style="font-weight: 700; font-size: 1rem; color: var(--primary-dark); margin-bottom: 2px;">Livraison à Domicile</div>
                <div style="font-size: 0.84rem; color: var(--primary-forest); font-weight: 600; margin-bottom: 4px;">Colissimo Suivi &mdash; 48 à 72h</div>
                <div style="font-size: 0.78rem; color: var(--text-secondary);">Livraison neutre en carbone &middot; Signature disponible &middot; Suivi SMS en temps réel</div>
              </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
              <div style="font-weight: 800; font-size: 1.1rem; color: #2E7D32;">${shipping === 0 ? 'Offerte ✓' : shipping.toFixed(2) + ' €'}</div>
              ${shipping === 0 ? '<div style="font-size: 0.72rem; color: #2E7D32; margin-top: 2px;">Dès 50€ d&apos;achat</div>' : ''}
            </div>
          </div>

          <!-- Info Banner -->
          <div style="margin-top: 14px; padding: 12px 16px; background: rgba(40,57,40,0.06); border-radius: var(--radius-sm); border: 1px solid rgba(40,57,40,0.1); display: flex; align-items: center; gap: 12px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary-forest); flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">
              Un email de suivi vous sera envoyé dès l'expédition. Suivez votre colis en temps réel directement depuis votre espace client.
            </div>
          </div>
        </div>

        <div class="flex-between" style="padding-top: 20px; border-top: 1px solid #ECEEE8;">
          <button class="filter-pill" onclick="checkoutManager.setStep(1)">
            ← Retour aux coordonnées
          </button>
          <button class="btn-primary" onclick="checkoutManager.setStep(3)">
            Accéder au paiement sécurisé →
          </button>
        </div>
      `;
    } else if (this.currentStep === 3) {
      mainEl.innerHTML = `
        <div class="flex-between" style="margin-bottom: 20px;">
          <div>
            <span class="badge-pill badge-sage">Étape 3 sur 3</span>
            <h3 style="font-size: 1.6rem; margin-top: 4px;">Paiement Sécurisé</h3>
          </div>
          <button class="modal-close-btn" onclick="checkoutManager.close()">✕</button>
        </div>

        <!-- Payment Tabs -->
        <div style="display: flex; gap: 8px; margin-bottom: 24px;">
          <button class="filter-pill ${this.paymentMethod === 'card' ? 'active' : ''}" onclick="checkoutManager.selectPaymentMethod('card')">
            💳 Carte Bancaire
          </button>
          <button class="filter-pill ${this.paymentMethod === 'apple' ? 'active' : ''}" onclick="checkoutManager.selectPaymentMethod('apple')">
            🍏 Apple Pay
          </button>
          <button class="filter-pill ${this.paymentMethod === 'google' ? 'active' : ''}" onclick="checkoutManager.selectPaymentMethod('google')">
            🟢 Google Pay
          </button>
        </div>

        ${this.paymentMethod === 'card' ? `
          <!-- Card Visualizer -->
          <div class="card-visualizer">
            <div class="flex-between" style="margin-bottom: 15px;">
              <div class="card-chip"></div>
              <span style="font-family: var(--font-sans); font-weight: 700; letter-spacing: 2px;">ODDAWORLD</span>
            </div>
            <div class="card-num-preview" id="card-preview-number">•••• •••• •••• ••••</div>
            <div class="card-meta-row">
              <div>
                <span style="opacity: 0.7; font-size: 0.68rem; display: block;">Titulaire</span>
                <span id="card-preview-holder" style="font-weight: 600;">ÉLÉONORE LAURENT</span>
              </div>
              <div>
                <span style="opacity: 0.7; font-size: 0.68rem; display: block;">Expire</span>
                <span id="card-preview-expiry" style="font-weight: 600;">12/28</span>
              </div>
            </div>
          </div>

          <form onsubmit="event.preventDefault(); checkoutManager.processPayment();">
            <div class="form-group">
              <label>Numéro de Carte</label>
              <input type="text" class="form-control" placeholder="4532 8900 1234 5678" 
                     value="4532 8921 4450 7820" maxlength="19"
                     oninput="checkoutManager.formatCardNumber(this)" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Date d'expiration</label>
                <input type="text" class="form-control" placeholder="MM/AA" 
                       value="12/28" maxlength="5"
                       oninput="checkoutManager.formatCardExpiry(this)" required>
              </div>
              <div class="form-group">
                <label>Code CVC / CVV</label>
                <input type="password" class="form-control" placeholder="•••" 
                       value="892" maxlength="4" required>
              </div>
            </div>

            <div class="form-group">
              <label>Nom sur la carte</label>
              <input type="text" class="form-control" value="Éléonore Laurent" 
                     oninput="checkoutManager.updateCardHolder(this)" required>
            </div>

            <div class="flex-between" style="padding-top: 20px; border-top: 1px solid #ECEEE8;">
              <button type="button" class="filter-pill" onclick="checkoutManager.setStep(2)">
                ← Précédent
              </button>
              <button type="submit" class="btn-primary" id="btn-pay-submit" style="padding: 14px 34px;">
                Payer ${total.toFixed(2)} € 🔒
              </button>
            </div>
          </form>
        ` : `
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 3rem; margin-bottom: 12px;">${this.paymentMethod === 'apple' ? '🍏' : this.paymentMethod === 'google' ? '🟢' : '🅿️'}</div>
            <h4>Paiement en 1 Clic Express</h4>
            <p style="color: var(--text-secondary); margin: 8px 0 24px;">Authentification biométrique sécurisée via ${this.paymentMethod === 'apple' ? 'Apple Pay (Touch/Face ID)' : this.paymentMethod === 'google' ? 'Google Pay' : 'votre compte PayPal'}.</p>
            <button class="btn-primary" id="btn-pay-express" onclick="checkoutManager.processPayment()">
              Valider avec ${this.paymentMethod === 'apple' ? 'Apple Pay' : this.paymentMethod === 'google' ? 'Google Pay' : 'PayPal'} (${total.toFixed(2)} €)
            </button>
          </div>
        `}
      `;
    }
  }

  validateStep1() {
    const address = document.getElementById('checkout-address')?.value;
    const email = document.getElementById('checkout-email')?.value;
    const fname = document.getElementById('checkout-fname')?.value;
    const lname = document.getElementById('checkout-lname')?.value;
    const phone = document.getElementById('checkout-phone')?.value;

    if (address) store.user.address = address;
    if (email) store.user.email = email;
    if (fname) store.user.firstName = fname;
    if (lname) store.user.lastName = lname;
    if (phone) store.user.phone = phone;
    store.saveUser();

    this.setStep(2);
  }

  useCurrentLocation() {
    const btn = document.getElementById('btn-gps-location');
    const input = document.getElementById('checkout-address');
    if (!navigator.geolocation) {
      store.notify('toast', {
        type: 'warning',
        title: 'Géolocalisation',
        message: "La géolocalisation n'est pas prise en charge par votre navigateur."
      });
      return;
    }

    if (btn) {
      btn.innerHTML = 'Recherche GPS en cours... 📡';
      btn.style.opacity = '0.7';
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        if (input) input.value = mapUrl;
        store.user.address = mapUrl;
        store.saveUser();

        if (btn) {
          btn.innerHTML = '✓ Position GPS enregistrée !';
          btn.style.background = '#E8F5E9';
          btn.style.color = '#2E7D32';
        }

        store.notify('toast', {
          type: 'success',
          title: 'Position GPS Google Maps',
          message: 'Votre lien de localisation Google Maps a été inséré pour le livreur.'
        });
      },
      (err) => {
        if (btn) {
          btn.innerHTML = '📍 Réessayer la position GPS';
          btn.style.opacity = '1';
        }
        store.notify('toast', {
          type: 'info',
          title: 'Lien Google Maps',
          message: 'Veuillez copier et coller manuellement votre lien Google Maps dans le champ.'
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  processPayment() {
    const btn = document.getElementById('btn-pay-submit') || 
                document.getElementById('btn-pay-express') ||
                document.querySelector('#checkout-main-content .btn-primary');
    if (btn) {
      btn.innerHTML = '<span style="display:inline-block; margin-right:6px;">⏳</span> Traitement bancaire sécurisé...';
      btn.style.opacity = '0.75';
      btn.style.pointerEvents = 'none';
    }

    setTimeout(async () => {
      const orderData = {
        total: store.getCartTotal(),
        subtotal: store.getCartSubtotal(),
        shippingCost: store.getCartShipping(),
        items: store.cart.items.map(i => ({ name: i.name, qty: i.quantity, price: i.price, image: i.image, volume: i.volume })),
        appliedPromo: store.cart.appliedPromo?.code || null,
        paymentMethod: this.paymentMethod,
        firstName: store.user.firstName,
        lastName: store.user.lastName,
        email: store.user.email,
        phone: store.user.phone,
        address: store.user.address,
        country: document.getElementById('checkout-country')?.value || store.user.country || 'France'
      };

      const order = store.addOrder(orderData);

      // Cloud Sync to Supabase
      if (window.supabaseService) {
        try {
          await window.supabaseService.createOrder(order);
        } catch (err) {
          console.warn('Supabase order sync error:', err);
        }
      }

      this.renderOrderSuccess(order);
    }, 1000);
  }

  renderOrderSuccess(order) {
    const mainEl = document.getElementById('checkout-main-content');
    const sidebarEl = document.getElementById('checkout-sidebar-content');
    if (!mainEl || !sidebarEl) return;

    sidebarEl.innerHTML = `
      <div style="text-align: center; padding: 30px 10px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: #E8F5E9; color: #2E7D32; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
          ✓
        </div>
        <h4 style="font-size: 1.25rem;">Commande Confirmée !</h4>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 6px;">Un email récapitulatif a été envoyé à <strong>${store.user.email}</strong>.</p>
        <div style="background: #FFF; border: 1px solid #D5E1D1; border-radius: var(--radius-md); padding: 14px; margin-top: 20px; font-size: 0.82rem; text-align: left;">
          <div><strong>Numéro :</strong> ${order.id}</div>
          <div><strong>Date :</strong> ${order.date}</div>
          <div><strong>Total réglé :</strong> ${order.total.toFixed(2)} €</div>
          <div><strong>Statut :</strong> <span style="color:#2E7D32; font-weight: 600;">En préparation</span></div>
        </div>
      </div>
    `;

    mainEl.innerHTML = `
      <div style="text-align: center; padding: 20px 0;">
        <span class="badge-pill badge-gold" style="margin-bottom: 14px;">Merci pour votre confiance ✨</span>
        <h2 style="font-size: 2.3rem; margin-bottom: 12px;">Bienvenue dans l'univers ODDAWORLD</h2>
        <p style="color: var(--text-secondary); max-width: 520px; margin: 0 auto 24px;">
          Votre rituel botanique est en cours de confection avec nos emballages éco-conçus. Vous venez de cumuler <strong>+${Math.round(order.total * ODDA_DATA.brand.loyaltyRate)} points Glow Club</strong> !
        </p>

        <div style="display: flex; justify-content: center; gap: 14px; margin-top: 30px;">
          <button class="btn-primary" onclick="checkoutManager.close(); app.openAccount('orders');">
            Voir mes commandes 📦
          </button>
          <button class="filter-pill" onclick="checkoutManager.close();">
            Continuer mes découvertes
          </button>
        </div>
      </div>
    `;
  }
}

// Instantiate CheckoutManager
const checkoutManager = new CheckoutManager();
window.checkoutManager = checkoutManager;

// Helper to open checkout from anywhere (e.g., cart drawer)
window.openCheckout = () => {
  if (typeof app !== 'undefined' && app.closeCart) {
    app.closeCart();
  }
  checkoutManager.open();
};

// Allow clicking on checkout modal background to close
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        checkoutManager.close();
      }
    });
  }
});


