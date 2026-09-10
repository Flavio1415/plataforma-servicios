// Carga inicial de trabajadores de ejemplo
const initialWorkers = [
    {
        id: "1",
        name: "Mario Salvatierra",
        category: "Electricidad",
        phone: "59178012345",
        zone: "Barrio San Antonio",
        schedule: "Lun a Sab: 07:30 - 19:00",
        experience: "Más de 10 años instalando tableros residenciales, acometidas y reparación de motores.",
        status: "approved",
        verified: true,
        featured: true,
        photo: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80",
        gallery: []
    },
    {
        id: "2",
        name: "Roberto Chuvé",
        category: "Carpintería",
        phone: "59176098765",
        zone: "Centro Chiquitano",
        schedule: "Lun a Vier: 08:00 - 17:00",
        experience: "Fabricación de muebles en maderas nativas, puertas talladas, ventanas y restauración.",
        status: "approved",
        verified: true,
        featured: false,
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        gallery: []
    }
];

function getWorkers() {
    const data = localStorage.getItem('chiquitos_workers');
    if (!data) {
        localStorage.setItem('chiquitos_workers', JSON.stringify(initialWorkers));
        return initialWorkers;
    }
    return JSON.parse(data);
}

function saveWorkers(workers) {
    localStorage.setItem('chiquitos_workers', JSON.stringify(workers));
}

// Crear el HTML de la tarjeta mostrando la FOTO
function createWorkerCardHTML(worker) {
    const profileImg = worker.photo && worker.photo.trim() !== "" 
        ? worker.photo 
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

    return `
        <div class="worker-card ${worker.featured ? 'featured' : ''}">
            ${worker.featured ? '<span class="badge-featured">★ Destacado</span>' : ''}
            <div class="worker-header">
                <img src="${profileImg}" alt="${worker.name}" class="worker-avatar">
                <div class="worker-info">
                    <h3>${worker.name} ${worker.verified ? '<span class="badge-verified" title="Perfil Verificado">✔</span>' : ''}</h3>
                    <span class="worker-category">${worker.category}</span>
                </div>
            </div>
            <div class="worker-body">
                <div class="worker-detail">📍 Zona: ${worker.zone}</div>
                <div class="worker-detail">🕒 Horario: ${worker.schedule}</div>
                <p style="font-size: 0.85rem; color: #475569; margin: 0.8rem 0;">${worker.experience.substring(0, 80)}...</p>
                
                <a href="perfil.html?id=${worker.id}" class="btn-primary" style="width: 100%; text-align: center; margin-bottom: 0.5rem; display: block; background: var(--secondary); color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px;">
                    Ver Hoja de Vida
                </a>
                
                <a href="https://wa.me/${worker.phone}?text=Hola%20${encodeURIComponent(worker.name)},%20te%20contacto%20desde%20la%20Plataforma%20Técnica." target="_blank" class="btn-whatsapp">
                    💬 Contactar por WhatsApp
                </a>
            </div>
        </div>
    `;
}

// Mostrar destacados en el Inicio
function renderFeaturedWorkers() {
    const container = document.getElementById('featured-workers');
    if (!container) return;
    const workers = getWorkers().filter(w => w.status === 'approved' && w.featured);
    container.innerHTML = workers.length > 0 
        ? workers.map(createWorkerCardHTML).join('') 
        : '<p>No hay técnicos destacados por el momento.</p>';
}

// Filtro completo para el Directorio
function filterWorkers() {
    const container = document.getElementById('all-workers');
    if (!container) return;
    
    const catInput = document.getElementById('filter-category');
    const searchInput = document.getElementById('filter-search');

    const cat = catInput ? catInput.value : '';
    const search = searchInput ? searchInput.value.toLowerCase() : '';
    
    const filtered = getWorkers().filter(w => {
        const isApproved = w.status === 'approved';
        const matchesCat = !cat || w.category === cat;
        const matchesSearch = !search || w.name.toLowerCase().includes(search) || w.zone.toLowerCase().includes(search);
        return isApproved && matchesCat && matchesSearch;
    });

    container.innerHTML = filtered.length > 0 
        ? filtered.map(createWorkerCardHTML).join('') 
        : '<p>No se encontraron técnicos registrados con esos criterios.</p>';
}
function renderProfileDetail() {
    const cardContainer = document.getElementById('profile-card');
    const errorContainer = document.getElementById('profile-error');
    if (!cardContainer) return;
    
    // Obtener el ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const workerId = urlParams.get('id');
    const workers = getWorkers();
    
    // Buscar al trabajador por ID o mostrar el primero registrado
    let worker = workers.find(w => w.id === workerId);
    if (!worker && workers.length > 0) {
        worker = workers[0];
    }

    if (!worker) {
        cardContainer.style.display = 'none';
        errorContainer.style.display = 'block';
        return;
    }

    // Cargar los datos en los elementos HTML
    const defaultPhoto = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
    document.getElementById('worker-img').src = (worker.photo && worker.photo.trim() !== "") ? worker.photo : defaultPhoto;
    document.getElementById('worker-name').textContent = worker.name + (worker.verified ? ' ✔' : '');
    document.getElementById('worker-category').textContent = worker.category;
    document.getElementById('worker-zone').textContent = worker.zone;
    document.getElementById('worker-schedule').textContent = worker.schedule;
    document.getElementById('worker-experience').textContent = worker.experience;

    // Enlace de WhatsApp
    const waMessage = encodeURIComponent("Hola " + worker.name + ", te contacto desde la Plataforma Técnica para consultar sobre tus servicios.");
    document.getElementById('worker-whatsapp').href = "https://wa.me/" + worker.phone + "?text=" + waMessage;
}
// Mostrar Hoja de Vida individual



// PROCESAR FORMULARIO
async function submitWorkerForm(e) {
    e.preventDefault();

    const fileInput = document.getElementById('photo-file');
    let photoData = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80";

    if (fileInput.files && fileInput.files[0]) {
        try {
            photoData = await convertFileToBase64(fileInput.files[0]);
        } catch (error) {
            console.error("Error al procesar la foto:", error);
        }
    }

    const newWorker = {
        id: Date.now().toString(),
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        phone: document.getElementById('phone').value,
        zone: document.getElementById('zone').value,
        schedule: document.getElementById('schedule').value,
        experience: document.getElementById('experience').value,
        photo: photoData,
        status: "pending",
        verified: false,
        featured: false,
        gallery: []
    };

    const workers = getWorkers();
    workers.push(newWorker);
    saveWorkers(workers);

    alert("¡Registro enviado con éxito! Pasará a revisión por el administrador.");
    window.location.href = "index.html";
}

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// PANEL ADMIN: Mostrar lista con botón para Aprobar, Destacar y Eliminar
function renderAdminTable() {
    const tableBody = document.getElementById('admin-table-body');
    if (!tableBody) return;

    const workers = getWorkers();

    if (workers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 1rem;">No hay registros disponibles.</td></tr>';
        return;
    }

    tableBody.innerHTML = workers.map(worker => {
        const photo = worker.photo || 'https://via.placeholder.com/40';
        const isApproved = worker.status === 'approved';

        return `
            <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 10px;">
                    <img src="${photo}" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;">
                </td>
                <td style="padding: 10px; font-weight: bold;">${worker.name}</td>
                <td style="padding: 10px;">${worker.category}</td>
                <td style="padding: 10px;">
                    <span style="padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; background: ${isApproved ? '#DCFCE7' : '#FEF3C7'}; color: ${isApproved ? '#166534' : '#92400E'};">
                        ${isApproved ? 'Aprobado' : 'Pendiente'}
                    </span>
                </td>
                <td style="padding: 10px; text-align: center; white-space: nowrap;">
                    ${!isApproved ? `
                        <button onclick="approveWorker('${worker.id}')" style="background: #22C55E; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">
                            ✓ Aprobar
                        </button>
                    ` : ''}
                    <button onclick="toggleFeatured('${worker.id}')" style="background: ${worker.featured ? '#EAB308' : '#64748B'}; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">
                        ${worker.featured ? '★ Quitar Destacado' : '☆ Destacar'}
                    </button>
                    <button onclick="deleteWorker('${worker.id}')" style="background: #EF4444; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">
                        🗑️ Eliminar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Cambiar estado a aprobado
function approveWorker(id) {
    let workers = getWorkers();
    workers = workers.map(w => w.id === id ? { ...w, status: 'approved' } : w);
    saveWorkers(workers);
    renderAdminTable();
}

// Activar / Desactivar opción de Destacado
function toggleFeatured(id) {
    let workers = getWorkers();
    workers = workers.map(w => w.id === id ? { ...w, featured: !w.featured } : w);
    saveWorkers(workers);
    renderAdminTable();
}

// Eliminar trabajador
function deleteWorker(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta hoja de vida?")) {
        let workers = getWorkers();
        workers = workers.filter(w => w.id !== id);
        saveWorkers(workers);
        renderAdminTable();
    }
}