// ==========================================================================
// ODDAWORLD Luxury Cosmetics - Data Layer
// ==========================================================================

const ODDA_DATA = {
  brand: {
    name: "ODDAWORLD",
    tagline: "RADIANT SKIN COLLECTION",
    heroTitle: "Glow Naturally. Feel Confident",
    heroHighlight: "Every Day.",
    heroSubtitle: "Clean. Effective. Conscious. Skincare made for you.",
    freeShippingThreshold: 50,
    currency: "€",
    contactEmail: "concierge@oddaworld.com",
    contactPhone: "+33 1 89 45 20 00",
    headquarters: "Paris, France",
    loyaltyRate: 10 // 10 points per euro
  },

  trustBadges: [
    {
      id: "natural",
      label: "Natural Ingredients",
      sublabel: "100% végétaux sourcés",
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`
    },
    {
      id: "dermatologist",
      label: "Dermatologist Tested",
      sublabel: "Tolérance validée cliniquement",
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`
    },
    {
      id: "paraben",
      label: "Paraben Free",
      sublabel: "0% perturbateurs endocriniens",
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/></svg>`
    },
    {
      id: "cruelty",
      label: "Cruelty Free",
      sublabel: "Certifié Leaping Bunny & Vegan",
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`
    }
  ],

  categories: [
    {
      id: "cleansers",
      name: "Cleansers",
      frenchName: "Nettoyants",
      image: "assets/images/oddaworld_cleanser_1788781096568.jpg",
      fallbackImage: "assets/images/oddaworld_mockup.jpg",
      count: 3,
      tagline: "Purification douce et respect du microbiome"
    },
    {
      id: "serums",
      name: "Serums",
      frenchName: "Sérums",
      image: "assets/images/oddaworld_serum_1788781115031.jpg",
      fallbackImage: "assets/images/oddaworld_mockup.jpg",
      count: 4,
      tagline: "Concentrés haute performance éclat & fermeté"
    },
    {
      id: "moisturizers",
      name: "Moisturizers",
      frenchName: "Crèmes Hydratantes",
      image: "assets/images/oddaworld_moisturizer_1788781145087.jpg",
      fallbackImage: "assets/images/oddaworld_mockup.jpg",
      count: 3,
      tagline: "Nourrissement profond & barrière cutanée renforcée"
    },
    {
      id: "sunscreens",
      name: "Sunscreens",
      frenchName: "Protections Solaires",
      image: "assets/images/oddaworld_sunscreen_1788781163323.jpg",
      fallbackImage: "assets/images/oddaworld_mockup.jpg",
      count: 2,
      tagline: "Filtres minéraux invisibles haute protection SPF 50+"
    },
    {
      id: "masks",
      name: "Face Masks",
      frenchName: "Masques & Soins",
      image: "assets/images/oddaworld_facemask_1788781188200.jpg",
      fallbackImage: "assets/images/oddaworld_mockup.jpg",
      count: 2,
      tagline: "Détoxification botanique & infusion d'éclat"
    },
    {
      id: "lipcare",
      name: "Lip Care",
      frenchName: "Soins des Lèvres",
      image: "assets/images/oddaworld_hero_model_1788781076831.jpg",
      fallbackImage: "assets/images/oddaworld_mockup.jpg",
      count: 2,
      tagline: "Baumes peptides réparateurs repulpants"
    }
  ],

  products: [
    {
      id: "prod-1",
      name: "Glow Hydration Cream",
      category: "moisturizers",
      categoryName: "Crème Hydratante",
      price: 48,
      oldPrice: 58,
      rating: 4.9,
      reviewCount: 384,
      badge: "Bestseller",
      volume: "50ml / 1.7 fl oz",
      image: "assets/images/oddaworld_moisturizer_1788781145087.jpg",
      skinTypes: ["dry", "normal", "sensitive", "mixed"],
      concerns: ["hydration", "glow", "barrier"],
      texture: "Crème soyeuse fondante sans fini gras",
      period: "Matin & Soir",
      isBestseller: true,
      isNew: false,
      inStock: true,
      shortDesc: "Infusion hydratante intense aux céramides botaniques et squalane pour un éclat satiné durable toute la journée.",
      description: "Véritable concentré de nutrition cellulaire, la Glow Hydration Cream renforce la barrière hydrolipidique tout en révélant la luminosité naturelle du teint. Formulée à base de céramides d'origine végétale, d'acide hyaluronique multi-moléculaire et d'extrait d'olive méditerranéenne, elle procure 48h d'hydratation continue sans obstruer les pores.",
      keyIngredients: [
        { name: "Céramides Végétaux (NP, AP, EOP)", role: "Restaurent et scellent le ciment lipidique cutané pour prévenir la perte insensible en eau." },
        { name: "Acide Hyaluronique Tri-Poids", role: "Hydrate en profondeur et repulpe la surface de la peau instantanément." },
        { name: "Squalane Pur d'Olive", role: "Apporte un confort soyeux mimétique des lipides cutanés naturels." },
        { name: "Niacinamide 2%", role: "Unifie le grain de peau et apaise les rougeurs superficielles." }
      ],
      howToUse: "Appliquer une noisette matin et soir sur le visage, le cou et le décolleté préalablement nettoyés, après votre sérum ODDAWORLD. Masser par mouvements circulaires ascendants pour stimuler la micro-circulation.",
      routineStep: "Étape 3 : Sceller & Hydrater",
      complementaryId: "prod-2"
    },
    {
      id: "prod-2",
      name: "Radiant Glow Serum",
      category: "serums",
      categoryName: "Sérum Éclat",
      price: 54,
      oldPrice: null,
      rating: 4.95,
      reviewCount: 512,
      badge: "Culte",
      volume: "30ml / 1 fl oz",
      image: "assets/images/oddaworld_serum_1788781115031.jpg",
      skinTypes: ["normal", "mixed", "oily", "dry", "mature"],
      concerns: ["glow", "darkspots", "antiaging"],
      texture: "Sérum fluide aqueux ultra-pénétrant",
      period: "Matin & Soir",
      isBestseller: true,
      isNew: false,
      inStock: true,
      shortDesc: "Élixir hautement concentré en Niacinamide 5% et Vitamine C stabilisée pour un teint éclatant et sans taches.",
      description: "Le sérum iconique ODDAWORLD Glow Serum cible les teints ternes, le manque d'uniformité et les premiers signes de fatigue. Sa formule synergique brevetée réveille l'éclat en seulement 7 jours selon nos études cliniques.",
      keyIngredients: [
        { name: "Vitamine C Estérifiée 10%", role: "Puissant antioxydant qui protège des radicaux libres et booste la synthèse de collagène." },
        { name: "Niacinamide (Vitamine B3) 5%", role: "Régule la production de sébum, affine les pores et estompe les taches pigmentaires." },
        { name: "Extrait de Thé Vert Bio", role: "Effet tonifiant et apaisant anti-inflammatoire." }
      ],
      howToUse: "Déposer 3 à 4 gouttes au creux de la main puis presser délicatement sur le visage et le cou. Laisser pénétrer 60 secondes avant d'appliquer votre crème.",
      routineStep: "Étape 2 : Cibler & Illuminer",
      complementaryId: "prod-1"
    },
    {
      id: "prod-3",
      name: "Botanical Purifying Cleanser",
      category: "cleansers",
      categoryName: "Nettoyant Visage",
      price: 34,
      oldPrice: null,
      rating: 4.85,
      reviewCount: 220,
      badge: "Clean Beauty",
      volume: "120ml / 4 fl oz",
      image: "assets/images/oddaworld_cleanser_1788781096568.jpg",
      skinTypes: ["all", "sensitive", "mixed", "oily"],
      concerns: ["cleansing", "pores", "balance"],
      texture: "Gelée cristalline se métamorphosant en mousse aérienne",
      period: "Matin & Soir",
      isBestseller: true,
      isNew: false,
      inStock: true,
      shortDesc: "Nettoie en douceur, dissout le maquillage et élimine les impuretés sans jamais dessécher la peau.",
      description: "Formulé avec des tensioactifs doux issus de la noix de coco et enrichi en hydrolat de camomille matricaire, ce gel purifiant préserve le pH physiologique de l'épiderme (5.5) et laisse la peau fraîche, nette et détendue.",
      keyIngredients: [
        { name: "Hydrolat de Camomille Bio", role: "Calme les irritations et réduit les tiraillements post-nettoyage." },
        { name: "Prébiotiques Végétaux (Inuline)", role: "Nourrissent la flore cutanée bénéfique pour un microbiome sain." },
        { name: "Zinc PCA", role: "Purifie l'épiderme et rééquilibre les zones à tendance grasse." }
      ],
      howToUse: "Émulsionner une pression sur peau humide, masser délicatement en insistant sur la zone T, puis rincer abondamment à l'eau tiède.",
      routineStep: "Étape 1 : Nettoyer & Préparer",
      complementaryId: "prod-2"
    },
    {
      id: "prod-4",
      name: "Daily UV Defense SPF 50 PA++++",
      category: "sunscreens",
      categoryName: "Protection Solaire",
      price: 39,
      oldPrice: 45,
      rating: 4.92,
      reviewCount: 310,
      badge: "SPF 50+",
      volume: "50ml / 1.7 fl oz",
      image: "assets/images/oddaworld_sunscreen_1788781163323.jpg",
      skinTypes: ["all", "sensitive", "normal", "mature"],
      concerns: ["sunprotection", "antiaging", "glow"],
      texture: "Fluide ultra-léger invisible, zéro trace blanche",
      period: "Matin",
      isBestseller: true,
      isNew: true,
      inStock: true,
      shortDesc: "Bouclier anti-UVA/UVB et lumière bleue au fini velouté mat, parfait comme base de maquillage.",
      description: "La protection solaire quotidienne réinventée : une texture soyeuse imperceptible qui ne colle pas, résiste à l'humidité et offre une barrière totale contre le photovieillissement tout en préservant les océans (Reef-Safe).",
      keyIngredients: [
        { name: "Filtres Minéraux Nouvelle Génération", role: "Protection large spectre UVA/UVB haute tolérance cutanée." },
        { name: "Vitamine E & Centella Asiatica", role: "Régénèrent la peau exposée et calment les échauffements solaires." },
        { name: "Silice Naturelle", role: "Absorbe l'excès de brillance pour un fini peau de pêche." }
      ],
      howToUse: "Appliquer généreusement 15 minutes avant l'exposition en dernière étape de votre routine matinale. Renouveler toutes les 2 heures lors d'exposition prolongée.",
      routineStep: "Étape 4 : Protéger (Matin)",
      complementaryId: "prod-1"
    },
    {
      id: "prod-5",
      name: "Botanical Detox Clay Mask",
      category: "masks",
      categoryName: "Masque Détoxifiant",
      price: 42,
      oldPrice: null,
      rating: 4.88,
      reviewCount: 175,
      badge: "Bio",
      volume: "60ml / 2 fl oz",
      image: "assets/images/oddaworld_facemask_1788781188200.jpg",
      skinTypes: ["mixed", "oily", "normal", "pores"],
      concerns: ["detox", "pores", "blemishes"],
      texture: "Pâte d'argile onctueuse infusée au thé matcha",
      period: "1 à 2 fois par semaine",
      isBestseller: false,
      isNew: true,
      inStock: true,
      shortDesc: "Détoxifie les pores en 10 minutes sans tiraillement grâce à l'argile verte veloutée et au thé matcha.",
      description: "Ce masque régulateur resserre les pores visibles, capture les toxines urbaines et réveille les teints asphyxiés sans jamais craqueler ni assécher la barrière cutanée.",
      keyIngredients: [
        { name: "Argile Verte d'Auvergne ultra-ventilée", role: "Déloge les impuretés et absorbe l'excédent de sébum en douceur." },
        { name: "Poudre de Thé Matcha Cérémonial", role: "Bouclier antioxydant stimulant pour une microcirculation relancée." },
        { name: "Huile de Jojoba Vierge", role: "Maintient l'élasticité cutanée et empêche la déshydratation pendant la pose." }
      ],
      howToUse: "Appliquer une couche uniforme sur le visage nettoyé en évitant le contour des yeux. Laisser poser 8 à 10 minutes (l'argile doit rester légèrement souple) puis rincer à l'eau tiède avec une mousseline.",
      routineStep: "Soin Hebdomadaire",
      complementaryId: "prod-3"
    },
    {
      id: "prod-6",
      name: "Peptide Barrier Lip Butter",
      category: "lipcare",
      categoryName: "Soin des Lèvres",
      price: 24,
      oldPrice: null,
      rating: 4.97,
      reviewCount: 442,
      badge: "Coup de Cœur",
      volume: "15ml / 0.5 fl oz",
      image: "assets/images/oddaworld_hero_model_1788781076831.jpg",
      skinTypes: ["all"],
      concerns: ["lips", "hydration", "volume"],
      texture: "Baume fondant riche satiné non collant",
      period: "À volonté / Soir",
      isBestseller: true,
      isNew: false,
      inStock: true,
      shortDesc: "Baume aux peptides volumateurs et beurre de karité bio pour des lèvres instantanément douces et repulpées.",
      description: "Soin réparateur haute nutrition qui gorge les lèvres de peptides biomimétiques et de cires végétales. Restaure les lèvres gercées dès la première application et sublime le galbe naturel.",
      keyIngredients: [
        { name: "Tripeptide-1 Volumateur", role: "Stimule la synthèse de collagène et comble les micro-ridules labiales." },
        { name: "Beurre de Karité Grand Cru", role: "Nourrit intensément et répare les gerçures." },
        { name: "Huile de Ricin Première Pression", role: "Apporte un éclat brillant miroir subtil." }
      ],
      howToUse: "Glisser sur les lèvres tout au long de la journée ou appliquer en couche épaisse le soir comme masque régénérant de nuit.",
      routineStep: "Soin Continu",
      complementaryId: "prod-1"
    },
    {
      id: "prod-7",
      name: "Restorative Night Elixir Oil",
      category: "serums",
      categoryName: "Huile Botanique Nuit",
      price: 62,
      oldPrice: 72,
      rating: 4.91,
      reviewCount: 189,
      badge: "Nouveau",
      volume: "30ml / 1 fl oz",
      image: "assets/images/oddaworld_serum_1788781115031.jpg",
      skinTypes: ["dry", "mature", "sensitive", "normal"],
      concerns: ["antiaging", "nutrition", "glow"],
      texture: "Huile sèche soyeuse au parfum délicat d'oranger",
      period: "Soir",
      isBestseller: false,
      isNew: true,
      inStock: true,
      shortDesc: "Concentré de 9 huiles précieuses pressées à froid et bakuchiol (alternative végétale au rétinol).",
      description: "Pendant votre sommeil, cette huile luxueuse accélère le renouvellement cellulaire sans provoquer la moindre irritation grâce à une concentration optimale en bakuchiol et huile de rose musquée.",
      keyIngredients: [
        { name: "Bakuchiol Pur 1%", role: "Alternative douce au rétinol : lisse les ridules et unifie la texture." },
        { name: "Huile de Rose Musquée Bio", role: "Régénère les tissus et atténue les marques cutanées." },
        { name: "Huile de Bourrache", role: "Source rare d'acide gamma-linolénique pour la souplesse de la peau." }
      ],
      howToUse: "Chauffer 3 gouttes entre vos paumes puis respirer son arôme relaxant avant de masser le visage en mouvements ascendants doux.",
      routineStep: "Étape Finale Soir",
      complementaryId: "prod-1"
    },
    {
      id: "prod-8",
      name: "Gentle Micro-Exfoliating Powder",
      category: "cleansers",
      categoryName: "Poudre Exfoliante",
      price: 36,
      oldPrice: null,
      rating: 4.87,
      reviewCount: 140,
      badge: "Éco-Conçu",
      volume: "60g",
      image: "assets/images/oddaworld_cleanser_1788781096568.jpg",
      skinTypes: ["all", "dull", "mixed"],
      concerns: ["glow", "texture", "pores"],
      texture: "Poudre fine se transformant en mousse polissante douce",
      period: "2 à 3 fois par semaine",
      isBestseller: false,
      isNew: false,
      inStock: true,
      shortDesc: "Exfoliation enzymatique sans grains abrasifs à base de papaïne de papaye et poudre de riz micronisée.",
      description: "Libère la peau des cellules mortes et affine le grain de peau avec une infinie douceur. Idéal pour retrouver un teint frais et lumineux sans agresser la barrière protectrice.",
      keyIngredients: [
        { name: "Enzymes de Papaïne Active", role: "Dissolvent délicatement les squames de surface." },
        { name: "Poudre de Riz Micronisée", role: "Apporte un polissage ultra-doux protecteur." },
        { name: "Niacinamide", role: "Révèle l'éclat et apaise." }
      ],
      howToUse: "Verser une demi-cuillère de poudre dans le creux de la main mouillée, frotter pour créer une mousse crémeuse puis masser le visage 1 minute avant de rincer.",
      routineStep: "Exfoliation Douce",
      complementaryId: "prod-2"
    }
  ],

  routines: {
    morning: {
      title: "Routine Matinale : Éclat Solaire & Protection",
      tag: "Protection & Éclat",
      steps: [
        { step: 1, title: "Purifier", productId: "prod-3", action: "Nettoyer avec la gelée douce pour réveiller le microbiome cutané sans agresser." },
        { step: 2, title: "Illuminer", productId: "prod-2", action: "Appliquer 3 gouttes de Radiant Glow Serum pour stimuler la luminosité et neutraliser l'oxydation." },
        { step: 3, title: "Hydrater", productId: "prod-1", action: "Glow Hydration Cream pour sceller l'eau et créer un voile protecteur satiné." },
        { step: 4, title: "Protéger", productId: "prod-4", action: "Appliquer généreusement le Daily UV Defense SPF 50+ pour bloquer les rayons UV et la lumière bleue." }
      ]
    },
    night: {
      title: "Routine Nocturne : Réparation Cellulaire & Détox",
      tag: "Régénération & Réparation",
      steps: [
        { step: 1, title: "Double Nettoyage", productId: "prod-3", action: "Éliminer le maquillage, les filtres solaires et la pollution accumulée au cours du jour." },
        { step: 2, title: "Détoxifier (2x/sem)", productId: "prod-5", action: "Poser le Botanical Detox Clay Mask pour désobstruer les pores en profondeur." },
        { step: 3, title: "Nourrir & Régénérer", productId: "prod-1", action: "Envelopper le visage de la crème hydratante aux céramides réparateurs." },
        { step: 4, title: "Sublimer & Repulper", productId: "prod-7", action: "Appliquer quelques gouttes d'Élixir Nuit au Bakuchiol pour accélérer le renouvellement cellulaire pendant le sommeil." }
      ]
    }
  },

  quizQuestions: [
    {
      id: 1,
      question: "Quel est votre type de peau principal ?",
      subtitle: "Pour adapter les textures et les bases lipidiques idéales",
      options: [
        { value: "dry", title: "Sèche & Déshydratée", desc: "Tiraillements fréquents, zones rugueuses, manque de confort", icon: "💧" },
        { value: "mixed", title: "Mixte à Grasse", desc: "Brillances sur la zone T, pores dilatés ou imperfections", icon: "🌿" },
        { value: "sensitive", title: "Sensible & Réactive", desc: "Rougeurs faciles, picotements, intolérances cosmétiques", icon: "🌸" },
        { value: "normal", title: "Normale à Équilibrée", desc: "Peau confortable, sans inconfort majeur", icon: "✨" }
      ]
    },
    {
      id: 2,
      question: "Quelle est votre priorité beauté N°1 ?",
      subtitle: "L'objectif vers lequel orienter les actifs ciblés",
      options: [
        { value: "glow", title: "Éclat & Teint Lumineux", desc: "Éliminer le teint terne et défatiguer les traits", icon: "🌟" },
        { value: "hydration", title: "Hydratation & Barrière Fortifiée", desc: "Retrouver du confort, de la souplesse et repulper la peau", icon: "🌊" },
        { value: "antiaging", title: "Fermeté & Rides Lissées", desc: "Atténuer les signes de l'âge et relancer le collagène", icon: "⏳" },
        { value: "pores", title: "Pores Resserres & Détox", desc: "Unifier le grain de peau et purifier en douceur", icon: "🍃" }
      ]
    },
    {
      id: 3,
      question: "Quelle texture préférez-vous au quotidien ?",
      subtitle: "Le confort sensoriel au cœur de votre routine",
      options: [
        { value: "light", title: "Légère, Fraîche & Aérienne", desc: "Absorption instantanée, toucher zéro matière", icon: "☁️" },
        { value: "rich", title: "Onctueuse, Enveloppante & Riche", desc: "Nourrissement durable et fini satiné réconfortant", icon: "🍯" },
        { value: "oil", title: "Huile Botanique Soyeuse", desc: "Fini velours et massage sensoriel réconfortant", icon: "✨" }
      ]
    }
  ],

  blogArticles: [
    {
      id: "art-1",
      title: "Comment construire une routine éclat en 3 étapes simples",
      category: "Conseils Skincare",
      date: "04 Septembre 2026",
      readTime: "4 min de lecture",
      image: "assets/images/oddaworld_serum_1788781115031.jpg",
      excerpt: "Découvrez les principes de la slow beauty et comment la synergie Niacinamide + Céramides transforme la texture de votre peau.",
      content: `
        <p>L'éclat d'une peau ne résulte pas de l'accumulation de dix produits superflus, mais de la précision de quelques gestes fondamentaux respectueux de la physiologie épidermique.</p>
        <h4>1. Nettoyer sans décaper</h4>
        <p>Le film hydrolipidique est le bouclier premier de votre éclat. Utiliser un nettoyant trop astringent stimule l'inflammation et la surproduction de sébum. Privilégiez des tensioactifs d'origine végétale à pH 5.5 comme le <em>Botanical Purifying Cleanser</em>.</p>
        <h4>2. Infuser des antioxydants ciblés</h4>
        <p>Chaque matin, votre visage est confronté aux agressions extérieures : rayons ultraviolets, pollution atmosphérique, particules fines. La vitamine C stabilisée alliée à la Niacinamide neutralise le stress oxydatif avant qu'il ne ternisse le teint.</p>
        <h4>3. Verrouiller avec des céramides mimétiques</h4>
        <p>Une peau lumineuse est avant tout une peau bien scellée. Sans céramides pour fermer la barrière, l'hydratation s'évapore en quelques heures. C'est le rôle fondamental de la <em>Glow Hydration Cream</em>.</p>
      `
    },
    {
      id: "art-2",
      title: "Pourquoi le SPF 50 est indispensable, même en hiver",
      category: "Science & Peau",
      date: "28 Août 2026",
      readTime: "5 min de lecture",
      image: "assets/images/oddaworld_sunscreen_1788781163323.jpg",
      excerpt: "Les rayons UVA traversent les nuages et les vitres : comprendre le mécanisme du photovieillissement silencieux.",
      content: `
        <p>Il existe une idée reçue tenace : celle que la protection solaire est réservée aux journées estivales à la plage. Or, 80% du vieillissement prématuré cutané est directement imputable aux rayons ultraviolets A (UVA).</p>
        <h4>Les UVA : les ennemis invisibles du derme</h4>
        <p>Contrairement aux UVB responsables des coups de soleil, les UVA possèdent une longueur d'onde supérieure capable de traverser la couverture nuageuse ainsi que les vitres de votre bureau. Ils dégradent silencieusement les fibres d'élastine et le collagène.</p>
        <h4>Le secret d'un bon SPF quotidien</h4>
        <p>Pour être adopté tous les jours, un soin solaire doit être totalement invisible, non comédogène et servir de base idéale pour votre mise en beauté. C'est exactement l'exigence qui a guidé la formulation du <em>Daily UV Defense SPF 50 PA++++</em> d'ODDAWORLD.</p>
      `
    },
    {
      id: "art-3",
      title: "Argile verte & Matcha : Le duo détox souverain",
      category: "Ingrédients Purs",
      date: "15 Août 2026",
      readTime: "3 min de lecture",
      image: "assets/images/oddaworld_facemask_1788781188200.jpg",
      excerpt: "L'art d'utiliser un masque purifiant sans jamais assécher la barrière cutanée.",
      content: `
        <p>L'erreur la plus courante lors de l'application d'un masque à l'argile est de le laisser sécher jusqu'à ce qu'il craquelle sur la peau. À ce stade, l'argile commence à aspirer l'hydratation vitale des cellules de votre peau !</p>
        <h4>La règle des 10 minutes souples</h4>
        <p>Un masque purifiant doit rester souple et humide tout au long de sa pose. Le <em>Botanical Detox Clay Mask</em> incorpore de l'huile de jojoba vierge et du thé matcha pour maintenir une texture crémeuse tout en purifiant intensément les pores.</p>
      `
    }
  ],

  faq: [
    {
      category: "Produits & Formules",
      question: "Les soins ODDAWORLD conviennent-ils aux peaux très sensibles ?",
      answer: "Absolument. L'ensemble de nos formules est testé sous contrôle dermatologique sur peaux sensibles et réactives. Nos soins sont exempts de parabènes, de silicones occlusifs, d'alcools desséchants et de parfums de synthèse agressifs."
    },
    {
      category: "Produits & Formules",
      question: "Vos produits sont-ils 100% végans et non testés sur les animaux ?",
      answer: "Oui, la totalité de notre catalogue est certifiée Cruelty-Free (sans aucune expérimentation animale à chaque étape de la chaîne) et 100% végane, sans aucun dérivé d'origine animale (ni carmin, ni cire d'abeille)."
    },
    {
      category: "Commandes & Livraison",
      question: "Quels sont les délais et les tarifs de livraison ?",
      answer: "La livraison standard (Colissimo Suivi) est offerte en France métropolitaine dès 50€ d'achat (sinon 4,90€). Les colis sont préparés sous 24h ouvrées et livrés à domicile sous 48h à 72h. Nous proposons également la livraison Express DHL en 24h."
    },
    {
      category: "Commandes & Livraison",
      question: "Puis-je retourner un produit s'il ne me convient pas ?",
      answer: "Nous offrons une garantie 'Satisfaction Éclat' de 30 jours. Si un soin ne convient pas à votre peau, vous disposez de 30 jours à compter de la réception pour nous le retourner gratuitement et obtenir un remboursement intégral."
    },
    {
      category: "Paiement & Sécurité",
      question: "Les paiements sont-ils entièrement sécurisés ?",
      answer: "Tous les paiements sur ODDAWORLD sont cryptés via le protocole SSL 256-bit et traités par nos partenaires bancaires certifiés PCI-DSS (Stripe, Apple Pay, PayPal, Klarna 3x sans frais). Aucune coordonnée bancaire n'est conservée sur nos serveurs."
    }
  ],

  testimonials: [
    {
      name: "Camille R.",
      location: "Paris, France",
      product: "Glow Hydration Cream",
      rating: 5,
      date: "Il y a 3 jours",
      verified: true,
      text: "La meilleure crème que j'ai testée depuis des années ! Ma peau sèche ne tiraille plus du tout et j'ai ce glow satiné naturel sans avoir besoin de fond de teint.",
      skinType: "Peau sèche à déshydratée"
    },
    {
      name: "Sarah M.",
      location: "Lyon, France",
      product: "Radiant Glow Serum",
      rating: 5,
      date: "Il y a 1 semaine",
      verified: true,
      text: "Mes taches d'hyperpigmentation se sont visiblement estompées en 3 semaines d'utilisation quotidienne. La texture est divine et pénètre en quelques secondes.",
      skinType: "Peau mixte"
    },
    {
      name: "Éléonore D.",
      location: "Bordeaux, France",
      product: "Daily UV Defense SPF 50",
      rating: 5,
      date: "Il y a 2 semaines",
      verified: true,
      text: "Enfin une crème solaire indice 50 qui ne laisse aucune trace blanche, ne pique pas les yeux et ne fait pas briller ! C'est devenu mon indispensable matinal.",
      skinType: "Peau sensible"
    }
  ],

  socialFeed: [
    { user: "@claire.glow", image: "assets/images/oddaworld_hero_model_1788781076831.jpg", caption: "Mon rituel du matin avec @oddaworld #OddaGlow #RadiantSkin" },
    { user: "@beauty_minimalist", image: "assets/images/oddaworld_serum_1788781115031.jpg", caption: "Ce sérum a sauvé ma barrière cutanée ✨" },
    { user: "@skincare_routine_fr", image: "assets/images/oddaworld_moisturizer_1788781145087.jpg", caption: "La texture de la Glow Cream est incroyable !" },
    { user: "@lea_organic", image: "assets/images/oddaworld_cleanser_1788781096568.jpg", caption: "Nettoyage doux validé à 100% 🌿" }
  ],

  recentPurchases: [
    { name: "Léa", city: "Paris", product: "Glow Hydration Cream", time: "il y a 2 min" },
    { name: "Camille", city: "Bordeaux", product: "Radiant Glow Serum", time: "il y a 5 min" },
    { name: "Juliette", city: "Lyon", product: "Daily UV Defense SPF 50", time: "il y a 8 min" },
    { name: "Inès", city: "Nantes", product: "Botanical Detox Clay Mask", time: "il y a 12 min" },
    { name: "Chloé", city: "Bruxelles", product: "Peptide Barrier Lip Butter", time: "il y a 15 min" }
  ],

  promoCodes: {
    "GLOW15": { discountPercent: 15, desc: "Remise exclusive -15% sur toute la commande" },
    "WELCOME10": { discountPercent: 10, desc: "Offre de bienvenue -10%" },
    "ODDASHIP": { freeShipping: true, desc: "Livraison offerte sans minimum" }
  }
};
