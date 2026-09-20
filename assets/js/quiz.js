// ==========================================================================
// ODDAWORLD - Interactive Skin Diagnosis Quiz
// ==========================================================================

class SkinQuiz {
  constructor() {
    this.currentStep = 0;
    this.answers = {};
    this.modalEl = document.getElementById('quiz-modal');
    this.containerEl = document.getElementById('quiz-dynamic-content');
    this.progressFillEl = document.getElementById('quiz-progress-fill');
  }

  start() {
    this.currentStep = 0;
    this.answers = {};
    this.renderStep();
    this.openModal();
  }

  openModal() {
    if (this.modalEl) {
      this.modalEl.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    if (this.modalEl) {
      this.modalEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  renderStep() {
    const question = ODDA_DATA.quizQuestions[this.currentStep];
    if (!question) {
      this.renderResults();
      return;
    }

    // Update progress bar
    const progressPercent = ((this.currentStep + 1) / ODDA_DATA.quizQuestions.length) * 100;
    if (this.progressFillEl) {
      this.progressFillEl.style.width = `${progressPercent}%`;
    }

    this.containerEl.innerHTML = `
      <div class="quiz-step-header">
        <span class="badge-pill badge-sage" style="margin-bottom: 12px;">Étape ${this.currentStep + 1} sur ${ODDA_DATA.quizQuestions.length}</span>
        <h3>${question.question}</h3>
        <p>${question.subtitle}</p>
      </div>

      <div class="quiz-options-list">
        ${question.options.map(opt => `
          <div class="quiz-option-card ${this.answers[question.id] === opt.value ? 'selected' : ''}" 
               data-val="${opt.value}" onclick="skinQuiz.selectOption(${question.id}, '${opt.value}')">
            <div class="quiz-option-icon">${opt.icon}</div>
            <div class="quiz-option-text">
              <h4>${opt.title}</h4>
              <p>${opt.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="flex-between" style="padding-top: 15px; border-top: 1px solid #ECEEE8;">
        ${this.currentStep > 0 ? `
          <button class="filter-pill" onclick="skinQuiz.prevStep()">
            ← Précédent
          </button>
        ` : '<div></div>'}
        <button class="btn-primary" style="padding: 10px 24px; font-size: 0.85rem;" 
                id="btn-quiz-next" ${!this.answers[question.id] ? 'disabled style="opacity: 0.5; pointer-events: none;"' : ''} 
                onclick="skinQuiz.nextStep()">
          ${this.currentStep === ODDA_DATA.quizQuestions.length - 1 ? 'Voir mon Diagnostic ✨' : 'Continuer →'}
        </button>
      </div>
    `;
  }

  selectOption(questionId, value) {
    this.answers[questionId] = value;
    this.renderStep();
  }

  nextStep() {
    if (this.currentStep < ODDA_DATA.quizQuestions.length - 1) {
      this.currentStep++;
      this.renderStep();
    } else {
      this.renderResults();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderStep();
    }
  }

  renderResults() {
    if (this.progressFillEl) this.progressFillEl.style.width = '100%';

    const skinType = this.answers[1] || 'normal';
    const concern = this.answers[2] || 'glow';

    // Find recommended bundle
    let recommendedProds = [];
    if (concern === 'glow' || skinType === 'normal') {
      recommendedProds = [
        ODDA_DATA.products.find(p => p.id === 'prod-2'), // Glow Serum
        ODDA_DATA.products.find(p => p.id === 'prod-1'), // Glow Cream
        ODDA_DATA.products.find(p => p.id === 'prod-4')  // SPF 50
      ];
    } else if (skinType === 'dry') {
      recommendedProds = [
        ODDA_DATA.products.find(p => p.id === 'prod-1'), // Glow Cream
        ODDA_DATA.products.find(p => p.id === 'prod-7'), // Restorative Oil
        ODDA_DATA.products.find(p => p.id === 'prod-6')  // Lip Butter
      ];
    } else {
      recommendedProds = [
        ODDA_DATA.products.find(p => p.id === 'prod-3'), // Cleanser
        ODDA_DATA.products.find(p => p.id === 'prod-2'), // Glow Serum
        ODDA_DATA.products.find(p => p.id === 'prod-5')  // Clay Mask
      ];
    }

    // Filter valid products
    recommendedProds = recommendedProds.filter(Boolean);

    const bundleTotal = recommendedProds.reduce((sum, p) => sum + p.price, 0);
    const discountedTotal = Math.round(bundleTotal * 0.85);

    this.containerEl.innerHTML = `
      <div class="quiz-results-box">
        <span class="badge-pill badge-gold" style="margin-bottom: 12px;">Diagnostic Personnalisé</span>
        <h3 style="font-size: 2rem; margin-bottom: 10px;">Votre Rituel Éclat Idéal</h3>
        <p style="color: var(--text-secondary); max-width: 520px; margin: 0 auto 24px;">
          D'après vos réponses, votre épiderme nécessite une action ciblée sur le <strong>renforcement de la barrière cutanée</strong> et une stimulation naturelle de l'éclat sans agresser le microbiome.
        </p>

        <div class="quiz-routine-cards">
          ${recommendedProds.map(p => `
            <div style="background: #F7F9F5; border-radius: var(--radius-md); padding: 14px; display: flex; gap: 12px; align-items: center; border: 1px solid #E2E9DF;">
              <img src="${p.image}" alt="${p.name}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">
              <div style="flex: 1;">
                <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--primary-olive); font-weight: 600;">${p.categoryName}</span>
                <h5 style="font-size: 0.95rem; font-weight: 600; margin: 2px 0;">${p.name}</h5>
                <span style="font-weight: 700; color: var(--primary-dark); font-size: 0.9rem;">${p.price} €</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="background: #EEF4EB; border-radius: var(--radius-md); padding: 18px 24px; margin: 25px 0; border: 1px solid #D5E1D1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="font-size: 0.82rem; text-transform: uppercase; letter-spacing: 1px; color: var(--primary-forest); font-weight: 700;">Pack Routine Complète (-15%)</div>
            <div style="font-size: 1.35rem; font-weight: 700; color: var(--primary-dark);">
              ${discountedTotal} € <span style="font-size: 0.95rem; text-decoration: line-through; color: var(--text-muted); font-weight: 400; margin-left: 6px;">${bundleTotal} €</span>
            </div>
          </div>
          <button class="btn-primary" onclick="skinQuiz.addBundleToCart(${JSON.stringify(recommendedProds.map(p => p.id)).replace(/"/g, '&quot;')})">
            Ajouter la routine au panier →
          </button>
        </div>

        <button class="filter-pill" onclick="skinQuiz.start()" style="margin-top: 10px;">
          Recommencer le diagnostic
        </button>
      </div>
    `;
  }

  addBundleToCart(productIds) {
    productIds.forEach(id => {
      store.addToCart(id, 1);
    });
    // Apply special 15% discount
    store.applyPromoCode('GLOW15');
    this.closeModal();
    // Open cart drawer
    app.openCart();
  }
}

const skinQuiz = new SkinQuiz();
