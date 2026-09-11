import { arrayAnimals, getAvailableAnimals } from "./data.js";

(function () {
  const STORAGE_KEY = "cs-theme";
  const html = document.documentElement;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark") {
    html.setAttribute("data-theme", "dark");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-theme");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isDark = html.getAttribute("data-theme") === "dark";
      if (isDark) {
        html.removeAttribute("data-theme");
        localStorage.setItem(STORAGE_KEY, "light");
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem(STORAGE_KEY, "dark");
      }
    });
  });
})();

document.addEventListener("DOMContentLoaded", async () => {
  const animalSelect = document.getElementById("animal");
  if (animalSelect) {
    const animals = await getAvailableAnimals();
    animals.forEach((animal, index) => {
      const option = document.createElement("option");
      const animalId = animal.id ?? animal.name.toLowerCase().replaceAll(" ", "-");

      option.value = animalId || `animal-${index}`;
      option.textContent = `${animal.name} · ${animal.type_animal}`;
      animalSelect.appendChild(option);
    });
  }

  const buttons = document.querySelectorAll(".filter-btn");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      buttons.forEach((b) => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");

      const cards = document.querySelectorAll(".animal-card");
      cards.forEach((card) => {
        const show =
          filter === "all" || card.getAttribute("data-category") === filter;
        card.hidden = !show;
      });
    });
  });
});

const showAnimals = document.getElementById("grid-animals");

function viewAnimals(list) {
  if (!showAnimals) return;

  showAnimals.innerHTML = "";
  list.forEach((animal) => {
    const card = document.createElement("article");
    let imgUrl;

    card.className = "animal-card";
    
    if (animal.type_animal === "tejon melero") {
      imgUrl = "./../assets/imgs/tejon-melero.jpg";
    } else if (animal.type_animal === "panda rojo") {
      imgUrl = "./../assets/imgs/panda-rojo.jpg";
    } else {
      imgUrl = "./../assets/imgs/sea-lion.png";
    }
    const category =
      animal.type_animal === "tejon melero"
        ? "tejon"
        : animal.type_animal === "panda rojo"
          ? "red-panda"
          : "seal-lion";
    card.innerHTML = `
    <div class="animal-card__content">
      <div class="animal-card__image">
        <img src="${imgUrl}" alt=${animal.type_animal}/>
        <span class="animal-card__tag">${animal.type_animal}</span>
      </div>
      <div class="animal-card__body">
        <div class="animal-card__heading">
          <h2 class="animal-card__name">${animal.name}</h2>
          <span class="animal-card__meta">${animal.gender} - ${animal.age} años</span>
        </div>
        <p class="animal-card__description">${animal.description}</p>
      </div>
    </div>
    <div class="animal-card__action">
      <a class="btn-primary" href="./../templates/formSponsorship.html">Apadrinar a ${animal.name}</a>
    </div>`;
    card.setAttribute("data-category", category);
    showAnimals.appendChild(card);
  });
}

viewAnimals(arrayAnimals)