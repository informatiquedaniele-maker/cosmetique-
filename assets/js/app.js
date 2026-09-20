// ==========================================================================
// ODDAWORLD - Main Application Controller
// ==========================================================================

class App {
  constructor() {
    this.activeCategory = 'all';
    this.activeSkinType = 'all';
    this.searchQuery = '';
    this.sortMode = 'popular';
    this.selectedProductForModal = null;

    this.init();
  }

  init() {
    this.renderTrustBadges();
    this.renderCategories();
    this.renderProducts();
    this.renderRoutines();
    this.renderBlog();
    this.renderFAQ();
    this.renderSocialFeed();
    this.setupEventListeners();
    this.setupToastPurchases();
    this.setupWelcomePopup();

    // Subscribe to store updates
    store.subscribe((event, payload) => {
      this.handleStoreEvent(event, payload);
    });

    // Initial cart badge update
    this.updateCartBadge();
    this.updateWishlistBadge();
  }

  // --- RENDER HERO TRUST BADGES (Matching reference photo) ---
  renderTrustBadges() {
    const container = document.getElementById('hero-trust-badges');
    if (!container) return;

    container.innerHTML = ODDA_DATA.trustBadges.map(badge => `
      <div class="trust-item">
        <div class="trust-icon">${badge.icon}</div>
        <div class="trust-text">
          <h5>${badge.label}</h5>
          <p>${badge.sublabel}</p>
        </div>
      </div>
    `).join('');
  }

  // --- RENDER CATEGORIES (Matching 6 cards from reference photo) ---
  renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    container.innerHTML = ODDA_DATA.categories.map(cat => `
      <div class="category-card" onclick="app.filterByCategory('${cat.id}')">
        <div class="category-img-box">
          <img src="${cat.image}" alt="${cat.name}" onerror="this.src='${cat.fallbackImage}'">
        </div>
        <div class="category-info">
          <h3>${cat.name}</h3>
          <span class="category-link-text">Shop Now →</span>
        </div>
      </div>
    `).join('');
  }

  // --- RENDER PRODUCTS IN CATALOG ---
  renderProducts() {
    const container = document.getElementById('products-grid');
    const countEl = document.getElementById('catalog-results-count');
    if (!container) return;

    let filtered = [...ODDA_DATA.products];

    // Filter by Category
    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.activeCategory);
    }

    // Filter by Skin Type
    if (this.activeSkinType !== 'all') {
      filtered = filtered.filter(p => p.skinTypes.includes('all') || p.skinTypes.includes(this.activeSkinType));
    }

    // Filter by Search Query
    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.categoryName.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (this.sortMode === 'popular') {
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (this.sortMode === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortMode === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.sortMode === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (this.sortMode === 'new') {
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    if (countEl) {
      countEl.textContent = `${filtered.length} soin${filtered.length > 1 ? 's' : ''}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <h4 style="font-size: 1.3rem; margin-bottom: 8px;">Aucun soin ne correspond à votre recherche</h4>
          <p style="color: var(--text-muted); margin-bottom: 20px;">Essayez d'élargir vos filtres ou explorez nos bestsellers.</p>
          <button class="btn-primary" onclick="app.resetFilters()">Réinitialiser les filtres</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(prod => {
      const inWishlist = store.isInWishlist(prod.id);
      const inCompare = store.isInCompare(prod.id);

      return `
        <div class="product-card">
          <div class="product-img-box">
            <img src="${prod.image}" alt="${prod.name}">
            
            ${prod.badge ? `<span class="badge-pill badge-forest product-badge-tag">${prod.badge}</span>` : ''}

            <div class="product-actions-floating">
              <button class="floating-action-btn ${inWishlist ? 'active' : ''}" 
                      title="Ajouter aux favoris" onclick="app.toggleWishlist('${prod.id}', event)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </button>
              <button class="floating-action-btn ${inCompare ? 'active' : ''}" 
                      title="Comparer ce soin" onclick="app.toggleCompare('${prod.id}', event)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
              </button>
              <button class="floating-action-btn" title="Aperçu rapide" onclick="app.openProductModal('${prod.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <div class="product-content">
            <div>
              <div class="product-category-sub">${prod.categoryName} · ${prod.volume}</div>
              <h4 class="product-title" style="cursor:pointer;" onclick="app.openProductModal('${prod.id}')">${prod.name}</h4>
              <p class="product-short-desc">${prod.shortDesc}</p>
            </div>

            <div>
              <div class="star-rating" style="margin-bottom: 10px;">
                ★★★★★ <span class="rating-number">${prod.rating}</span> <span class="review-count">(${prod.reviewCount})</span>
              </div>

              <div class="product-footer-row">
                <div class="product-price-box">
                  <span class="price-current">${prod.price} €</span>
                  ${prod.oldPrice ? `<span class="price-old">${prod.oldPrice} €</span>` : ''}
                </div>
                <button class="btn-add-cart" title="Ajouter au rituel" onclick="store.addToCart('${prod.id}', 1)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- RENDER BEAUTY ROUTINES (Morning vs Night) ---
  renderRoutines() {
    const morningContainer = document.getElementById('routine-morning-steps');
    const nightContainer = document.getElementById('routine-night-steps');

    if (morningContainer) {
      morningContainer.innerHTML = ODDA_DATA.routines.morning.steps.map(step => {
        const prod = ODDA_DATA.products.find(p => p.id === step.productId);
        return `
          <div style="background: var(--bg-surface-glass); border-radius: var(--radius-md); padding: 18px; display: flex; gap: 16px; align-items: center; border: 1px solid var(--border-glass);">
            <span style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-forest); color: #FFF; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0;">${step.step}</span>
            <img src="${prod?.image}" style="width: 54px; height: 54px; border-radius: 8px; object-fit: cover;">
            <div style="flex: 1;">
              <h5 style="font-size: 0.95rem; font-weight: 600;">${step.title} : ${prod?.name}</h5>
              <p style="font-size: 0.8rem; color: var(--text-secondary);">${step.action}</p>
            </div>
            <button class="floating-action-btn" onclick="store.addToCart('${prod?.id}', 1)" title="Ajouter au rituel">
              +
            </button>
          </div>
        `;
      }).join('');
    }

    if (nightContainer) {
      nightContainer.innerHTML = ODDA_DATA.routines.night.steps.map(step => {
        const prod = ODDA_DATA.products.find(p => p.id === step.productId);
        return `
          <div style="background: var(--bg-surface-glass); border-radius: var(--radius-md); padding: 18px; display: flex; gap: 16px; align-items: center; border: 1px solid var(--border-glass);">
            <span style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-olive); color: #FFF; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0;">${step.step}</span>
            <img src="${prod?.image}" style="width: 54px; height: 54px; border-radius: 8px; object-fit: cover;">
            <div style="flex: 1;">
              <h5 style="font-size: 0.95rem; font-weight: 600;">${step.title} : ${prod?.name}</h5>
              <p style="font-size: 0.8rem; color: var(--text-secondary);">${step.action}</p>
            </div>
            <button class="floating-action-btn" onclick="store.addToCart('${prod?.id}', 1)" title="Ajouter au rituel">
              +
            </button>
          </div>
        `;
      }).join('');
    }
  }

  // --- RENDER BLOG ARTICLES ---
  renderBlog() {
    const container = document.getElementById('blog-grid');
    if (!container) return;

    container.innerHTML = ODDA_DATA.blogArticles.map(art => `
      <div class="glass-card" style="overflow: hidden; cursor: pointer;" onclick="app.openBlogArticle('${art.id}')">
        <div style="width: 100%; aspect-ratio: 16/10; overflow: hidden; background: #E4ECE0;">
          <img src="${art.image}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease;">
        </div>
        <div style="padding: 24px;">
          <div class="flex-between" style="margin-bottom: 8px;">
            <span class="badge-pill badge-sage">${art.category}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${art.readTime}</span>
          </div>
          <h4 style="font-size: 1.15rem; font-weight: 600; margin-bottom: 10px; line-height: 1.35;">${art.title}</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 14px;">${art.excerpt}</p>
          <span style="font-size: 0.82rem; font-weight: 600; color: var(--primary-forest);">Lire l'article complet →</span>
        </div>
      </div>
    `).join('');
  }

  // --- RENDER FAQ ACCORDIONS ---
  renderFAQ() {
    const container = document.getElementById('faq-container');
    if (!container) return;

    container.innerHTML = ODDA_DATA.faq.map((item, index) => `
      <div class="accordion-item ${index === 0 ? 'open' : ''}">
        <div class="accordion-trigger" onclick="app.toggleAccordion(this)">
          <span>${item.question}</span>
          <span style="font-size: 1.2rem; transition: transform 0.3s ease;">+</span>
        </div>
        <div class="accordion-body">
          <p>${item.answer}</p>
        </div>
      </div>
    `).join('');
  }

  toggleAccordion(triggerEl) {
    const item = triggerEl.closest('.accordion-item');
    const wasOpen = item.classList.contains('open');

    // Close all siblings
    document.querySelectorAll('#faq-container .accordion-item').forEach(i => i.classList.remove('open'));

    if (!wasOpen) {
      item.classList.add('open');
    }
  }

  // --- RENDER SOCIAL UGC FEED ---
  renderSocialFeed() {
    const container = document.getElementById('ugc-grid');
    if (!container) return;

    container.innerHTML = ODDA_DATA.socialFeed.map(item => `
      <div class="ugc-card">
        <img src="${item.image}" alt="${item.user}">
        <div class="ugc-overlay">
          <span class="ugc-handle">${item.user}</span>
          <p class="ugc-caption">${item.caption}</p>
        </div>
      </div>
    `).join('');
  }

  // --- FILTERING & CATALOG INTERACTIONS ---
  filterByCategory(catId) {
    this.activeCategory = catId;
    
    // Update active state on nav/pill if available
    document.querySelectorAll('.filter-category-select option').forEach(opt => {
      if (opt.value === catId) opt.selected = true;
    });

    this.renderProducts();
    this.scrollToSection('shop');
  }

  filterBySkinType(type, buttonEl) {
    this.activeSkinType = type;
    document.querySelectorAll('.filter-pills-row .filter-pill').forEach(btn => btn.classList.remove('active'));
    buttonEl?.classList.add('active');
    this.renderProducts();
  }

  handleSearchInput(input) {
    this.searchQuery = input.value;
    this.renderProducts();
  }

  handleSortChange(select) {
    this.sortMode = select.value;
    this.renderProducts();
  }

  resetFilters() {
    this.activeCategory = 'all';
    this.activeSkinType = 'all';
    this.searchQuery = '';
    const searchInput = document.getElementById('catalog-search-input');
    if (searchInput) searchInput.value = '';

    document.querySelectorAll('.filter-pills-row .filter-pill').forEach((btn, idx) => {
      if (idx === 0) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    this.renderProducts();
  }

  // --- PRODUCT DETAIL MODAL ---
  openProductModal(productId) {
    const product = ODDA_DATA.products.find(p => p.id === productId);
    if (!product) return;

    this.selectedProductForModal = product;
    const modalEl = document.getElementById('product-modal');
    const contentEl = document.getElementById('product-modal-content');
    if (!modalEl || !contentEl) return;

    const complementary = ODDA_DATA.products.find(p => p.id === product.complementaryId);

    contentEl.innerHTML = `
      <div class="product-detail-grid">
        <div class="detail-gallery-main">
          <img src="${product.image}" alt="${product.name}" id="detail-main-img">
        </div>

        <div class="detail-info-col">
          <div class="flex-between" style="margin-bottom: 8px;">
            <span class="badge-pill badge-sage">${product.categoryName}</span>
            <span style="font-size: 0.85rem; color: var(--text-muted);">${product.volume}</span>
          </div>

          <h2 style="font-size: 2.2rem; margin-bottom: 8px;">${product.name}</h2>
          
          <div class="star-rating" style="margin-bottom: 16px;">
            ★★★★★ <span class="rating-number">${product.rating}</span> 
            <span class="review-count">(${product.reviewCount} avis vérifiés)</span>
          </div>

          <div style="font-size: 1.65rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 16px;">
            ${product.price} € ${product.oldPrice ? `<span style="font-size: 1.1rem; text-decoration: line-through; color: var(--text-muted); font-weight: 400; margin-left: 8px;">${product.oldPrice} €</span>` : ''}
          </div>

          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">
            ${product.description}
          </p>

          <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 28px;">
            <button class="btn-primary" style="flex: 1; justify-content: center; padding: 15px;" onclick="store.addToCart('${product.id}', 1); app.closeProductModal(); app.openCart();">
              Ajouter au panier (${product.price} €) 🛍️
            </button>
            <button class="floating-action-btn ${store.isInWishlist(product.id) ? 'active' : ''}" 
                    onclick="app.toggleWishlist('${product.id}', event)" style="width: 48px; height: 48px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="${store.isInWishlist(product.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
          </div>

          <!-- Key Ingredients Accordions -->
          <div class="detail-accordions">
            <div class="accordion-item open">
              <div class="accordion-trigger" onclick="this.parentElement.classList.toggle('open')">
                <span>Ingrédients Clés & Bienfaits</span>
                <span>▾</span>
              </div>
              <div class="accordion-body">
                <ul style="display: flex; flex-direction: column; gap: 10px;">
                  ${product.keyIngredients.map(ing => `
                    <li><strong>${ing.name} :</strong> ${ing.role}</li>
                  `).join('')}
                </ul>
              </div>
            </div>

            <div class="accordion-item">
              <div class="accordion-trigger" onclick="this.parentElement.classList.toggle('open')">
                <span>Conseils d'Application</span>
                <span>▾</span>
              </div>
              <div class="accordion-body">
                <p>${product.howToUse}</p>
                <div style="margin-top: 8px; font-size: 0.8rem; color: var(--primary-forest); font-weight: 600;">
                  Position dans votre rituel : ${product.routineStep}
                </div>
              </div>
            </div>

            ${complementary ? `
              <div class="accordion-item">
                <div class="accordion-trigger" onclick="this.parentElement.classList.toggle('open')">
                  <span>Complétez votre Routine (-10%)</span>
                  <span>▾</span>
                </div>
                <div class="accordion-body">
                  <div style="display: flex; gap: 12px; align-items: center; background: #F6F9F4; padding: 12px; border-radius: 8px;">
                    <img src="${complementary.image}" style="width: 48px; height: 48px; border-radius: 6px; object-fit: cover;">
                    <div style="flex: 1;">
                      <div style="font-weight: 600; font-size: 0.88rem;">${complementary.name}</div>
                      <div style="font-size: 0.8rem; color: var(--primary-forest); font-weight: 700;">${complementary.price} €</div>
                    </div>
                    <button class="btn-primary" style="padding: 6px 14px; font-size: 0.78rem;" onclick="store.addToCart('${complementary.id}', 1)">+ Ajouter</button>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeProductModal() {
    const modalEl = document.getElementById('product-modal');
    if (modalEl) modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- COMPARATOR MODAL ---
  toggleCompare(productId, event) {
    if (event) event.stopPropagation();
    store.toggleCompare(productId);
    this.renderProducts();
  }

  openComparator() {
    const modalEl = document.getElementById('compare-modal');
    const contentEl = document.getElementById('compare-modal-content');
    if (!modalEl || !contentEl) return;

    const prods = store.compare.map(id => ODDA_DATA.products.find(p => p.id === id)).filter(Boolean);

    if (prods.length === 0) {
      contentEl.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <h3>Votre Comparateur est vide</h3>
          <p style="color: var(--text-muted); margin: 12px 0 24px;">Cliquez sur l'icône de comparaison sur n'importe quel soin pour comparer jusqu'à 3 produits côte à côte.</p>
          <button class="btn-primary" onclick="app.closeComparator(); app.scrollToSection('shop');">Découvrir les soins</button>
        </div>
      `;
    } else {
      contentEl.innerHTML = `
        <div style="padding: 30px;">
          <div class="flex-between" style="margin-bottom: 24px;">
            <h3 style="font-size: 1.8rem;">Comparateur de Soins ODDAWORLD</h3>
            <button class="filter-pill" onclick="store.clearCompare(); app.openComparator();">Vider le comparateur</button>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr>
                  <th style="padding: 14px; border-bottom: 2px solid #E4EBE0; width: 22%;">Critère</th>
                  ${prods.map(p => `
                    <th style="padding: 14px; border-bottom: 2px solid #E4EBE0; width: ${78 / prods.length}%;">
                      <img src="${p.image}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; margin-bottom: 8px;">
                      <div style="font-weight: 700; font-size: 1rem;">${p.name}</div>
                      <div style="font-size: 1.15rem; font-weight: 700; color: var(--primary-forest); margin-top: 4px;">${p.price} €</div>
                    </th>
                  `).join('')}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 12px; font-weight: 600; border-bottom: 1px solid #EFF3EC;">Catégorie</td>
                  ${prods.map(p => `<td style="padding: 12px; border-bottom: 1px solid #EFF3EC;">${p.categoryName}</td>`).join('')}
                </tr>
                <tr>
                  <td style="padding: 12px; font-weight: 600; border-bottom: 1px solid #EFF3EC;">Contenance</td>
                  ${prods.map(p => `<td style="padding: 12px; border-bottom: 1px solid #EFF3EC;">${p.volume}</td>`).join('')}
                </tr>
                <tr>
                  <td style="padding: 12px; font-weight: 600; border-bottom: 1px solid #EFF3EC;">Texture</td>
                  ${prods.map(p => `<td style="padding: 12px; border-bottom: 1px solid #EFF3EC;">${p.texture}</td>`).join('')}
                </tr>
                <tr>
                  <td style="padding: 12px; font-weight: 600; border-bottom: 1px solid #EFF3EC;">Moment d'application</td>
                  ${prods.map(p => `<td style="padding: 12px; border-bottom: 1px solid #EFF3EC;">${p.period}</td>`).join('')}
                </tr>
                <tr>
                  <td style="padding: 12px; font-weight: 600; border-bottom: 1px solid #EFF3EC;">Actifs Principaux</td>
                  ${prods.map(p => `<td style="padding: 12px; border-bottom: 1px solid #EFF3EC; font-size: 0.85rem;">${p.keyIngredients.map(i => i.name).join(', ')}</td>`).join('')}
                </tr>
                <tr>
                  <td style="padding: 12px; font-weight: 600; border-bottom: 1px solid #EFF3EC;">Note Clients</td>
                  ${prods.map(p => `<td style="padding: 12px; border-bottom: 1px solid #EFF3EC;">★ ${p.rating} (${p.reviewCount})</td>`).join('')}
                </tr>
                <tr>
                  <td style="padding: 16px 12px;">Action</td>
                  ${prods.map(p => `
                    <td style="padding: 16px 12px;">
                      <button class="btn-primary" style="padding: 8px 18px; font-size: 0.82rem;" onclick="store.addToCart('${p.id}', 1); app.closeComparator(); app.openCart();">
                        + Panier
                      </button>
                    </td>
                  `).join('')}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeComparator() {
    const modalEl = document.getElementById('compare-modal');
    if (modalEl) modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- WISHLIST INTERACTIONS ---
  toggleWishlist(productId, event) {
    if (event) event.stopPropagation();
    store.toggleWishlist(productId);
    this.renderProducts();
  }

  // --- CART DRAWER ---
  openCart() {
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (overlay && drawer) {
      this.renderCartDrawer();
      overlay.classList.add('open');
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCart() {
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (overlay && drawer) {
      overlay.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openCheckout() {
    this.closeCart();
    if (window.openCheckout) {
      window.openCheckout();
    } else if (window.checkoutManager) {
      window.checkoutManager.open();
    }
  }

  renderCartDrawer() {
    const listEl = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount-line');
    const shippingEl = document.getElementById('cart-shipping');
    const totalEl = document.getElementById('cart-total');
    const remainingBarEl = document.getElementById('shipping-progress-fill');
    const remainingTextEl = document.getElementById('free-shipping-text');

    if (!listEl) return;

    // Free shipping progress
    const remaining = store.getFreeShippingRemaining();
    const threshold = ODDA_DATA.brand.freeShippingThreshold;
    const subtotal = store.getCartSubtotal();
    const progressPercent = Math.min(100, (subtotal / threshold) * 100);

    if (remainingBarEl) remainingBarEl.style.width = `${progressPercent}%`;
    if (remainingTextEl) {
      if (remaining === 0 && subtotal > 0) {
        remainingTextEl.innerHTML = `✨ Félicitations ! <strong>La livraison est offerte</strong> pour votre commande.`;
      } else {
        remainingTextEl.innerHTML = `Plus que <strong>${remaining.toFixed(2)} €</strong> pour bénéficier de la <strong>livraison offerte</strong> !`;
      }
    }

    if (store.cart.items.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 50px 20px;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🌿</div>
          <h4 style="font-size: 1.15rem; margin-bottom: 6px;">Votre panier est vide</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">Offrez à votre peau le meilleur de la clean beauty.</p>
          <button class="btn-primary" onclick="app.closeCart(); app.scrollToSection('shop');">Découvrir les Soins</button>
        </div>
      `;
    } else {
      listEl.innerHTML = store.cart.items.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <h5 class="cart-item-title">${item.name}</h5>
            <div class="cart-item-vol">${item.volume} · <strong>${item.price} €</strong></div>
            
            <div class="cart-qty-row">
              <div class="qty-control">
                <button class="qty-btn" onclick="store.updateQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                <span class="qty-number">${item.quantity}</span>
                <button class="qty-btn" onclick="store.updateQuantity('${item.productId}', ${item.quantity + 1})">+</button>
              </div>
              <button style="color: var(--accent-terracotta); font-size: 0.78rem;" onclick="store.removeFromCart('${item.productId}')">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }

    if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} €`;
    
    const discount = store.getCartDiscount();
    if (discountEl) {
      if (discount > 0) {
        discountEl.style.display = 'flex';
        discountEl.innerHTML = `
          <span>Remise (${store.cart.appliedPromo.code})</span>
          <span style="color: #2E7D32; font-weight: 600;">-${discount.toFixed(2)} €</span>
        `;
      } else {
        discountEl.style.display = 'none';
      }
    }

    const shipping = store.getCartShipping();
    if (shippingEl) {
      shippingEl.innerHTML = shipping === 0 ? '<strong style="color: #2E7D32;">Offerte</strong>' : `${shipping.toFixed(2)} €`;
    }

    if (totalEl) totalEl.textContent = `${store.getCartTotal().toFixed(2)} €`;
  }

  applyPromo() {
    const input = document.getElementById('promo-code-input');
    if (!input) return;
    const result = store.applyPromoCode(input.value);
    store.notify('toast', {
      type: result.success ? 'success' : 'warning',
      title: 'Code Promo',
      message: result.message
    });
    input.value = '';
    this.renderCartDrawer();
  }

  // --- CUSTOMER ACCOUNT MODAL ---
  openAccount(tab = 'profile') {
    const modalEl = document.getElementById('account-modal');
    const contentEl = document.getElementById('account-modal-content');
    if (!modalEl || !contentEl) return;

    contentEl.innerHTML = `
      <div style="display: grid; grid-template-columns: 240px 1fr; min-height: 480px;">
        <div style="background: #F8FAF6; border-right: 1px solid #EAEFE6; padding: 30px 20px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--primary-forest); color: #FFF; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-weight: 700;">
              ${store.user.firstName.charAt(0)}${store.user.lastName.charAt(0)}
            </div>
            <h5 style="font-size: 1rem; font-weight: 600;">${store.user.firstName} ${store.user.lastName}</h5>
            <span class="badge-pill badge-gold" style="margin-top: 4px; font-size: 0.7rem;">${store.user.tier}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px;">
            <button class="nav-link ${tab === 'profile' ? 'active' : ''}" style="width: 100%; justify-content: flex-start;" onclick="app.openAccount('profile')">
              👤 Mon Profil
            </button>
            <button class="nav-link ${tab === 'orders' ? 'active' : ''}" style="width: 100%; justify-content: flex-start;" onclick="app.openAccount('orders')">
              📦 Mes Commandes (${store.orders.length})
            </button>
            <button class="nav-link ${tab === 'wishlist' ? 'active' : ''}" style="width: 100%; justify-content: flex-start;" onclick="app.openAccount('wishlist')">
              ❤️ Mes Favoris (${store.wishlist.length})
            </button>
            <button class="nav-link ${tab === 'points' ? 'active' : ''}" style="width: 100%; justify-content: flex-start;" onclick="app.openAccount('points')">
              ✨ Glow Club (${store.user.glowPoints} pts)
            </button>
          </div>
        </div>

        <div style="padding: 34px; overflow-y: auto;">
          ${this.getAccountTabContent(tab)}
        </div>
      </div>
    `;

    modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  getAccountTabContent(tab) {
    if (tab === 'orders') {
      return `
        <h3 style="font-size: 1.6rem; margin-bottom: 20px;">Historique des Commandes</h3>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${store.orders.map(order => `
            <div style="background: #FAFBF9; border: 1px solid #EAEFE7; border-radius: var(--radius-md); padding: 18px 20px;">
              <div class="flex-between" style="margin-bottom: 10px;">
                <div>
                  <strong>Commande ${order.id}</strong>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">Passée le ${order.date}</div>
                </div>
                <span class="badge-pill ${order.statusCode === 'delivered' ? 'badge-sage' : 'badge-gold'}">${order.status}</span>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">
                ${order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
              </div>
              <div class="flex-between" style="border-top: 1px solid #ECEFE8; padding-top: 10px;">
                <span style="font-weight: 700; color: var(--primary-dark);">${order.total.toFixed(2)} €</span>
                <button class="filter-pill" style="font-size: 0.78rem;" onclick="store.notify('toast', {type:'info', title:'Téléchargement', message:'Facture PDF générée avec succès.'})">
                  Télécharger facture 📄
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (tab === 'wishlist') {
      const prods = store.wishlist.map(id => ODDA_DATA.products.find(p => p.id === id)).filter(Boolean);
      return `
        <div class="flex-between" style="margin-bottom: 20px;">
          <h3 style="font-size: 1.6rem;">Mes Soins Favoris</h3>
          ${prods.length > 0 ? `
            <button class="btn-primary" style="padding: 8px 18px; font-size: 0.82rem;" onclick="app.addAllWishlistToCart()">
              Tout ajouter au panier 🛍️
            </button>
          ` : ''}
        </div>
        ${prods.length === 0 ? '<p style="color: var(--text-muted);">Votre liste d\'envies est vide.</p>' : `
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
            ${prods.map(p => `
              <div style="display: flex; gap: 12px; background: #FAFBF9; border: 1px solid #E6ECE1; border-radius: var(--radius-sm); padding: 12px; align-items: center;">
                <img src="${p.image}" style="width: 58px; height: 58px; border-radius: 6px; object-fit: cover;">
                <div style="flex: 1;">
                  <h6 style="font-size: 0.9rem; font-weight: 600;">${p.name}</h6>
                  <div style="font-weight: 700; color: var(--primary-dark); font-size: 0.88rem;">${p.price} €</div>
                </div>
                <button class="btn-add-cart" style="width: 34px; height: 34px;" onclick="store.addToCart('${p.id}', 1)">+</button>
              </div>
            `).join('')}
          </div>
        `}
      `;
    } else if (tab === 'points') {
      return `
        <h3 style="font-size: 1.6rem; margin-bottom: 12px;">Programme Éclat & Fidélité</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Chaque euro dépensé vous rapporte 10 points Glow Club débloquant des soins offerts.</p>
        <div style="background: linear-gradient(135deg, #2B3D2A 0%, #172417 100%); color: #FFF; padding: 24px; border-radius: var(--radius-lg); margin-bottom: 24px;">
          <div style="font-size: 0.82rem; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.8;">Solde Disponible</div>
          <div style="font-size: 2.5rem; font-weight: 700; color: #E7C98C;">${store.user.glowPoints} Points</div>
          <p style="font-size: 0.82rem; opacity: 0.9; margin-top: 6px;">Plus que 120 points pour débloquer le <em>Botanical Purifying Cleanser</em> offert en grand format !</p>
        </div>
      `;
    } else {
      // Profile Tab
      return `
        <h3 style="font-size: 1.6rem; margin-bottom: 20px;">Informations Personnelles</h3>
        <form onsubmit="event.preventDefault(); app.saveUserProfile();">
          <div class="form-row">
            <div class="form-group">
              <label>Prénom</label>
              <input type="text" class="form-control" id="profile-fname" value="${store.user.firstName}" required>
            </div>
            <div class="form-group">
              <label>Nom</label>
              <input type="text" class="form-control" id="profile-lname" value="${store.user.lastName}" required>
            </div>
          </div>
          <div class="form-group">
            <label>Adresse e-mail</label>
            <input type="email" class="form-control" id="profile-email" value="${store.user.email}" required>
          </div>
          <div class="form-group">
            <label>Adresse postale</label>
            <input type="text" class="form-control" id="profile-address" value="${store.user.address}">
          </div>
          <button type="submit" class="btn-primary" style="margin-top: 10px;">Enregistrer les modifications</button>
        </form>
      `;
    }
  }

  saveUserProfile() {
    store.user.firstName = document.getElementById('profile-fname')?.value || store.user.firstName;
    store.user.lastName = document.getElementById('profile-lname')?.value || store.user.lastName;
    store.user.email = document.getElementById('profile-email')?.value || store.user.email;
    store.user.address = document.getElementById('profile-address')?.value || store.user.address;
    store.saveUser();
    store.notify('toast', {
      type: 'success',
      title: 'Profil mis à jour',
      message: 'Vos informations ont été enregistrées avec succès.'
    });
  }

  addAllWishlistToCart() {
    store.wishlist.forEach(id => store.addToCart(id, 1));
    this.closeAccount();
    this.openCart();
  }

  closeAccount() {
    const modalEl = document.getElementById('account-modal');
    if (modalEl) modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- VIDEO ROUTINE MODAL ---
  openVideoModal() {
    const modalEl = document.getElementById('video-modal');
    if (modalEl) {
      modalEl.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeVideoModal() {
    const modalEl = document.getElementById('video-modal');
    if (modalEl) {
      modalEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // --- BLOG ARTICLE MODAL ---
  openBlogArticle(articleId) {
    const article = ODDA_DATA.blogArticles.find(a => a.id === articleId);
    if (!article) return;

    const modalEl = document.getElementById('blog-modal');
    const contentEl = document.getElementById('blog-modal-content');
    if (!modalEl || !contentEl) return;

    contentEl.innerHTML = `
      <div style="padding: 40px; max-width: 740px; margin: 0 auto;">
        <span class="badge-pill badge-sage" style="margin-bottom: 12px;">${article.category} · ${article.readTime}</span>
        <h2 style="font-size: 2.2rem; margin-bottom: 16px; line-height: 1.25;">${article.title}</h2>
        <div style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 24px;">Publié le ${article.date} · Par le Comité Scientifique ODDAWORLD</div>
        <img src="${article.image}" style="width: 100%; border-radius: var(--radius-lg); margin-bottom: 28px; max-height: 380px; object-fit: cover;">
        <div style="font-size: 1rem; color: var(--text-secondary); line-height: 1.8;">
          ${article.content}
        </div>
      </div>
    `;

    modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeBlogModal() {
    const modalEl = document.getElementById('blog-modal');
    if (modalEl) modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- REAL-TIME SALES NOTIFICATIONS (Live Social Proof) ---
  setupToastPurchases() {
    let index = 0;
    setInterval(() => {
      const item = ODDA_DATA.recentPurchases[index % ODDA_DATA.recentPurchases.length];
      index++;

      this.showToastNotification({
        type: 'info',
        title: `${item.name} (${item.city})`,
        message: `Vient de commander le soin ${item.product} · ${item.time}`
      });
    }, 24000); // Trigger every 24s
  }

  setupWelcomePopup() {
    // Show after 10s if not dismissed before
    const hasSeen = sessionStorage.getItem('oddaworld_welcome_popup');
    if (!hasSeen) {
      setTimeout(() => {
        const popup = document.getElementById('newsletter-modal');
        if (popup) popup.classList.add('open');
      }, 9000);
    }
  }

  closeNewsletter() {
    const popup = document.getElementById('newsletter-modal');
    if (popup) popup.classList.remove('open');
    sessionStorage.setItem('oddaworld_welcome_popup', 'true');
  }

  subscribeNewsletter(event) {
    event.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const codeBox = document.getElementById('newsletter-coupon-display');

    if (codeBox) {
      codeBox.style.display = 'block';
      codeBox.innerHTML = `
        <div style="background: #EDF5EA; border: 1.5px dashed #2E7D32; border-radius: 8px; padding: 12px; margin-top: 14px; text-align: center;">
          <div style="font-size: 0.8rem; color: var(--primary-forest);">Votre code de bienvenue -10% :</div>
          <strong style="font-size: 1.25rem; letter-spacing: 2px; color: #192419;">WELCOME10</strong>
        </div>
      `;
    }

    store.notify('toast', {
      type: 'success',
      title: 'Bienvenue au Glow Club !',
      message: 'Votre code WELCOME10 a été activé.'
    });
  }

  showToastNotification({ type = 'info', title, message }) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message animate-fade-in';
    toast.innerHTML = `
      <div class="toast-icon-circle">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
      </div>
      <div class="toast-text">
        <h6>${title}</h6>
        <p>${message}</p>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-30px)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  handleStoreEvent(event, payload) {
    if (event === 'cart:updated') {
      this.updateCartBadge();
      this.renderCartDrawer();
    } else if (event === 'wishlist:updated') {
      this.updateWishlistBadge();
    } else if (event === 'toast') {
      this.showToastNotification(payload);
    }
  }

  updateCartBadge() {
    const badge = document.getElementById('header-cart-badge');
    const mobileBadge = document.getElementById('mobile-cart-badge');
    const count = store.getCartCount();

    if (badge) {
      badge.textContent = count;
      badge.style.transform = 'scale(1.3)';
      setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }
    if (mobileBadge) {
      mobileBadge.textContent = count;
    }
  }

  updateWishlistBadge() {
    const badge = document.getElementById('header-wishlist-badge');
    const mobileBadge = document.getElementById('mobile-wishlist-badge');
    const count = store.wishlist.length;

    if (badge) badge.textContent = count;
    if (mobileBadge) mobileBadge.textContent = count;
  }

  // --- MOBILE NAVIGATION DRAWER CONTROLS ---
  toggleMobileMenu() {
    const drawer = document.getElementById('mobile-menu-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    if (drawer && overlay) {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }
  }

  closeMobileMenu() {
    const drawer = document.getElementById('mobile-menu-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  setActiveMobileNav(el) {
    document.querySelectorAll('.mobile-bottom-item').forEach(item => item.classList.remove('active'));
    el?.classList.add('active');
  }

  scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setupEventListeners() {
    // Routine Switcher
    const routineButtons = document.querySelectorAll('.routine-tab-btn');
    routineButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        routineButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.routine;
        document.querySelectorAll('.routine-content-block').forEach(b => b.classList.remove('active'));
        document.getElementById(`routine-${target}`)?.classList.add('active');
      });
    });
  }
}

// Global Application Instance
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new App();
  window.app = app;

  // ============================================================
  // SCROLL REVEAL — IntersectionObserver for animated entrances
  // ============================================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Apply reveal classes to key sections
  const applyRevealAnimations = () => {
    // Section headers
    document.querySelectorAll('.section-header-row').forEach((el, i) => {
      el.classList.add('reveal-on-scroll');
      revealObserver.observe(el);
    });

    // Category cards (staggered)
    const catGrid = document.getElementById('categories-container');
    if (catGrid) {
      catGrid.classList.add('reveal-stagger');
      catGrid.querySelectorAll('.category-card').forEach(card => {
        card.classList.add('reveal-on-scroll');
        revealObserver.observe(card);
      });
    }

    // Product cards (staggered)
    const prodGrid = document.getElementById('products-grid');
    if (prodGrid) {
      prodGrid.classList.add('reveal-stagger');
      prodGrid.querySelectorAll('.product-card').forEach(card => {
        card.classList.add('reveal-on-scroll');
        revealObserver.observe(card);
      });
    }

    // About section
    const aboutGrid = document.querySelector('.about-grid');
    if (aboutGrid) {
      const [textCol, imgCol] = aboutGrid.children;
      textCol?.classList.add('reveal-from-left');
      imgCol?.classList.add('reveal-from-right');
      if (textCol) revealObserver.observe(textCol);
      if (imgCol) revealObserver.observe(imgCol);
    }

    // Blog articles
    document.querySelectorAll('#blog-grid .glass-card').forEach((card, i) => {
      card.classList.add('reveal-on-scroll');
      card.style.transitionDelay = `${i * 80}ms`;
      revealObserver.observe(card);
    });

    // FAQ items
    document.querySelectorAll('.accordion-item').forEach((item, i) => {
      item.classList.add('reveal-on-scroll');
      item.style.transitionDelay = `${i * 60}ms`;
      revealObserver.observe(item);
    });

    // Quiz banner
    const quizBanner = document.querySelector('.quiz-banner');
    if (quizBanner) {
      quizBanner.classList.add('reveal-on-scroll');
      revealObserver.observe(quizBanner);
    }

    // UGC grid
    document.querySelectorAll('.ugc-card').forEach((card, i) => {
      card.classList.add('reveal-on-scroll');
      card.style.transitionDelay = `${i * 60}ms`;
      revealObserver.observe(card);
    });

    // Contact grid
    const contactGrid = document.querySelector('.contact-grid');
    if (contactGrid) {
      const [faqCol, formCol] = contactGrid.children;
      faqCol?.classList.add('reveal-from-left');
      formCol?.classList.add('reveal-from-right');
      if (faqCol) revealObserver.observe(faqCol);
      if (formCol) revealObserver.observe(formCol);
    }

    // Footer
    const footer = document.getElementById('main-footer');
    if (footer) {
      footer.querySelectorAll('.footer-grid > div').forEach((col, i) => {
        col.classList.add('reveal-on-scroll');
        col.style.transitionDelay = `${i * 80}ms`;
        revealObserver.observe(col);
      });
    }

    // About stats
    document.querySelectorAll('.about-stats-grid > div').forEach((item, i) => {
      item.classList.add('reveal-on-scroll');
      item.style.transitionDelay = `${i * 100}ms`;
      revealObserver.observe(item);
    });
  };

  // Run after first render with slight delay
  setTimeout(applyRevealAnimations, 300);

  // Re-apply after product renders (since DOM updates dynamically)
  const originalRenderProducts = app.renderProducts.bind(app);
  app.renderProducts = function() {
    originalRenderProducts();
    setTimeout(() => {
      const prodGrid = document.getElementById('products-grid');
      if (prodGrid) {
        prodGrid.querySelectorAll('.product-card').forEach((card, i) => {
          if (!card.classList.contains('reveal-on-scroll')) {
            card.classList.add('reveal-on-scroll');
            card.style.transitionDelay = `${i * 60}ms`;
            revealObserver.observe(card);
          }
        });
      }
    }, 100);
  };

  // ============================================================
  // HEADER SCROLL EFFECT
  // ============================================================
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ============================================================
  // HERO IMAGE SUBTLE PARALLAX
  // ============================================================
  const heroImg = document.getElementById('hero-model-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < 600) {
        heroImg.style.transform = `scale(1.02) translateY(${scrollY * 0.06}px)`;
      }
    }, { passive: true });
  }

  // ============================================================
  // ANIMATED STAT COUNTERS (About section)
  // ============================================================
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statEls = entry.target.querySelectorAll('[data-count]');
        statEls.forEach(el => {
          const target = parseFloat(el.dataset.count);
          const duration = 1800;
          const start = performance.now();
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            el.textContent = Number.isInteger(target)
              ? Math.round(value).toLocaleString()
              : value.toFixed(1);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const aboutStats = document.querySelector('.about-stats-grid');
  if (aboutStats) counterObserver.observe(aboutStats);
});

