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
  catalogVersion: 6,
  siteName: "DigiBook",
  currency: "FC",
  whatsapp: "",
  packs: [
    {
      id: crypto.randomUUID(),
      name: "Pack Confiance",
      count: 30,
      price: 1500,
      originalPrice: 2500,
      description: "Une base solide pour travailler l'etat d'esprit, la discipline et l'estime de soi.",
      featured: false,
      enabled: true,
      books: "Confiance en soi, Habitudes, Motivation",
    },
    {
      id: crypto.randomUUID(),
      name: "Pack Croissance",
      count: 50,
      price: 2000,
      originalPrice: 3500,
      description: "Le meilleur equilibre pour progresser en developpement personnel et en finance.",
      featured: true,
      enabled: true,
      books: "Finance personnelle, Productivite, Mindset",
    },
    {
      id: crypto.randomUUID(),
      name: "Pack Investisseur",
      count: 100,
      price: 3000,
      originalPrice: 5000,
      description: "La bibliotheque complete pour progresser en finance, business, communication et developpement personnel.",
      featured: false,
      enabled: true,
      books: "Investissement, Business, Richesse, Discipline",
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

      const settings = settingsResult.data || {};
      return {
        ...structuredClone(defaults),
        siteName: settings.site_name || defaults.siteName,
        currency: settings.currency || defaults.currency,
        whatsapp: settings.whatsapp || defaults.whatsapp,
        packs: packsResult.data?.length ? packsResult.data.map(mapPackFromDb) : defaults.packs,
        books: booksResult.data?.length ? booksResult.data.map(mapBookFromDb) : defaults.books,
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

function mapBookFromDb(book) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    category: book.category,
    cover: book.cover,
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

  const upsertResults = await Promise.all([
    db.from("site_settings").upsert(settings),
    packs.length ? db.from("packs").upsert(packs) : Promise.resolve({ error: null }),
    books.length ? db.from("books").upsert(books) : Promise.resolve({ error: null }),
  ]);

  const upsertError = upsertResults.find((result) => result.error)?.error;
  if (upsertError) throw upsertError;

  const packIds = packs.map((pack) => pack.id);
  const bookIds = books.map((book) => book.id);
  const cleanupResults = await Promise.all([
    packIds.length
      ? db.from("packs").delete().not("id", "in", `(${packIds.join(",")})`)
      : db.from("packs").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    bookIds.length
      ? db.from("books").delete().not("id", "in", `(${bookIds.join(",")})`)
      : db.from("books").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
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
  const visiblePacks = data.packs.filter((pack) => pack.enabled !== false);
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

  const search = document.querySelector("#book-search");
  const filters = document.querySelector("#category-filters");
  const renderCatalog = () => {
    renderCategoryFilters(data.books, activeCategory);
    renderBooks(filterBooks(data.books, searchTerm, activeCategory));
  };

  renderCatalog();

  if (search) {
    search.addEventListener("input", () => {
      searchTerm = search.value.trim().toLowerCase();
      renderCatalog();
    });
  }

  if (filters) {
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      activeCategory = button.dataset.category;
      renderCatalog();
    });
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
}

function renderBooks(books) {
  const bookList = document.querySelector("#book-list");
  if (!bookList) return;

  const count = document.querySelector("#book-count");
  if (count) count.textContent = books.length;

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
    adminPacks.innerHTML = data.packs
      .map(
        (pack, index) => `
          <article class="admin-item" data-pack-index="${index}">
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
            <button class="button danger span-2" data-delete-pack="${index}" type="button">Supprimer</button>
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
  });

  document.addEventListener("click", (event) => {
    const packDelete = event.target.closest("[data-delete-pack]");
    const bookDelete = event.target.closest("[data-delete-book]");

    if (packDelete) {
      data.packs.splice(Number(packDelete.dataset.deletePack), 1);
      draw();
    }

    if (bookDelete) {
      data.books.splice(Number(bookDelete.dataset.deleteBook), 1);
      draw();
    }
  });

  document.querySelector("#add-pack").addEventListener("click", () => {
    data.packs.push({
      id: crypto.randomUUID(),
      name: "Nouveau pack",
      count: 10,
      price: 1000,
      originalPrice: 1500,
      description: "Description du pack.",
      featured: false,
      enabled: true,
      books: "Confiance en soi, Finance",
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
