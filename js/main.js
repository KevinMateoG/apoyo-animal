import { arrayAnimals } from "./data.js";

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

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".animal-card");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      buttons.forEach((b) => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");

      cards.forEach((card) => {
        const show =
          filter === "all" || card.getAttribute("data-category") === filter;
        card.style.display = show ? "flex" : "none";
      });
    });
  });
});

const showAnimals = document.getElementById("grid-animals");

function viewAnimals(list) {
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
    card.innerHTML = `
    <div>
      <div>
        <img src="${imgUrl}" alt=${animal.type_animal}/>
        <span>${animal.type_animal}</span>
      </div>
      <div>
        <h2>${animal.name}</h2>
        <span>${animal.gender} - ${animal.age} años<span>
      </div>
      <p>${animal.description}</p>
      <div>
        <a href="./../index.html">Apadrinar a ${animal.name}</a>
      </div>
    </div>`;
    showAnimals.appendChild(card);
  });
}

viewAnimals(arrayAnimals)