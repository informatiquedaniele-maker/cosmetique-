// ==========================================================================
// ODDAWORLD - Interactive Skincare Chatbot Assistant
// ==========================================================================

class SkincareChatbot {
  constructor() {
    this.windowEl = document.getElementById('chat-window');
    this.messagesEl = document.getElementById('chat-messages');
    this.inputEl = document.getElementById('chat-input');
    this.isOpen = false;

    this.knowledgeBase = [
      {
        keywords: ['bonjour', 'salut', 'coucou', 'hello', 'aide'],
        response: "Bonjour et bienvenue chez ODDAWORLD ✨ Je suis votre conseillère beauté virtuelle. Comment puis-je sublimer votre peau aujourd'hui ?"
      },
      {
        keywords: ['commande', 'suivi', 'colis', 'livraison', 'delai'],
        response: "Nos commandes sont expédiées sous 24h ouvrées. Vous bénéficiez de la livraison offerte dès 50€ d'achat avec suivi Colissimo ! Vous pouvez également consulter vos commandes dans votre Espace Client."
      },
      {
        keywords: ['code', 'promo', 'reduction', 'remise', 'bienvenue', 'offre'],
        response: "Bonne nouvelle ! Utilisez le code <strong>WELCOME10</strong> pour profiter de -10% sur votre première commande, ou <strong>GLOW15</strong> pour -15% sur les rituels complets ✨"
      },
      {
        keywords: ['sensible', 'rougeur', 'reactif', 'irritation'],
        response: "Pour les peaux sensibles, je vous recommande chaudement notre <em>Botanical Purifying Cleanser</em> (pH 5.5 doux) associé à la <em>Glow Hydration Cream</em> riche en céramides apaisants !",
        productId: 'prod-1'
      },
      {
        keywords: ['eclat', 'terne', 'tache', 'vitamine c', 'lumineux', 'glow'],
        response: "Notre soin phare pour l'éclat est sans conteste le <strong>Radiant Glow Serum</strong> concentré en Vitamine C et Niacinamide 5%. Résultats visibles en seulement 7 jours !",
        productId: 'prod-2'
      },
      {
        keywords: ['soleil', 'spf', 'uv', 'solaire', 'protection'],
        response: "Le <strong>Daily UV Defense SPF 50 PA++++</strong> protège des UVA/UVB et de la lumière bleue avec une texture fluide invisible zéro trace blanche, idéale sous le maquillage.",
        productId: 'prod-4'
      },
      {
        keywords: ['quiz', 'diagnostic', 'conseil', 'routine', 'type de peau'],
        response: "Le meilleur moyen de trouver votre rituel personnalisé est de tester notre Diagnostic de Peau sur-mesure ! Souhaitez-vous le démarrer ?",
        actionQuiz: true
      },
      {
        keywords: ['vegan', 'animaux', 'cruelty', 'naturel', 'bio'],
        response: "Toutes les formules ODDAWORLD sont 100% végétaliennes, certifiées Cruelty-Free par Leaping Bunny et sans perturbateurs endocriniens. Nos flacons sont en verre recyclable à l'infini 🌿"
      }
    ];
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.windowEl) {
      if (this.isOpen) {
        this.windowEl.classList.add('open');
        this.inputEl?.focus();
      } else {
        this.windowEl.classList.remove('open');
      }
    }
  }

  sendMessage(text = null) {
    const input = text || this.inputEl?.value?.trim();
    if (!input) return;

    if (this.inputEl) this.inputEl.value = '';

    // Add user message
    this.appendMessage(input, 'user');

    // Simulate thinking delay
    setTimeout(() => {
      this.respond(input);
    }, 600);
  }

  appendMessage(htmlContent, sender = 'bot') {
    if (!this.messagesEl) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.innerHTML = htmlContent;
    this.messagesEl.appendChild(msgDiv);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  respond(userInput) {
    const lower = userInput.toLowerCase();
    let matched = null;

    for (const item of this.knowledgeBase) {
      if (item.keywords.some(k => lower.includes(k))) {
        matched = item;
        break;
      }
    }

    if (matched) {
      let reply = matched.response;
      if (matched.productId) {
        const prod = ODDA_DATA.products.find(p => p.id === matched.productId);
        if (prod) {
          reply += `
            <div style="margin-top: 10px; padding: 10px; background: #F4F7F2; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
              <img src="${prod.image}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover;">
              <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 0.85rem;">${prod.name}</div>
                <div style="font-size: 0.8rem; color: var(--primary-forest); font-weight: 700;">${prod.price} €</div>
              </div>
              <button onclick="store.addToCart('${prod.id}', 1)" style="background: var(--primary-dark); color: #FFF; padding: 6px 12px; border-radius: 14px; font-size: 0.76rem; font-weight: 600;">+ Panier</button>
            </div>
          `;
        }
      } else if (matched.actionQuiz) {
        reply += `
          <div style="margin-top: 10px;">
            <button class="btn-primary" style="padding: 6px 16px; font-size: 0.78rem;" onclick="skinQuiz.start(); chatbot.toggle();">
              Lancer le Quiz ✨
            </button>
          </div>
        `;
      }
      this.appendMessage(reply, 'bot');
    } else {
      this.appendMessage(
        "Je comprends tout à fait ! Pour vous orienter avec précision, souhaitez-vous des conseils sur nos sérums, nos protections solaires, ou préférez-vous faire le Quiz Beauté express ?",
        'bot'
      );
    }
  }

  sendSuggestion(text) {
    this.sendMessage(text);
  }
}

const chatbot = new SkincareChatbot();
