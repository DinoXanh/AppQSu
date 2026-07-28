const tankList = document.getElementById("tankList");
const countryList = document.getElementById("countryList");
const searchInput = document.getElementById("search");
const clearFilter = document.getElementById("clearFilter");
const resultCount = document.getElementById("resultCount");

const modal = document.getElementById("modal");
const closeButton = document.getElementById("close");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalCountry = document.getElementById("modalCountry");
const modalYear = document.getElementById("modalYear");
const modalWeight = document.getElementById("modalWeight");
const modalGun = document.getElementById("modalGun");
const modalSpeed = document.getElementById("modalSpeed");
const modalDescription = document.getElementById("modalDescription");
const detailLink = document.getElementById("detailLink");
const darkMode = document.getElementById("darkMode");

function renderCountries() {
    const countries = [...new Set(tanks.map((tank) => tank.country))];

    countryList.innerHTML = countries.map((country) => `
        <label>
            <input type="checkbox" value="${country}">
            <span>${country}</span>
        </label>
    `).join("");

    countryList.querySelectorAll("input").forEach((checkbox) => {
        checkbox.addEventListener("change", filterTanks);
    });
}

function renderTanks(list) {
    tankList.innerHTML = "";
    resultCount.textContent = `${list.length} xe tăng`;

    if (list.length === 0) {
        tankList.innerHTML = `
            <div class="no-result">
                <h3>Không tìm thấy xe tăng</h3>
                <p>Hãy thử từ khóa hoặc quốc gia khác.</p>
            </div>
        `;
        return;
    }

    list.forEach((tank) => {
        const card = document.createElement("article");
        card.className = "tank-card";
        card.tabIndex = 0;
        card.innerHTML = `
            <div class="tank-image-wrap">
                <img src="${tank.image}" alt="${tank.name}" loading="lazy">
                <span class="tank-year">${tank.year}</span>
            </div>
            <div class="tank-content">
                <h2>${tank.name}</h2>
                <p class="tank-type">${tank.type}</p>
                <div class="tank-meta">
                    <span>${tank.country}</span>
                    <span>${tank.gun}</span>
                </div>
                <button type="button" class="detail-btn card-detail-btn">Xem thông tin</button>
            </div>
        `;

        const open = () => showModal(tank);
        card.addEventListener("click", open);
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                open();
            }
        });

        tankList.appendChild(card);
    });
}

function filterTanks() {
    const keyword = searchInput.value.trim().toLowerCase();
    const checkedCountries = [...countryList.querySelectorAll("input:checked")]
        .map((checkbox) => checkbox.value);

    const result = tanks.filter((tank) => {
        const searchableText = `${tank.name} ${tank.country} ${tank.type} ${tank.year}`.toLowerCase();
        const matchesSearch = searchableText.includes(keyword);
        const matchesCountry = checkedCountries.length === 0 || checkedCountries.includes(tank.country);
        return matchesSearch && matchesCountry;
    });

    renderTanks(result);
}

function showModal(tank) {
    modalImage.src = tank.image;
    modalImage.alt = tank.name;
    modalName.textContent = tank.name;
    modalCountry.textContent = tank.country;
    modalYear.textContent = tank.year;
    modalWeight.textContent = tank.weight;
    modalGun.textContent = tank.gun;
    modalSpeed.textContent = tank.speed;
    modalDescription.textContent = tank.description;

    if (tank.link) {
        detailLink.href = tank.link;
        detailLink.hidden = false;
    } else {
        detailLink.hidden = true;
    }

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeButton.focus();
}

function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

searchInput.addEventListener("input", filterTanks);
clearFilter.addEventListener("click", () => {
    searchInput.value = "";
    countryList.querySelectorAll("input").forEach((checkbox) => {
        checkbox.checked = false;
    });
    renderTanks(tanks);
    searchInput.focus();
});

closeButton.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("show")) closeModal();
});

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    darkMode.checked = true;
}

darkMode.addEventListener("change", () => {
    document.body.classList.toggle("dark", darkMode.checked);
    localStorage.setItem("theme", darkMode.checked ? "dark" : "light");
});

renderCountries();
renderTanks(tanks);
