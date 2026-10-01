const STORAGE_KEY = "catalogo_ids_v1";

// IMPORTANTE: esta versión guarda los datos en el navegador.
// Para un sitio público real con administración segura, conecta este frontend
// a una base de datos/backend (por ejemplo Supabase/Firebase) antes de publicarlo.
const ADMIN_PASSWORD = "MODERACION120";

let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let editingId = null;

const $ = (id) => document.getElementById(id);
const catalog = $("catalog");
const empty = $("empty");
const search = $("search");
const categoryFilter = $("categoryFilter");
const loginDialog = $("loginDialog");
const adminDialog = $("adminDialog");
const toast = $("toast");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

function renderCategories() {
  const current = categoryFilter.value;
  const cats = [...new Set(items.map(x => x.category).filter(Boolean))].sort();
  categoryFilter.innerHTML = '<option value="">Todas las categorías</option>' +
    cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  if (cats.includes(current)) categoryFilter.value = current;
}

function renderCatalog() {
  const q = search.value.trim().toLowerCase();
  const cat = categoryFilter.value;
  const filtered = items.filter(x =>
    (!cat || x.category === cat) &&
    (!q || `${x.id} ${x.name || ""} ${x.category || ""}`.toLowerCase().includes(q))
  );

  catalog.innerHTML = filtered.map(x => `
    <article class="card">
      <img src="${escapeHtml(x.image)}" alt="${escapeHtml(x.name || x.id)}"
           onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22500%22 height=%22500%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23191c27%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 fill=%22white%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-size=%2222%22%3EImagen no disponible%3C/text%3E%3C/svg%3E'">
      <div class="cardBody">
        ${x.name ? `<div class="name">${escapeHtml(x.name)}</div>` : ""}
        ${x.category ? `<div class="meta">${escapeHtml(x.category)}</div>` : ""}
        <div class="id">${escapeHtml(x.id)}</div>
        <div class="actions">
          <button class="primary copyBtn" data-id="${escapeHtml(x.id)}">📋 Copiar ID</button>
        </div>
      </div>
    </article>
  `).join("");

  empty.classList.toggle("hidden", filtered.length !== 0);
}

function renderAdminList() {
  $("adminList").innerHTML = items.length ? items.map(x => `
    <div class="adminItem">
      <img src="${escapeHtml(x.image)}" alt="">
      <div class="adminItemInfo">
        <strong>${escapeHtml(x.name || "Sin nombre")}</strong>
        <span>ID: ${escapeHtml(x.id)}</span>
      </div>
      <button data-edit="${escapeHtml(x.id)}">Editar</button>
      <button class="danger" data-delete="${escapeHtml(x.id)}">Eliminar</button>
    </div>
  `).join("") : '<p class="empty">Todavía no hay elementos.</p>';
}

function renderAll() {
  renderCategories();
  renderCatalog();
  renderAdminList();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

$("adminBtn").onclick = () => {
  $("password").value = "";
  $("loginError").textContent = "";
  loginDialog.showModal();
};

$("loginForm").onsubmit = (e) => {
  e.preventDefault();
  if ($("password").value === ADMIN_PASSWORD) {
    loginDialog.close();
    adminDialog.showModal();
    renderAdminList();
  } else {
    $("loginError").textContent = "Contraseña incorrecta.";
  }
};

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.onclick = () => $(btn.dataset.close).close();
});

$("logout").onclick = () => adminDialog.close();

$("itemImage").oninput = () => {
  const img = $("preview");
  img.src = $("itemImage").value;
  img.style.display = "block";
  img.onerror = () => img.style.display = "none";
};

$("itemForm").onsubmit = (e) => {
  e.preventDefault();
  const id = $("itemId").value.trim();
  const name = $("itemName").value.trim();
  const category = $("itemCategory").value.trim();
  const image = $("itemImage").value.trim();

  if (!id || !image) return;

  if (editingId) {
    const item = items.find(x => x.id === editingId);
    if (item) Object.assign(item, { id, name, category, image });
    editingId = null;
  } else {
    if (items.some(x => x.id === id)) {
      alert("Ese ID ya existe.");
      return;
    }
    items.unshift({ id, name, category, image });
  }

  save();
  e.target.reset();
  $("preview").style.display = "none";
  renderAll();
  showToast("Elemento guardado.");
};

$("cancelEdit").onclick = () => {
  editingId = null;
  $("itemForm").reset();
  $("preview").style.display = "none";
};

$("adminList").onclick = (e) => {
  const edit = e.target.closest("[data-edit]");
  const del = e.target.closest("[data-delete]");

  if (edit) {
    const item = items.find(x => x.id === edit.dataset.edit);
    if (!item) return;
    editingId = item.id;
    $("itemId").value = item.id;
    $("itemName").value = item.name || "";
    $("itemCategory").value = item.category || "";
    $("itemImage").value = item.image;
    $("preview").src = item.image;
    $("preview").style.display = "block";
    $("itemId").focus();
  }

  if (del) {
    if (!confirm("¿Eliminar este elemento?")) return;
    items = items.filter(x => x.id !== del.dataset.delete);
    save();
    renderAll();
    showToast("Elemento eliminado.");
  }
};

catalog.onclick = async (e) => {
  const btn = e.target.closest(".copyBtn");
  if (!btn) return;
  try {
    await navigator.clipboard.writeText(btn.dataset.id);
    showToast("ID copiado.");
  } catch {
    showToast("No se pudo copiar automáticamente.");
  }
};

search.oninput = renderCatalog;
categoryFilter.onchange = renderCatalog;

renderAll();
