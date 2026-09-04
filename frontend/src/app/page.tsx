"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  CircleHelp,
  ExternalLink,
  Globe2,
  Heart,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  rating: string;
  image: string;
  tag?: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Air Max Pulse",
    category: "Mode & sneakers",
    price: "89 900 FCFA",
    oldPrice: "110 000 FCFA",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    tag: "-18%",
  },
  {
    id: 2,
    name: "Sony WH-1000XM5",
    category: "Électronique",
    price: "179 500 FCFA",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85",
    tag: "Populaire",
  },
  {
    id: 3,
    name: "The Ordinary Set",
    category: "Beauté",
    price: "42 000 FCFA",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Kindle Paperwhite",
    category: "Tech & maison",
    price: "95 000 FCFA",
    rating: "4.6",
    image:
      "https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&w=900&q=85",
    tag: "Nouveau",
  },
];

const categories = [
  {
    name: "Mode",
    count: "2 430 articles",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Électronique",
    count: "1 820 articles",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Maison",
    count: "3 100 articles",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Beauté",
    count: "980 articles",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85",
  },
];

export default function Home() {
  const [cart, setCart] = useState<Product[]>([]);
  const [liked, setLiked] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  function addToCart(product: Product) {
    setCart((current) =>
      current.some((item) => item.id === product.id)
        ? current
        : [...current, product],
    );
    setIsCartOpen(true);
  }

  return (
    <div className="site-shell">
      <div className="announcement">
        <Sparkles size={15} /> Livraison offerte dès 75 000 FCFA <span>•</span>{" "}
        Paiement local sécurisé
      </div>
      <header className="nav-wrap">
        <nav className="nav container">
          <button className="mobile-menu" aria-label="Ouvrir le menu">
            <Menu size={22} />
          </button>
          <a className="brand" href="#top">
            <span className="brand-mark">S</span>
            <span>
              shopsense<span className="brand-ai">.ai</span>
            </span>
          </a>
          <div className="nav-links">
            <a href="#catalogue">Catalogue</a>
            <a href="#how-it-works">Comment ça marche</a>
            <a href="#tracking">Suivre une commande</a>
          </div>
          <div className="nav-actions">
            <button className="icon-btn" aria-label="Aide">
              <CircleHelp size={20} />
            </button>
            <button className="login-btn">Se connecter</button>
            <button
              className="cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Ouvrir le panier"
            >
              <ShoppingBag size={20} />
              <span>{cart.length}</span>
            </button>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="pulse-dot" /> SHOP INTELLIGENT
            </div>
            <h1>
              Tout ce que vous aimez,
              <br />
              <em>enfin</em> à portée de main.
            </h1>
            <p>
              Découvrez, comparez et commandez les meilleurs produits du monde.
              Nous nous occupons du reste, jusqu&apos;à votre porte au Sénégal.
            </p>
            <div className="hero-search">
              <Search size={19} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Que recherchez-vous aujourd'hui ?"
              />
              <button
                onClick={() =>
                  document
                    .getElementById("catalogue")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Rechercher
              </button>
            </div>
            <div className="search-hints">
              <span>Recherches populaires</span>
              <button onClick={() => setSearch("sneakers")}>Sneakers</button>
              <button onClick={() => setSearch("casque")}>Casques audio</button>
              <button onClick={() => setSearch("maison")}>Maison</button>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-card card-main">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=90"
                alt="Montre connectée sélectionnée"
              />
              <div className="floating-label">
                <span className="mini-icon">
                  <Check size={14} />
                </span>
                <span>
                  <strong>Prix vérifié</strong>
                  <small>Économisez jusqu'à 30%</small>
                </span>
              </div>
            </div>
            <div className="floating-note">
              <Globe2 size={18} />
              <span>
                Depuis le monde
                <br />
                <strong>jusqu'à Dakar</strong>
              </span>
            </div>
          </div>
        </section>

        <section className="trust-bar">
          <div className="container trust-items">
            <div>
              <Truck size={22} />
              <span>
                <strong>Livraison suivie</strong>
                <small>Partout au Sénégal</small>
              </span>
            </div>
            <div>
              <Package size={22} />
              <span>
                <strong>Prix tout compris</strong>
                <small>Sans mauvaise surprise</small>
              </span>
            </div>
            <div>
              <Bot size={22} />
              <span>
                <strong>Conseil intelligent</strong>
                <small>Une aide à chaque étape</small>
              </span>
            </div>
            <div>
              <Check size={22} />
              <span>
                <strong>Achat sécurisé</strong>
                <small>Paiement local accepté</small>
              </span>
            </div>
          </div>
        </section>

        <section className="section container" id="catalogue">
          <div className="section-heading">
            <div>
              <span className="section-kicker">À EXPLORER</span>
              <h2>Choisissez votre univers</h2>
            </div>
            <a href="#products">
              Voir tout le catalogue <ArrowRight size={16} />
            </a>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <a className="category-card" href="#products" key={category.name}>
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <span>{category.name}</span>
                  <small>{category.count}</small>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="section section-products container" id="products">
          <div className="section-heading">
            <div>
              <span className="section-kicker">SÉLECTION SHOPSENSE</span>
              <h2>Les favoris du moment</h2>
            </div>
            <div className="filter-tabs">
              <button className="active">Pour vous</button>
              <button>Nouveautés</button>
              <button>Meilleures ventes</button>
            </div>
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {product.tag && (
                    <span className="product-tag">{product.tag}</span>
                  )}
                  <button
                    className={`heart ${liked.includes(product.id) ? "liked" : ""}`}
                    onClick={() =>
                      setLiked((current) =>
                        current.includes(product.id)
                          ? current.filter((id) => id !== product.id)
                          : [...current, product.id],
                      )
                    }
                    aria-label="Ajouter aux favoris"
                  >
                    <Heart
                      size={18}
                      fill={
                        liked.includes(product.id) ? "currentColor" : "none"
                      }
                    />
                  </button>
                </div>
                <div className="product-info">
                  <div>
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>
                  </div>
                  <span className="rating">★ {product.rating}</span>
                  <div className="product-bottom">
                    <div>
                      <strong>{product.price}</strong>
                      {product.oldPrice && <del>{product.oldPrice}</del>}
                    </div>
                    <button
                      className="add-btn"
                      onClick={() => addToCart(product)}
                    >
                      Ajouter <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="external-section container" id="how-it-works">
          <div className="external-copy">
            <span className="section-kicker">
              VOTRE TROUVAILLE, NOS SOLUTIONS
            </span>
            <h2>
              Vous avez trouvé
              <br />
              <em>ailleurs ?</em>
            </h2>
            <p>
              Collez le lien d&apos;un produit depuis Amazon, Zara, ASOS ou
              n&apos;importe quelle marketplace. Notre assistant calcule votre
              prix final, livraison comprise.
            </p>
            <div className="marketplace-list">
              <span>amazon</span>
              <span>ASOS</span>
              <span>zara</span>
              <span>eBay</span>
            </div>
          </div>
          <div className="url-box">
            <div className="url-box-head">
              <span className="link-icon">
                <ExternalLink size={17} />
              </span>
              <div>
                <strong>Importer un produit</strong>
                <small>Obtenez une estimation en quelques secondes</small>
              </div>
            </div>
            <div className="url-input">
              <ExternalLink size={17} />
              <input
                value={externalUrl}
                onChange={(event) => setExternalUrl(event.target.value)}
                placeholder="https://www.exemple.com/produit..."
              />
              <button
                onClick={() =>
                  setExternalUrl(externalUrl || "Lien prêt à être analysé")
                }
              >
                Analyser
              </button>
            </div>
            <div className="url-foot">
              <Check size={14} /> Estimation incluant transport, douane et
              livraison locale
            </div>
          </div>
        </section>

        <section className="tracking-section" id="tracking">
          <div className="container tracking-inner">
            <div>
              <span className="section-kicker">TOUJOURS AU COURANT</span>
              <h2>
                Votre commande,
                <br />
                <em>à chaque étape.</em>
              </h2>
            </div>
            <div className="tracking-widget">
              <div className="tracking-number">
                <span>Numéro de suivi</span>
                <strong>SS-2024-08924</strong>
                <span className="in-transit">En transit</span>
              </div>
              <div className="progress-line">
                <span className="done">
                  <Check size={13} />
                </span>
                <i className="filled" />
                <span className="done">
                  <Truck size={14} />
                </span>
                <i />
                <span>
                  <Package size={14} />
                </span>
              </div>
              <div className="tracking-stages">
                <span>
                  <strong>Commande confirmée</strong>
                  <small>12 juin</small>
                </span>
                <span>
                  <strong>En route vers Dakar</strong>
                  <small>16 juin</small>
                </span>
                <span>
                  <strong>Livraison estimée</strong>
                  <small>20 juin</small>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <button
        className="chat-fab"
        onClick={() => setIsChatOpen((open) => !open)}
        aria-label="Ouvrir l'assistant"
      >
        <Bot size={22} />
        <span>Besoin d&apos;aide ?</span>
      </button>
      {isCartOpen && (
        <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)}>
          <aside
            className="cart-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-head">
              <div>
                <span className="section-kicker">VOTRE SÉLECTION</span>
                <h2>Panier ({cart.length})</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} aria-label="Fermer">
                <X />
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="empty-state">
                <ShoppingBag size={30} />
                <p>Votre panier est encore vide.</p>
                <small>Ajoutez un produit pour commencer.</small>
              </div>
            ) : (
              <>
                {cart.map((product) => (
                  <div className="cart-item" key={product.id}>
                    <img src={product.image} alt={product.name} />
                    <div>
                      <strong>{product.name}</strong>
                      <small>{product.category}</small>
                      <span>{product.price}</span>
                    </div>
                  </div>
                ))}
                <div className="cart-total">
                  <span>Sous-total estimé</span>
                  <strong>
                    {cart
                      .reduce(
                        (total, product) =>
                          total + Number(product.price.replace(/[^0-9]/g, "")),
                        0,
                      )
                      .toLocaleString("fr-FR")}{" "}
                    FCFA
                  </strong>
                </div>
                <button className="checkout-btn">
                  Passer au checkout <ArrowRight size={17} />
                </button>
              </>
            )}
          </aside>
        </div>
      )}
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-head">
            <div className="bot-avatar">
              <Bot size={18} />
            </div>
            <div>
              <strong>ShopSense AI</strong>
              <small>En ligne • Répond en quelques secondes</small>
            </div>
            <button onClick={() => setIsChatOpen(false)}>
              <X size={17} />
            </button>
          </div>
          <div className="chat-body">
            <div className="chat-bubble">
              Bonjour ! Je suis votre assistant shopping. Que cherchez-vous
              aujourd&apos;hui ?
            </div>
            <div className="chat-suggestions">
              <button>Comparer des produits</button>
              <button>Calculer une livraison</button>
            </div>
          </div>
          <div className="chat-compose">
            <input placeholder="Écrivez votre message..." />
            <button aria-label="Envoyer">
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
