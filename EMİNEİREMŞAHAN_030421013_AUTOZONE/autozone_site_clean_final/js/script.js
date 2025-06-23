
// Global araç verileri
const baseCars = [
    {
        id: 1,
        brand: "Toyota",
        model: "Corolla",
        year: 2023,
        price: 850000,
        km: 15000,
        fuel: "Hybrid",
        transmission: "Otomatik",
        color: "Beyaz",
        city: "İstanbul",
        district: "Kadıköy",
        description: "Az kullanılmış, temiz Toyota Corolla.",
        isFeatured: true,
        phone: "0532 123 45 67",
        seller: "Ahmet Yılmaz",
        image: "images/default.jpg"
    },
    {
        id: 2,
        brand: "BMW",
        model: "320i",
        year: 2022,
        price: 1250000,
        km: 25000,
        fuel: "Benzin",
        transmission: "Otomatik",
        color: "Siyah",
        city: "Ankara",
        district: "Çankaya",
        description: "Bakımlı BMW 320i. Hasar kaydı yoktur.",
        isFeatured: true,
        phone: "0533 234 56 78",
        seller: "Mehmet Demir",
        image: "images/default.jpg"
    }
];

// Marka - model eşleştirmeleri
const brandModels = {
    "Audi": ["A3", "A4", "Q3", "Q5"],
    "BMW": ["320i", "520i", "X3"],
    "Toyota": ["Corolla", "Camry"],
    "Mercedes": ["C200", "E200"],
    "Honda": ["Civic", "Accord"],
    "Volkswagen": ["Golf", "Passat"]
};

// Tüm araçları al (sabit + userCars)
function getAllCars() {
    const userCars = JSON.parse(localStorage.getItem("userCars") || "[]");
    return baseCars.concat(userCars);
}

// Sayıya TL formatı
function formatPrice(price) {
    return price.toLocaleString("tr-TR");
}

function formatNumber(num) {
    return num.toLocaleString("tr-TR");
}

// Kart oluştur
function createCarCard(car) {
    return `
    <div class="car-card" onclick="showCarDetails(${car.id})">
        <div class="car-image">
            <img src="${car.image || 'images/default.jpg'}" alt="${car.brand} ${car.model}" style="width: 100%; height: 100%; object-fit: cover;"></div>
        <div class="car-info">
            <h3>${car.brand} ${car.model}</h3>
            <div class="car-details">
                <span>Yıl: ${car.year}</span>
                <span>KM: ${formatNumber(car.km)}</span>
                <span>Yakıt: ${car.fuel}</span>
                <span>Vites: ${car.transmission}</span>
            </div>
            <div class="car-price">${formatPrice(car.price)} TL</div>
            <div class="car-location"><i class="fas fa-map-marker-alt"></i> ${car.district}, ${car.city}</div>
        </div>
    </div>`;
}

// Arama (index.html -> listings.html yönlendirme)
function searchCars() {
    const brand = document.getElementById("brand")?.value || "";
    const model = document.getElementById("model")?.value || "";
    const year = document.getElementById("year")?.value || "";
    const priceMin = document.getElementById("priceMin")?.value || "";
    const priceMax = document.getElementById("priceMax")?.value || "";

    const params = new URLSearchParams();
    if (brand) params.append("brand", brand);
    if (model) params.append("model", model);
    if (year) params.append("year", year);
    if (priceMin) params.append("priceMin", priceMin);
    if (priceMax) params.append("priceMax", priceMax);

    window.location.href = `listings.html?${params.toString()}`;
}

// Marka filtreleme (index → listings)
function searchByBrand(brand) {
    window.location.href = `listings.html?brand=${brand}`;
}

// Model güncelle (markaya göre)
function updateModelOptions() {
    const brandSelect = document.getElementById("brand");
    const modelSelect = document.getElementById("model");
    if (!brandSelect || !modelSelect) return;

    const selectedBrand = brandSelect.value;
    modelSelect.innerHTML = '<option value="">Model Seçin</option>';

    if (selectedBrand && brandModels[selectedBrand]) {
        brandModels[selectedBrand].forEach(model => {
            const opt = document.createElement("option");
            opt.value = model;
            opt.textContent = model;
            modelSelect.appendChild(opt);
        });
    }
}

// Araç detayları için modal (placeholder)
function showCarDetails(id) {
    const cars = getAllCars();
    const car = cars.find(c => c.id == id);
    if (!car) return;

    alert(`${car.brand} ${car.model} - ${car.year}`);
}

// Sayfa yüklendiğinde
document.addEventListener("DOMContentLoaded", () => {
    const brandSelect = document.getElementById("brand");
    if (brandSelect) brandSelect.addEventListener("change", updateModelOptions);
});


document.addEventListener("DOMContentLoaded", () => {
    const brand = document.getElementById("brand");
    if (brand) {
        brand.addEventListener("change", updateModelOptions);
        updateModelOptions(); // sayfa yüklendiğinde model listesini yükle
    }
});

function toggleFavorite(event, id) {
    event.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    const btn = document.querySelector(`[data-id="${id}"]`);
    if (btn) btn.classList.toggle("active");

    // Eğer favoriler sayfasındaysak yeniden çiz
    if (window.location.pathname.includes("favorites.html")) {
        renderFavorites();
    }
}


function createCarCard(car) {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isFavorite = favorites.includes(car.id);

    return `
    <div class="car-card" onclick="showCarDetails(${car.id})">
        <div class="car-image">
            <img src="${car.image || 'images/default.jpg'}" alt="${car.brand} ${car.model}" style="width: 100%; height: 100%; object-fit: cover;"><button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${car.id}" onclick="toggleFavorite(event, ${car.id})">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="car-info">
            <h3>${car.brand} ${car.model}</h3>
            <div class="car-details">
                <span>Yıl: ${car.year}</span>
                <span>KM: ${formatNumber(car.km)}</span>
                <span>Yakıt: ${car.fuel}</span>
                <span>Vites: ${car.transmission}</span>
            </div>
            <div class="car-price">${formatPrice(car.price)} TL</div>
            <div class="car-location"><i class="fas fa-map-marker-alt"></i> ${car.district}, ${car.city}</div>
        </div>
    </div>`;
}


document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const nav = document.querySelector(".nav");

    if (user && nav) {
        const existingFav = [...nav.children].find(a => a.textContent.includes("Favorilerim"));
        if (!existingFav) {
            const favLink = document.createElement("a");
            favLink.href = "favorites.html";
            favLink.className = "nav-link";
            favLink.textContent = "Favorilerim";

            const registerLink = [...nav.children].find(a => a.textContent.includes("Üye Ol"));
            if (registerLink) {
                nav.insertBefore(favLink, registerLink);
            } else {
                nav.appendChild(favLink);
            }
        }
    }
});

function renderFavorites() {
    const allCars = getAllCars();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const container = document.getElementById("favoritesContainer");

    if (!container) return;

    const favoriteCars = allCars.filter(car => favorites.includes(car.id));
    if (favoriteCars.length === 0) {
        container.innerHTML = "<p style='padding:2rem;'>Henüz favori eklenmemiş.</p>";
    } else {
        container.innerHTML = favoriteCars.map(createCarCard).join('');
    }
}


// Sıralama işlemi
document.addEventListener("DOMContentLoaded", () => {
    const sortSelect = document.getElementById("sortBy");
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            const sortType = sortSelect.value;
            const allCars = getAllCars();
            let sorted = [...allCars];

            switch (sortType) {
                case "price-asc":
                    sorted.sort((a, b) => a.price - b.price);
                    break;
                case "price-desc":
                    sorted.sort((a, b) => b.price - a.price);
                    break;
                case "year-desc":
                    sorted.sort((a, b) => b.year - a.year);
                    break;
                case "km-asc":
                    sorted.sort((a, b) => a.km - b.km);
                    break;
                default:
                    sorted.sort((a, b) => b.id - a.id);
            }

            const container = document.getElementById("carsListing");
            container.innerHTML = sorted.map(createCarCard).join('');
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const filterBrand = document.getElementById("filterBrand");
    const filterModel = document.getElementById("filterModel");

    if (filterBrand && filterModel) {
        filterBrand.addEventListener("change", () => {
            const selectedBrand = filterBrand.value;
            filterModel.innerHTML = '<option value="">Tüm Modeller</option>';

            if (selectedBrand && brandModels[selectedBrand]) {
                brandModels[selectedBrand].forEach(model => {
                    const opt = document.createElement("option");
                    opt.value = model;
                    opt.textContent = model;
                    filterModel.appendChild(opt);
                });
            }
        });

        // Sayfa ilk yüklenince de model seçeneklerini yükle
        const currentBrand = filterBrand.value;
        if (currentBrand && brandModels[currentBrand]) {
            brandModels[currentBrand].forEach(model => {
                const opt = document.createElement("option");
                opt.value = model;
                opt.textContent = model;
                filterModel.appendChild(opt);
            });
        }
    }
});


function applyFilters() {
    const allCars = getAllCars();
    const brand = document.getElementById("filterBrand").value;
    const model = document.getElementById("filterModel").value;
    const minPrice = parseInt(document.getElementById("minPrice").value) || 0;
    const maxPrice = parseInt(document.getElementById("maxPrice").value) || Infinity;
    const minYear = parseInt(document.getElementById("minYear").value) || 0;
    const maxYear = parseInt(document.getElementById("maxYear").value) || Infinity;

    const selectedFuelTypes = [...document.querySelectorAll(".filter-section input[type='checkbox']:checked")]
        .filter(cb => ["Benzin", "Dizel", "Hybrid", "Elektrik"].includes(cb.value))
        .map(cb => cb.value);

    const selectedTransmissions = [...document.querySelectorAll(".filter-section input[type='checkbox']:checked")]
        .filter(cb => ["Manuel", "Otomatik"].includes(cb.value))
        .map(cb => cb.value);

    const filtered = allCars.filter(car => {
        return (!brand || car.brand === brand) &&
               (!model || car.model === model) &&
               car.price >= minPrice &&
               car.price <= maxPrice &&
               car.year >= minYear &&
               car.year <= maxYear &&
               (selectedFuelTypes.length === 0 || selectedFuelTypes.includes(car.fuel)) &&
               (selectedTransmissions.length === 0 || selectedTransmissions.includes(car.transmission));
    });

    const container = document.getElementById("carsListing");
    container.innerHTML = filtered.length === 0
        ? "<p style='padding:2rem;'>Kriterlere uyan ilan bulunamadı.</p>"
        : filtered.map(createCarCard).join('');
}


function clearFilters() {
    document.getElementById("filterBrand").value = "";
    document.getElementById("filterModel").innerHTML = "<option value=''>Tüm Modeller</option>";
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("minYear").value = "";
    document.getElementById("maxYear").value = "";

    document.querySelectorAll(".filter-section input[type='checkbox']").forEach(cb => cb.checked = false);

    applyFilters();
}
