const STORAGE_KEY = "digibook-data";

function getSupabaseClient() {
  const config = window.DIGIBOOK_SUPABASE || {};
  if (!config.url || !config.anonKey || !window.supabase) return null;
  if (!window.digibookSupabase) {
    window.digibookSupabase = window.supabase.createClient(config.url, config.anonKey);
  }
  return window.digibookSupabase;
}

const defaults = {
  catalogVersion: 7,
  siteName: "DigiBook",
  currency: "FC",
  whatsapp: "",
  packs: [
    {
      id: crypto.randomUUID(),
      name: "Bibliotheque DigiBook",
      count: 100,
      price: 2100,
      originalPrice: 3500,
      description: "La bibliotheque complete pour progresser en finance, business, communication et developpement personnel.",
      featured: true,
      enabled: true,
      books: "Finance & Business, Developpement personnel, Communication & Influence, Psychologie & Strategie",
    },
  ],
  books: window.DIGIBOOK_CATALOG?.length
    ? structuredClone(window.DIGIBOOK_CATALOG)
    : [
    book("L'ego est l'ennemi", "Ryan Holiday", "Developpement personnel"),
    book("Le Personal MBA", "Josh Kaufman", "Business"),
    book("40 ans de prison ou 5 ans de travail force", "Maxime", "Developpement personnel"),
    book("500 idees de business pour entreprendre", "", "Business"),
    book("Aliko Dangote: les 21 secrets", "Achille Wealth PhD", "Business"),
    book("Arrete la procrastination", "Francis Wayne Jr.", "Productivite"),
    book("Atteindre l'excellence", "Robert Greene", "Developpement personnel"),
    book("Avoir le courage de ne pas etre aime", "", "Confiance en soi"),
    book("Ce que vous avez a dire n'interesse personne", "", "Communication"),
    book("Comment parler en public", "", "Communication"),
    book("Comment se faire des amis", "Dale Carnegie", "Communication"),
    book("Comment attirer le meilleur dans votre vie par la pensee positive", "", "Confiance en soi"),
    book("Comment se faire des amis", "", "Communication"),
    book("Dark Psychology Secrets", "", "Psychologie"),
    book("De l'idee a la creation d'entreprise", "", "Business"),
    book("De zero a un", "Peter Thiel", "Business"),
    book("Decouvrir un sens a sa vie", "Viktor E. Frankl", "Developpement personnel"),
    book("Independance financiere: 19 systemes simples", "Lavoie", "Finance"),
    book("Influence et manipulation: l'art de la persuasion", "Robert Cialdini", "Communication"),
    book("Je suis Kunta", "", "Culture"),
    book("L'art d'avoir toujours raison", "Arthur Schopenhauer", "Strategie"),
    book("L'art de la guerre", "Sun Tzu", "Strategie"),
    book("L'art subtil de s'en foutre", "Mark Manson", "Developpement personnel"),
    book("L'homme le plus riche de Babylone", "George S. Clason", "Finance"),
    book("L'intelligence emotionnelle", "", "Psychologie"),
    book("La chevre de ma mere", "Ricardo Kaniama", "Culture"),
    book("La fabrique de pauvres", "", "Finance"),
    book("La philosophie du succes", "Napoleon Hill", "Developpement personnel"),
    book("La retraite a 40 ans", "Pilotte", "Finance"),
    book("La semaine de 4 heures", "Timothy Ferriss", "Productivite"),
    book("L'art d'avoir toujours raison", "Arthur Schopenhauer", "Strategie"),
    book("Le chemin de la fortune", "", "Finance"),
    book("Le pouvoir des habitudes", "", "Productivite"),
    book("Le quadrant du cashflow", "Robert Kiyosaki", "Finance"),
    book("L'effet cumule", "Darren Hardy", "Productivite"),
    book("Les entrepreneurs de legende", "", "Business"),
    book("Les lois de la nature humaine", "Robert Greene", "Psychologie"),
    book("Les manipulateurs sont parmi nous", "", "Psychologie"),
    book("Les secrets d'un esprit millionnaire", "T. Harv Eker", "Finance"),
    book("Les secrets de la longevite d'un couple", "", "Relations"),
    book("L'investisseur intelligent", "Benjamin Graham", "Finance"),
    book("Manipulation: ne vous laissez plus faire", "", "Psychologie"),
    book("Miracle Morning", "Hal Elrod", "Productivite"),
    book("L'autoroute du millionnaire", "MJ DeMarco", "Finance"),
    book("Ne coupez jamais la poire en deux", "Chris Voss, Tahl Raz", "Communication"),
    book("Ce dont je suis certaine", "Oprah Winfrey", "Confiance en soi"),
    book("Pere riche, pere pauvre", "Robert T. Kiyosaki", "Finance"),
    book("Plus malin que le diable", "Napoleon Hill", "Developpement personnel"),
    book("Plus malin que le diable", "Napoleon Hill", "Developpement personnel"),
    book("Power: les 48 lois du pouvoir", "Robert Greene", "Strategie"),
    book("Pouvez-vous devenir millionnaire et aller au ciel", "R. Kaniama", "Finance"),
    book("Reflechissez et devenez riche", "Napoleon Hill", "Finance"),
    book("L'ecole des affaires", "Robert Kiyosaki", "Business"),
    book("L'art de la seduction", "Robert Greene", "Strategie"),
    book("Self-Made-Man", "", "Business"),
    book("Si tu veux changer ta vie commence par faire ton lit", "", "Developpement personnel"),
    book("Commencer par pourquoi", "Simon Sinek", "Business"),
    book("Systeme 1 / Systeme 2", "Daniel Kahneman", "Psychologie"),
    book("The One Thing", "Gary Keller, Jay Papasan", "Productivite"),
    book("Tout le monde merite d'etre riche", "", "Finance"),
    book("Un an pour gagner un million", "Moran", "Business"),
    book("Un rien peut tout changer", "James Clear", "Productivite"),
  ],
  upcomingProducts: [
    {
      id: crypto.randomUUID(),
      name: "DigiBook Audio",
      productType: "Livres audio",
      description: "Pas le temps de lire ? Aucun souci. Il vous suffit d'une paire d'ecouteurs pour apprendre partout : dans les transports, pendant une marche ou entre deux activites.",
      imageUrl: "",
      status: "Bientot disponible",
      expectedDate: "",
      notifyEnabled: true,
      enabled: true,
    },
  ],
  socialLinks: [],
};

function book(title, author, category) {
  return {
    id: crypto.randomUUID(),
    title,
    author,
    category,
    cover: "",
  };
}

async function loadData() {
  const db = getSupabaseClient();
  if (db) {
    try {
      const [settingsResult, packsResult, booksResult] = await Promise.all([
        db.from("site_settings").select("*").eq("id", "default").maybeSingle(),
        db.from("packs").select("*").order("sort_order", { ascending: true }),
        db.from("books").select("*").order("sort_order", { ascending: true }),
      ]);

      if (settingsResult.error) throw settingsResult.error;
      if (packsResult.error) throw packsResult.error;
      if (booksResult.error) throw booksResult.error;

      const [upcomingResult, socialsResult] = await Promise.all([
        db.from("upcoming_products").select("*").order("sort_order", { ascending: true }),
        db.from("social_links").select("*").order("sort_order", { ascending: true }),
      ]);

      const settings = settingsResult.data || {};
      return {
        ...structuredClone(defaults),
        siteName: settings.site_name || defaults.siteName,
        currency: settings.currency || defaults.currency,
        whatsapp: settings.whatsapp || defaults.whatsapp,
        packs: packsResult.data?.length
          ? normalizeLegacyPacks(packsResult.data.map(mapPackFromDb))
          : defaults.packs,
        books: booksResult.data?.length ? booksResult.data.map(mapBookFromDb) : defaults.books,
        upcomingProducts: upcomingResult.error
          ? defaults.upcomingProducts
          : upcomingResult.data?.length
            ? normalizeUpcomingProducts(upcomingResult.data.map(mapUpcomingFromDb))
            : defaults.upcomingProducts,
        socialLinks: socialsResult.error
          ? defaults.socialLinks
          : (socialsResult.data || []).map(mapSocialFromDb),
      };
    } catch (error) {
      console.warn("Supabase indisponible, fallback local.", error);
    }
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(defaults);

  try {
    const data = JSON.parse(saved);
    if (data.catalogVersion !== defaults.catalogVersion) {
      return {
        ...structuredClone(defaults),
        siteName: data.siteName || defaults.siteName,
        currency: data.currency || defaults.currency,
        whatsapp: data.whatsapp || defaults.whatsapp,
      };
    }
    return {
      ...structuredClone(defaults),
      ...data,
      packs: Array.isArray(data.packs) ? data.packs : defaults.packs,
      books: Array.isArray(data.books) ? data.books : defaults.books,
      upcomingProducts: Array.isArray(data.upcomingProducts)
        ? data.upcomingProducts
        : defaults.upcomingProducts,
      socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : defaults.socialLinks,
    };
  } catch {
    return structuredClone(defaults);
  }
}

async function saveData(data) {
  const db = getSupabaseClient();
  if (db) {
    await saveDataToSupabase(db, data);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function mapPackFromDb(pack) {
  return {
    id: pack.id,
    name: pack.name,
    count: pack.count,
    price: pack.price,
    originalPrice: pack.original_price,
    description: pack.description,
    featured: pack.featured,
    enabled: pack.enabled,
    books: pack.books,
  };
}

function normalizeLegacyPacks(packs) {
  if (packs.length <= 1) return packs;

  const mainPack =
    packs.find((pack) => Number(pack.count) === 100) ||
    packs.sort((a, b) => Number(b.count) - Number(a.count))[0];

  return [
    {
      ...mainPack,
      name: "Bibliotheque DigiBook",
      count: 100,
      price: 2100,
      originalPrice: 3500,
      featured: true,
      enabled: true,
    },
  ];
}

function mapBookFromDb(book) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    category: book.category,
    cover: book.cover,
  };
}

function mapUpcomingFromDb(product) {
  return {
    id: product.id,
    name: product.name,
    productType: product.product_type,
    description: product.description,
    imageUrl: product.image_url,
    status: product.status,
    expectedDate: product.expected_date,
    notifyEnabled: product.notify_enabled,
    enabled: product.enabled,
  };
}

function normalizeUpcomingProducts(products) {
  const legacyDescription =
    "Une selection de livres a ecouter sur telephone, en deplacement ou pendant tes activites.";

  return products.map((product) => {
    if (
      product.name === "Bibliotheque audio" &&
      (!product.description || product.description === legacyDescription)
    ) {
      return {
        ...product,
        name: "DigiBook Audio",
        status: "Bientot disponible",
        description:
          "Pas le temps de lire ? Aucun souci. Il vous suffit d'une paire d'ecouteurs pour apprendre partout : dans les transports, pendant une marche ou entre deux activites.",
      };
    }
    return product;
  });
}

function mapSocialFromDb(link) {
  return {
    id: link.id,
    platform: link.platform,
    label: link.label,
    url: link.url,
    enabled: link.enabled,
  };
}

async function saveDataToSupabase(db, data) {
  const settings = {
    id: "default",
    site_name: data.siteName || "DigiBook",
    currency: data.currency || "FC",
    whatsapp: data.whatsapp || "",
    updated_at: new Date().toISOString(),
  };

  const packs = data.packs.map((pack, index) => ({
    id: pack.id,
    name: pack.name || "Pack",
    count: Number(pack.count || 0),
    price: Number(pack.price || 0),
    original_price: Number(pack.originalPrice || pack.price || 0),
    description: pack.description || "",
    featured: Boolean(pack.featured),
    enabled: pack.enabled !== false,
    books: pack.books || "",
    sort_order: index,
    updated_at: new Date().toISOString(),
  }));

  const books = data.books.map((book, index) => ({
    id: book.id,
    title: book.title || "Livre",
    author: book.author || "",
    category: book.category || "Autres",
    cover: book.cover || "",
    sort_order: index,
    updated_at: new Date().toISOString(),
  }));

  const upcomingProducts = data.upcomingProducts.map((product, index) => ({
    id: product.id,
    name: product.name || "Produit a venir",
    product_type: product.productType || "Autre",
    description: product.description || "",
    image_url: product.imageUrl || "",
    status: product.status || "Arrive bientot",
    expected_date: product.expectedDate || "",
    notify_enabled: product.notifyEnabled !== false,
    enabled: product.enabled !== false,
    sort_order: index,
    updated_at: new Date().toISOString(),
  }));

  const socialLinks = data.socialLinks.map((link, index) => ({
    id: link.id,
    platform: link.platform || "Lien",
    label: link.label || "",
    url: link.url || "",
    enabled: link.enabled !== false,
    sort_order: index,
    updated_at: new Date().toISOString(),
  }));

  const upsertResults = await Promise.all([
    db.from("site_settings").upsert(settings),
    packs.length ? db.from("packs").upsert(packs) : Promise.resolve({ error: null }),
    books.length ? db.from("books").upsert(books) : Promise.resolve({ error: null }),
    upcomingProducts.length
      ? db.from("upcoming_products").upsert(upcomingProducts)
      : Promise.resolve({ error: null }),
    socialLinks.length
      ? db.from("social_links").upsert(socialLinks)
      : Promise.resolve({ error: null }),
  ]);

  const upsertError = upsertResults.find((result) => result.error)?.error;
  if (upsertError) throw upsertError;

  const packIds = packs.map((pack) => pack.id);
  const bookIds = books.map((book) => book.id);
  const upcomingIds = upcomingProducts.map((product) => product.id);
  const socialIds = socialLinks.map((link) => link.id);
  const cleanupResults = await Promise.all([
    packIds.length
      ? db.from("packs").delete().not("id", "in", `(${packIds.join(",")})`)
      : db.from("packs").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    bookIds.length
      ? db.from("books").delete().not("id", "in", `(${bookIds.join(",")})`)
      : db.from("books").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    upcomingIds.length
      ? db.from("upcoming_products").delete().not("id", "in", `(${upcomingIds.join(",")})`)
      : db.from("upcoming_products").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    socialIds.length
      ? db.from("social_links").delete().not("id", "in", `(${socialIds.join(",")})`)
      : db.from("social_links").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
  ]);

  const cleanupError = cleanupResults.find((result) => result.error)?.error;
  if (cleanupError) throw cleanupError;
}

function formatPrice(value, currency) {
  return `${Number(value || 0).toLocaleString("fr-FR")} ${currency || ""}`.trim();
}

function cleanPhone(phone) {
  return String(phone || "").replace(/[^\d]/g, "");
}

function whatsappUrl(data, pack) {
  const text = [
    `Bonjour ${data.siteName || "DigiBook"}, je veux commander:`,
    `${pack.name} - ${pack.count} livres`,
    `Prix: ${formatPrice(pack.price, data.currency)}`,
  ].join("\n");
  const phone = cleanPhone(data.whatsapp);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function fallbackCover(title) {
  const text = encodeURIComponent(title || "DigiBook");
  return `https://placehold.co/480x720/17231f/d7a83f?text=${text}`;
}

async function renderPublic() {
  const packList = document.querySelector("#pack-list");
  if (!packList) return;

  const data = await loadData();
  const enabledPacks = data.packs.filter((pack) => pack.enabled !== false);
  const primaryPack =
    enabledPacks.find((pack) => Number(pack.count) === 100) ||
    enabledPacks.sort((a, b) => Number(b.count) - Number(a.count))[0];
  const visiblePacks = primaryPack ? [primaryPack] : [];
  document.title = `${data.siteName || "DigiBook"} - Packs PDF`;
  document.querySelectorAll(".brand strong").forEach((item) => {
    item.textContent = data.siteName || "DigiBook";
  });

  const metricPackCount = document.querySelector("#metric-pack-count");
  if (metricPackCount) metricPackCount.textContent = visiblePacks.length;

  const quickWhatsapp = document.querySelector("#quick-whatsapp");
  if (quickWhatsapp) {
    quickWhatsapp.href = `https://wa.me/${cleanPhone(data.whatsapp)}`;
    quickWhatsapp.target = "_blank";
    quickWhatsapp.rel = "noopener";
  }

  packList.innerHTML = visiblePacks
    .map(
      (pack) => `
        <article class="pack-card ${pack.featured ? "featured-pack" : ""}">
          <div class="pack-top">
            <div>
              <p class="eyebrow">${pack.featured ? "Le plus demande" : "Pack PDF"}</p>
              <h3>${escapeHtml(pack.name)}</h3>
            </div>
            <span class="pack-count">${Number(pack.count || 0)}</span>
          </div>
          <div class="price promo-price">
            <span class="old-price">${formatPrice(pack.originalPrice || pack.price, data.currency)}</span>
            <span class="new-price">${formatPrice(pack.price, data.currency)}</span>
          </div>
          <p>${escapeHtml(pack.description || "")}</p>
          <ul class="pack-books">
            ${String(pack.books || "")
              .split(",")
              .filter(Boolean)
              .slice(0, 5)
              .map((book) => `<li>${escapeHtml(book.trim())}</li>`)
              .join("")}
          </ul>
          <div class="pack-actions">
            <a class="button primary" target="_blank" rel="noopener" href="${whatsappUrl(data, pack)}">
              Commander
            </a>
          </div>
        </article>
      `,
    )
    .join("") || `<p class="empty-state">Aucun pack disponible pour le moment.</p>`;

  let activeCategory = "Tous";
  let searchTerm = "";
  let catalogPage = 1;
  const booksPerPage = 12;

  const search = document.querySelector("#book-search");
  const filters = document.querySelector("#category-filters");
  const previousBooks = document.querySelector("#previous-books");
  const nextBooks = document.querySelector("#next-books");
  const renderCatalog = () => {
    const filteredBooks = filterBooks(data.books, searchTerm, activeCategory);
    const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
    catalogPage = Math.min(catalogPage, totalPages);
    const start = (catalogPage - 1) * booksPerPage;
    renderCategoryFilters(data.books, activeCategory);
    renderBooks(filteredBooks.slice(start, start + booksPerPage), filteredBooks.length);
    renderCatalogPagination(catalogPage, totalPages);
  };

  renderCatalog();

  if (search) {
    search.addEventListener("input", () => {
      searchTerm = search.value.trim().toLowerCase();
      catalogPage = 1;
      renderCatalog();
    });
  }

  if (filters) {
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      activeCategory = button.dataset.category;
      catalogPage = 1;
      renderCatalog();
    });
  }

  previousBooks?.addEventListener("click", () => {
    if (catalogPage <= 1) return;
    catalogPage -= 1;
    renderCatalog();
    document.querySelector("#catalogue")?.scrollIntoView({ behavior: "smooth" });
  });

  nextBooks?.addEventListener("click", () => {
    catalogPage += 1;
    renderCatalog();
    document.querySelector("#catalogue")?.scrollIntoView({ behavior: "smooth" });
  });

  renderUpcoming(data);
  renderSocialLinks(data.socialLinks);

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
}

function renderUpcoming(data) {
  const list = document.querySelector("#upcoming-list");
  if (!list) return;

  const products = data.upcomingProducts.filter((product) => product.enabled !== false);
  list.innerHTML =
    products
      .map((product) => {
        const message = encodeURIComponent(
          `Bonjour ${data.siteName || "DigiBook"}, je souhaite etre informe pour: ${product.name}.`,
        );
        const notifyUrl = `https://wa.me/${cleanPhone(data.whatsapp)}?text=${message}`;
        return `
          <article class="upcoming-card">
            <div class="upcoming-visual">
              ${
                product.imageUrl
                  ? `<img src="${escapeAttribute(product.imageUrl)}" alt="${escapeAttribute(product.name)}" loading="lazy" />`
                  : `<span aria-hidden="true">${escapeHtml(getInitials(product.name))}</span>`
              }
            </div>
            <div class="upcoming-body">
              <div class="upcoming-meta">
                <span>${escapeHtml(product.productType || "Nouveau produit")}</span>
                <strong>${escapeHtml(product.status || "Arrive bientot")}</strong>
              </div>
              <h3>${escapeHtml(product.name)}</h3>
              <p>${escapeHtml(product.description || "")}</p>
              ${product.expectedDate ? `<small>Prevu: ${escapeHtml(product.expectedDate)}</small>` : ""}
              ${
                product.notifyEnabled
                  ? `<a class="button small" href="${notifyUrl}" target="_blank" rel="noopener">Me prevenir</a>`
                  : ""
              }
            </div>
          </article>
        `;
      })
      .join("") || `<p class="empty-state">De nouvelles offres sont en preparation.</p>`;
}

function renderSocialLinks(links) {
  const container = document.querySelector("#social-links");
  if (!container) return;

  container.innerHTML = links
    .filter((link) => link.enabled !== false && link.url)
    .map(
      (link) => `
        <a href="${escapeAttribute(link.url)}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(link.label || link.platform)}
        </a>
      `,
    )
    .join("");
}

function renderBooks(books, totalCount = books.length) {
  const bookList = document.querySelector("#book-list");
  if (!bookList) return;

  const count = document.querySelector("#book-count");
  if (count) count.textContent = totalCount;

  bookList.innerHTML =
    books
      .map(
        (book) => `
          <article class="book-card">
            <span class="book-icon" aria-hidden="true">${escapeHtml(getInitials(book.title))}</span>
            <div class="book-body">
              <div class="book-meta">${escapeHtml(book.category || "PDF")}</div>
              <h3>${escapeHtml(book.title || "Livre sans titre")}</h3>
              <p>${escapeHtml(book.author || "Auteur non precise")}</p>
            </div>
          </article>
        `,
      )
      .join("") || `<p>Aucun livre trouve.</p>`;
}

function renderCatalogPagination(currentPage, totalPages) {
  const pagination = document.querySelector("#catalog-pagination");
  const previous = document.querySelector("#previous-books");
  const next = document.querySelector("#next-books");
  const status = document.querySelector("#catalog-page-status");
  if (!pagination || !previous || !next || !status) return;

  pagination.classList.toggle("hidden", totalPages <= 1);
  previous.disabled = currentPage <= 1;
  next.disabled = currentPage >= totalPages;
  status.textContent = `Page ${currentPage} sur ${totalPages}`;
}

function filterBooks(books, term, category) {
  return books.filter((book) => {
    const matchesCategory = category === "Tous" || book.category === category;
    const matchesTerm = [book.title, book.author, book.category].some((value) =>
      String(value || "").toLowerCase().includes(term),
    );
    return matchesCategory && matchesTerm;
  });
}

function renderCategoryFilters(books, activeCategory) {
  const filters = document.querySelector("#category-filters");
  if (!filters) return;

  const counts = books.reduce(
    (acc, book) => {
      const category = book.category || "Autres";
      acc[category] = (acc[category] || 0) + 1;
      acc.Tous += 1;
      return acc;
    },
    { Tous: 0 },
  );

  const categories = Object.keys(counts).sort((a, b) => {
    if (a === "Tous") return -1;
    if (b === "Tous") return 1;
    return a.localeCompare(b, "fr");
  });

  filters.innerHTML = categories
    .map(
      (category) => `
        <button class="filter-pill ${category === activeCategory ? "is-active" : ""}" data-category="${escapeAttribute(category)}" type="button">
          ${escapeHtml(category)} (${counts[category]})
        </button>
      `,
    )
    .join("");
}

function getInitials(title = "") {
  return String(title)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

async function requireAdminSession(db) {
  const login = document.querySelector("#admin-login");
  const content = document.querySelector("#admin-content");
  const logout = document.querySelector("#logout-button");
  const form = document.querySelector("#login-form");
  const status = document.querySelector("#login-status");
  const { data } = await db.auth.getSession();

  if (data.session) {
    login?.classList.add("hidden");
    content?.classList.remove("hidden");
    logout?.classList.remove("hidden");
    logout?.addEventListener("click", async () => {
      await db.auth.signOut();
      window.location.reload();
    });
    return true;
  }

  content?.classList.add("hidden");
  login?.classList.remove("hidden");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (status) status.textContent = "Connexion...";
    const email = document.querySelector("#login-email")?.value.trim();
    const password = document.querySelector("#login-password")?.value;
    const result = await db.auth.signInWithPassword({ email, password });
    if (result.error) {
      if (status) status.textContent = result.error.message;
      return;
    }
    window.location.reload();
  });

  return false;
}

async function renderAdmin() {
  const adminPacks = document.querySelector("#admin-packs");
  if (!adminPacks) return;

  const db = getSupabaseClient();
  if (db) {
    const canContinue = await requireAdminSession(db);
    if (!canContinue) return;
  } else {
    document.querySelector("#admin-login")?.classList.add("hidden");
    document.querySelector("#admin-content")?.classList.remove("hidden");
  }

  const data = await loadData();
  const siteName = document.querySelector("#site-name");
  const currency = document.querySelector("#currency");
  const whatsapp = document.querySelector("#whatsapp");

  siteName.value = data.siteName || "";
  currency.value = data.currency || "";
  whatsapp.value = data.whatsapp || "";

  const collectBasics = () => {
    data.siteName = siteName.value.trim();
    data.currency = currency.value.trim();
    data.whatsapp = whatsapp.value.trim();
  };

  const draw = () => {
    const primaryPackIndex = Math.max(
      0,
      data.packs.findIndex((pack) => Number(pack.count) === 100),
    );
    const primaryPack = data.packs[primaryPackIndex] || defaults.packs[0];

    adminPacks.innerHTML = [primaryPack]
      .map(
        (pack) => `
          <article class="admin-item" data-pack-index="${primaryPackIndex}">
            <label class="span-3">Nom
              <input data-field="name" value="${escapeAttribute(pack.name)}" />
            </label>
            <label class="span-2">Nombre
              <input data-field="count" type="number" min="1" value="${escapeAttribute(pack.count)}" />
            </label>
            <label class="span-2">Prix
              <input data-field="price" type="number" min="0" value="${escapeAttribute(pack.price)}" />
            </label>
            <label class="span-2">Avant promo
              <input data-field="originalPrice" type="number" min="0" value="${escapeAttribute(pack.originalPrice || pack.price)}" />
            </label>
            <label class="span-3">Themes inclus
              <input data-field="books" value="${escapeAttribute(pack.books)}" />
            </label>
            <label class="span-2">Populaire
              <input data-field="featured" type="checkbox" ${pack.featured ? "checked" : ""} />
            </label>
            <label class="span-2">Afficher
              <input data-field="enabled" type="checkbox" ${pack.enabled !== false ? "checked" : ""} />
            </label>
            <label class="span-6">Description
              <textarea data-field="description">${escapeHtml(pack.description)}</textarea>
            </label>
            <p class="span-2 admin-hint">Cette offre est la seule affichee sur le site.</p>
          </article>
        `,
      )
      .join("");

    document.querySelector("#admin-upcoming").innerHTML = data.upcomingProducts
      .map(
        (product, index) => `
          <article class="admin-item" data-upcoming-index="${index}">
            <label class="span-3">Nom
              <input data-field="name" value="${escapeAttribute(product.name)}" />
            </label>
            <label class="span-2">Type
              <input data-field="productType" value="${escapeAttribute(product.productType)}" placeholder="Livres audio" />
            </label>
            <label class="span-2">Statut
              <input data-field="status" value="${escapeAttribute(product.status)}" placeholder="Arrive bientot" />
            </label>
            <label class="span-2">Date prevue
              <input data-field="expectedDate" value="${escapeAttribute(product.expectedDate)}" placeholder="Fin 2026" />
            </label>
            <label class="span-3">Image (URL)
              <input data-field="imageUrl" value="${escapeAttribute(product.imageUrl)}" />
            </label>
            <label class="span-8">Description
              <textarea data-field="description">${escapeHtml(product.description)}</textarea>
            </label>
            <label class="span-2">Me prevenir
              <input data-field="notifyEnabled" type="checkbox" ${product.notifyEnabled !== false ? "checked" : ""} />
            </label>
            <label class="span-2">Afficher
              <input data-field="enabled" type="checkbox" ${product.enabled !== false ? "checked" : ""} />
            </label>
            <button class="button danger span-2" data-delete-upcoming="${index}" type="button">Supprimer</button>
          </article>
        `,
      )
      .join("");

    document.querySelector("#admin-socials").innerHTML = data.socialLinks
      .map(
        (link, index) => `
          <article class="admin-item" data-social-index="${index}">
            <label class="span-3">Plateforme
              <input data-field="platform" value="${escapeAttribute(link.platform)}" placeholder="Facebook" />
            </label>
            <label class="span-3">Libelle
              <input data-field="label" value="${escapeAttribute(link.label)}" placeholder="Suivre sur Facebook" />
            </label>
            <label class="span-4">Lien
              <input data-field="url" type="url" value="${escapeAttribute(link.url)}" placeholder="https://..." />
            </label>
            <label class="span-2">Afficher
              <input data-field="enabled" type="checkbox" ${link.enabled !== false ? "checked" : ""} />
            </label>
            <button class="button danger span-2" data-delete-social="${index}" type="button">Supprimer</button>
          </article>
        `,
      )
      .join("");

    document.querySelector("#admin-books").innerHTML = data.books
      .map(
        (book, index) => `
          <article class="admin-item" data-book-index="${index}">
            <label class="span-3">Titre
              <input data-field="title" value="${escapeAttribute(book.title)}" />
            </label>
            <label class="span-3">Auteur
              <input data-field="author" value="${escapeAttribute(book.author)}" />
            </label>
            <label class="span-2">Catégorie
              <input data-field="category" value="${escapeAttribute(book.category)}" />
            </label>
            <label class="span-4">Image de couverture
              <input data-field="cover" value="${escapeAttribute(book.cover)}" />
            </label>
            <button class="button danger span-2" data-delete-book="${index}" type="button">Supprimer</button>
          </article>
        `,
      )
      .join("");
  };

  draw();

  document.addEventListener("input", (event) => {
    collectBasics();
    const packItem = event.target.closest("[data-pack-index]");
    const bookItem = event.target.closest("[data-book-index]");
    const upcomingItem = event.target.closest("[data-upcoming-index]");
    const socialItem = event.target.closest("[data-social-index]");
    const field = event.target.dataset.field;

    if (packItem && field) {
      const pack = data.packs[Number(packItem.dataset.packIndex)];
      pack[field] = ["featured", "enabled"].includes(field)
        ? event.target.checked
        : event.target.value;
      if (field === "count" || field === "price" || field === "originalPrice") {
        pack[field] = Number(event.target.value);
      }
    }

    if (bookItem && field) {
      const book = data.books[Number(bookItem.dataset.bookIndex)];
      book[field] = event.target.value;
    }

    if (upcomingItem && field) {
      const product = data.upcomingProducts[Number(upcomingItem.dataset.upcomingIndex)];
      product[field] = ["notifyEnabled", "enabled"].includes(field)
        ? event.target.checked
        : event.target.value;
    }

    if (socialItem && field) {
      const link = data.socialLinks[Number(socialItem.dataset.socialIndex)];
      link[field] = field === "enabled" ? event.target.checked : event.target.value;
    }
  });

  document.addEventListener("click", (event) => {
    const packDelete = event.target.closest("[data-delete-pack]");
    const bookDelete = event.target.closest("[data-delete-book]");
    const upcomingDelete = event.target.closest("[data-delete-upcoming]");
    const socialDelete = event.target.closest("[data-delete-social]");

    if (packDelete) {
      data.packs.splice(Number(packDelete.dataset.deletePack), 1);
      draw();
    }

    if (bookDelete) {
      data.books.splice(Number(bookDelete.dataset.deleteBook), 1);
      draw();
    }

    if (upcomingDelete) {
      data.upcomingProducts.splice(Number(upcomingDelete.dataset.deleteUpcoming), 1);
      draw();
    }

    if (socialDelete) {
      data.socialLinks.splice(Number(socialDelete.dataset.deleteSocial), 1);
      draw();
    }
  });

  document.querySelector("#add-upcoming")?.addEventListener("click", () => {
    data.upcomingProducts.push({
      id: crypto.randomUUID(),
      name: "Nouveau produit",
      productType: "Livres audio",
      description: "",
      imageUrl: "",
      status: "Arrive bientot",
      expectedDate: "",
      notifyEnabled: true,
      enabled: true,
    });
    draw();
  });

  document.querySelector("#add-social")?.addEventListener("click", () => {
    data.socialLinks.push({
      id: crypto.randomUUID(),
      platform: "Facebook",
      label: "",
      url: "",
      enabled: true,
    });
    draw();
  });

  document.querySelector("#add-book").addEventListener("click", () => {
    data.books.push({
      id: crypto.randomUUID(),
      title: "Nouveau livre",
      author: "Auteur",
      category: "Categorie",
      cover: "",
    });
    draw();
  });

  document.querySelector("#sync-default-catalog")?.addEventListener("click", async () => {
    const sourceCatalog = window.DIGIBOOK_CATALOG || [];
    if (sourceCatalog.length !== 100) {
      setStatus(`Catalogue source invalide: ${sourceCatalog.length} livres trouves.`);
      return;
    }

    data.books = structuredClone(sourceCatalog);
    const premiumPack = data.packs.find((pack) => Number(pack.count) === 100);
    if (premiumPack) {
      data.packs = [premiumPack];
      premiumPack.name = "Bibliotheque DigiBook";
      premiumPack.price = 2100;
      premiumPack.originalPrice = 3500;
      premiumPack.featured = true;
      premiumPack.enabled = true;
      premiumPack.description =
        "La bibliotheque complete pour progresser en finance, business, communication et developpement personnel.";
    }

    draw();
    try {
      await saveData(data);
      setStatus("Catalogue de 100 livres synchronise avec Supabase.");
    } catch (error) {
      setStatus(`Erreur: ${error.message || "synchronisation impossible"}`);
    }
  });

  document.querySelector("#save-data").addEventListener("click", () => {
    collectBasics();
    saveData(data)
      .then(() => setStatus("Modifications enregistrees."))
      .catch((error) => setStatus(`Erreur: ${error.message || "sauvegarde impossible"}`));
  });

  document.querySelector("#export-data").addEventListener("click", () => {
    collectBasics();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "digibook-catalogue.json";
    link.click();
    URL.revokeObjectURL(link.href);
  });

  document.querySelector("#import-data").addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      Object.assign(data, imported);
      await saveData(data);
      renderAdmin();
      setStatus("Catalogue importe.");
    } catch {
      setStatus("Le fichier importe n'est pas valide.");
    }
  });
}

function setStatus(message) {
  const status = document.querySelector("#save-status");
  if (!status) return;
  status.textContent = message;
  window.setTimeout(() => {
    status.textContent = "";
  }, 2600);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

renderPublic();
renderAdmin();
