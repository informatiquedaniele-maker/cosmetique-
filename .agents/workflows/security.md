---
description: security web
---

=== PROMPT D'AUDIT DE SECURITE (COPIER TOUT CE QUI SUIT CETTE LIGNE) ===
Tu effectues un audit de securite complet d'une application web
vibe-codee. "Vibe-codee" signifie que cette application a ete
principalement construite en utilisant des assistants de code IA
comme Claude, Cursor, Copilot, ou des outils similaires. Ces
outils produisent du code fonctionnel rapidement mais introduisent
regulierement des failles de securite qu'un developpeur humain
detecterait habituellement.
Ton travail est de trouver chacune de ces failles.
</role>
PASSE 1 — DECOUVERTE
Lis l'integralite de la base de code avant de produire des
conclusions. Construis un modele mental de l'architecture :
framework, base de donnees, fournisseur d'authentification, couche
API, configuration de deploiement. Identifie chaque point d'entree
(pages, routes API, actions serveur, webhooks, taches cron). Trace
le flux de donnees depuis l'entree utilisateur jusqu'a la base de
donnees et retour.
PASSE 2 — AUDIT SYSTEMATIQUE
Parcours chaque section de la checklist ci-dessous. Pour chaque
element de la checklist, fais l'une de ces trois choses :
✅ PASSE    — La base de code gere cela correctement. Cite le fichier/ligne.
❌ ECHOUE  — Une vulnerabilite existe. Documente-la completement (voir format).
⚠️ PARTIEL — Une couverture partielle mais des lacunes subsistent. Explique ce qui manque.
⬚ N/A      — Non applicable a cette base de code. Indique brievement pourquoi.
Ne saute aucun element. Ne resume pas des groupes d'elements ensemble.
Chaque element de la checklist recoit son propre verdict explicite.
</methodology>
<output_format>
Pour chaque conclusion ❌ ECHOUE, utilise exactement cette structure :
┌─────────────────────────────────────────────────────────┐
│ CONCLUSION #[numero]                                    │
├──────────┬──────────────────────────────────────────────┤
│ Severite │ CRITIQUE / HAUTE / MOYENNE / BASSE           │
│ Categorie│ ex., Exposition de Secret, RLS Manquant, etc.│
│ Emplacement│ chemin/fichier.ts:numero_ligne             │
│ CWE      │ CWE-XXX (Nom)                               │
├──────────┴──────────────────────────────────────────────┤
│ Ce qui ne va pas :                                      │
│ [Description en langage clair de la vulnerabilite]      │
│                                                         │
│ Pourquoi c'est important :                              │
│ [Ce qu'un attaquant pourrait reellement faire avec ca]  │
│                                                         │
│ Le code vulnerable :                                    │
│                                                     │ │ [extrait de code exact]                                 │ │                                                     │
│                                                         │
│ La correction :                                         │
│                                                     │ │ [extrait de code corrige, pret a copier/coller]         │ │                                                     │
│                                                         │
│ Effort : ~[X] minutes                                   │
└─────────────────────────────────────────────────────────┘
</output_format>
<audit_checklist>
Section 1 : Variables d'Environnement et Gestion des Secrets
Cherche dans chaque fichier de la base de code chacun des elements
suivants. Cela inclut les fichiers source, les fichiers de
configuration, les scripts, et tout fichier .env qui aurait pu
etre commite dans le depot.
▢ 1.1 — Secrets codes en dur : Cherche les cles API, tokens,
mots de passe, chaines de connexion, et URLs de webhook
integres directement dans le code source. Patterns courants
a rechercher avec grep :
sk_live_, sk_test_, sk-, pk_live_,
Bearer, eyJ (prefixe base64 JWT),
ghp_, gho_, github_pat_,
xoxb-, xoxp- (tokens Slack),
AKIA (cles d'acces AWS),
toute chaine alphanumerique de 32+ caracteres entre guillemets
▢ 1.2 — Couverture .gitignore : Verifie que .env, .env.local,
.env.production, et .env*.local sont tous dans .gitignore.
Verifie l'historique git pour tout fichier .env precedemment
commite (meme s'il a ete supprime depuis, les secrets dans
l'historique git sont toujours exposes).
▢ 1.3 — Fuites de prefixe public : Verifie que les secrets
reserves au serveur N'UTILISENT PAS les prefixes publics des
frameworks. Dans Next.js, tout ce qui a NEXT_PUBLIC_ est
integre dans le JavaScript client et visible par n'importe
qui. Dans Vite, le prefixe est VITE_. Dans Create React App,
c'est REACT_APP_. Les cles qui ne doivent JAMAIS avoir de
prefixe public incluent :
- Cles de role service de base de donnees
- Cles secretes Stripe
- Cles API OpenAI / Anthropic
- Identifiants SMTP
- Toute cle qui donne un acces en ecriture/administrateur
▢ 1.4 — Fuites dans la console/erreurs : Cherche les console.log,
console.error, et les composants de frontiere d'erreur qui
pourraient afficher des variables d'environnement ou des secrets
dans la console du navigateur ou dans des messages d'erreur
visibles par le client.
▢ 1.5 — Exposition des artefacts de build : Verifie si les source
maps sont activees en production (productionBrowserSourceMaps
dans next.config.js, config sourcemap de vite, etc). Les source
maps permettent a n'importe qui de reconstituer ton code source
original incluant tout secret integre.
▢ 1.6 — Validation au demarrage : Verifie que l'app echoue
rapidement si des variables d'environnement requises sont
manquantes, plutot que de tourner silencieusement avec des
valeurs indefinies (ce qui cause souvent des erreurs runtime
cryptiques ou, pire, un repli sur des valeurs par defaut
non securisees).
	Section 2 : Securite de la Base de Donnees
	Si l'app utilise Supabase, Firebase, ou toute base de donnees avec
un acces cote client, cette section est critique. Si elle utilise
une base de donnees traditionnelle cote serveur uniquement (ex.,
Prisma avec PostgreSQL, pas de SDK cote client), adapte les
verifications en consequence et note l'architecture.
▢ 2.1 — RLS active : Verifie que le Row Level Security est
active sur CHAQUE table dans le schema public. Verifie s'il
y a des tables creees via des migrations ou l'editeur SQL
qui auraient pu etre manquees. Une seule table non protegee
expose toutes ses donnees a quiconque possede la cle anon.
▢ 2.2 — Les policies RLS existent : Une table avec le RLS
active mais AUCUNE policy retourne silencieusement des
resultats vides pour toutes les requetes. Ca ressemble a un
bug, pas a un probleme de securite, et c'est une erreur
courante de l'IA. Verifie que chaque table avec RLS active
a au moins des policies SELECT et INSERT.
▢ 2.3 — Clauses WITH CHECK : Verifie que toutes les policies
INSERT et UPDATE incluent des clauses WITH CHECK. Sans
WITH CHECK sur INSERT, un utilisateur peut inserer des lignes
avec n'importe quel user_id (usurpation d'identite d'autres
utilisateurs). Sans WITH CHECK sur UPDATE, un utilisateur
peut changer le user_id d'une ligne pour voler la propriete.
▢ 2.4 — Source d'identite des policies : Assure-toi que les
policies RLS utilisent auth.uid() pour l'identite, PAS
auth.jwt()->'user_metadata'. Les metadonnees utilisateur
peuvent etre modifiees par les utilisateurs finaux
authentifies, ce qui en fait une source d'identite non fiable.
▢ 2.5 — Isolation de la cle service_role : La cle service_role
contourne tout le RLS. Verifie qu'elle n'est JAMAIS utilisee
dans le code cote client, jamais importee dans les composants,
et utilisee uniquement dans le code cote serveur ou le
contournement du RLS est veritablement necessaire (operations
admin, webhooks).
▢ 2.6 — Policies des buckets de stockage : Si Supabase Storage
est utilise, verifie que les buckets de stockage ont des
policies RLS. Par defaut, les buckets de stockage sont
accessibles publiquement.
▢ 2.7 — Injection SQL : Verifie s'il y a des requetes SQL brutes
utilisant la concatenation de chaines ou des template literals
au lieu de requetes parametrees. La librairie client Supabase
est securisee par defaut, mais les appels bruts .rpc() ou les
requetes pg/postgres.js peuvent ne pas l'etre.
▢ 2.8 — Fonctions SECURITY DEFINER : Verifie s'il y a des
fonctions de base de donnees marquees SECURITY DEFINER. Celles-ci
s'executent avec les privileges du createur de la fonction
(generalement superuser), pas de l'utilisateur appelant. Verifie
qu'elles n'exposent pas de donnees et ne contournent pas le RLS.
	Section 3 : Authentification et Gestion des Sessions
▢ 3.1 — Le middleware d'auth existe : Verifie que le middleware
d'authentification (ex., middleware.ts de Next.js, middleware
Express, etc.) existe et s'execute sur les routes protegees.
Verifie la configuration du matcher pour s'assurer qu'il
couvre tous les chemins necessaires.
▢ 3.2 — Routage par defaut en refus : Verifie si le middleware
protege les routes par defaut (liste blanche de routes
publiques) vs. protection par exception (liste noire de routes
protegees). Le refus par defaut (liste blanche) est
significativement plus sur parce que les nouvelles routes sont
automatiquement protegees.
▢ 3.3 — getUser() vs getSession() : Pour les apps Supabase,
verifie que les operations cote serveur sensibles a la
securite utilisent supabase.auth.getUser() (qui valide le JWT
aupres des serveurs Supabase) plutot que
supabase.auth.getSession() (qui lit seulement le JWT local
sans verification).
▢ 3.4 — Gestionnaire de callback auth : Verifie que la route
/auth/callback (ou equivalent) echange correctement les codes
d'auth pour des sessions, gere les erreurs de maniere elegante,
et n'expose pas les tokens dans les URLs ou les logs.
▢ 3.5 — Stockage de session : Verifie que les tokens de session
sont stockes dans des cookies httpOnly, PAS dans localStorage
ou sessionStorage (qui sont accessibles par tout JavaScript
sur la page, incluant les charges XSS).
▢ 3.6 — Routes API protegees : Verifie que CHAQUE route API
gerant des donnees utilisateur verifie l'authentification
avant le traitement. Cherche les routes API qui sautent
completement la verification d'auth, surtout celles que l'IA
a pu ajouter plus tard dans le developpement.
▢ 3.7 — Securite OAuth : Si OAuth est implemente, verifie que
les URLs de callback sont validees, que les parametres state
sont utilises pour la protection CSRF, et que les tokens sont
geres de maniere securisee.
▢ 3.8 — Flux de reinitialisation de mot de passe : Si applicable,
verifie que les tokens de reinitialisation expirent, sont a
usage unique, et sont transmis de maniere securisee.
	Section 4 : Validation Cote Serveur
▢ 4.1 — Validation par schema : Verifie que toutes les routes
API et actions serveur valident les entrees en utilisant une
librairie de validation par schema (Zod, Yup, Valibot, ArkType,
etc.) cote serveur. La validation frontend est de l'UX, pas de
la securite. Chaque entree doit etre re-verifiee cote serveur.
▢ 4.2 — Identite depuis la session : Verifie que l'identite de
l'utilisateur pour les operations d'ecriture est TOUJOURS
derivee de la session authentifiee ou du token JWT, jamais
des champs du corps de la requete comme { userId: "..." }.
Un attaquant peut envoyer n'importe quel userId dans un corps
de requete.
▢ 4.3 — Nettoyage des entrees : Verifie que le contenu genere
par l'utilisateur et rendu en HTML est correctement nettoye
pour prevenir le Cross-Site Scripting (XSS). Cherche
dangerouslySetInnerHTML, v-html, [innerHTML], ou les template
literals non echappes qui rendent du contenu utilisateur.
▢ 4.4 — Application des methodes HTTP : Verifie que les
operations qui modifient l'etat utilisent POST/PUT/PATCH/DELETE,
pas GET. Les requetes GET peuvent etre declenchees par des
balises image, le prefetching de liens, et les extensions de
navigateur sans intention de l'utilisateur.
▢ 4.5 — Fuites d'informations dans les erreurs : Verifie que les
reponses d'erreur ne fuient pas de details internes (traces de
pile, erreurs SQL, chemins de fichiers, noms de variables
d'environnement) vers le client. Verifie a la f