const STORAGE_KEY = "digibook-data";

const defaults = {
  catalogVersion: 4,
  siteName: "DigiBook",
  currency: "FC",
  whatsapp: "",
  packs: [
    {
      id: crypto.randomUUID(),
      name: "Pack Confiance",
      count: 30,
      price: 1500,
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
      description: "Pack prepare pour plus tard, quand le catalogue atteindra 100 livres.",
      featured: false,
      enabled: false,
      books: "Investissement, Business, Richesse, Discipline",
    },
  ],
  books: [
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

function loadData() {
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

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

function renderPublic() {
  const packList = document.querySelector("#pack-list");
  if (!packList) return;

  const data = loadData();
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
          <div class="price">${formatPrice(pack.price, data.currency)}</div>
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

function renderAdmin() {
  const adminPacks = document.querySelector("#admin-packs");
  if (!adminPacks) return;

  const data = loadData();
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
            <label class="span-3">Thèmes inclus
              <input data-field="books" value="${escapeAttribute(pack.books)}" />
            </label>
            <label class="span-2">Populaire
              <input data-field="featured" type="checkbox" ${pack.featured ? "checked" : ""} />
            </label>
            <label class="span-2">Afficher
              <input data-field="enabled" type="checkbox" ${pack.enabled !== false ? "checked" : ""} />
            </label>
            <label class="span-8">Description
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
      if (field === "count" || field === "price") pack[field] = Number(event.target.value);
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

  document.querySelector("#save-data").addEventListener("click", () => {
    collectBasics();
    saveData(data);
    setStatus("Modifications enregistrees.");
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
      saveData(data);
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
