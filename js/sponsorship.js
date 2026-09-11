import { getAvailableAnimals } from "./data.js";

const donationTypeInputs = document.querySelectorAll('input[name="donation-type"]');
const animalField = document.getElementById("animal-field");
const animalInput = document.getElementById("animal");

const trigger  = document.getElementById("animal-picker-trigger");
const modal    = document.getElementById("animal-picker-modal");
const backdrop = document.getElementById("picker-backdrop");
const closeBtn = document.getElementById("picker-close");
const grid     = document.getElementById("animal-picker-grid");
const preview  = document.getElementById("picker-preview");

donationTypeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const isAnimal = input.value === "animal" && input.checked;
    animalField.hidden = !isAnimal;
    animalInput.required = isAnimal;
  });
});

function getImgUrl(type) {
  if (type === "tejon melero") return "./../assets/imgs/tejon-melero.jpg";
  if (type === "panda rojo")   return "./../assets/imgs/panda-rojo.jpg";
  return "./../assets/imgs/sea-lion.png";
}

function openPicker() {
  modal.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => modal.classList.add("is-open"));
  closeBtn.focus();
}

function closePicker() {
  modal.classList.remove("is-open");
  trigger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  modal.addEventListener("transitionend", () => { modal.hidden = true; }, { once: true });
  trigger.focus();
}

function selectAnimal(animal, card) {
  grid.querySelectorAll(".picker-animal-card").forEach(c => c.classList.remove("is-selected"));
  card.classList.add("is-selected");
  animalInput.value = animal.name.toLowerCase().replaceAll(" ", "-");
  preview.innerHTML = `
    <img src="${getImgUrl(animal.type_animal)}" alt="${animal.name}" class="animal-picker-trigger__thumb" />
    <span class="animal-picker-trigger__info">
      <strong>${animal.name}</strong>
      <small>${animal.type_animal} · ${animal.gender}</small>
    </span>
  `;
  closePicker();
}

async function buildGrid() {
  const animals = await getAvailableAnimals();
  grid.innerHTML = "";
  animals.forEach((animal) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "picker-animal-card";
    card.setAttribute("aria-label", `Seleccionar a ${animal.name}`);
    card.innerHTML = `
      <div class="picker-animal-card__img-wrap">
        <img src="${getImgUrl(animal.type_animal)}" alt="${animal.type_animal}" loading="lazy" />
        <span class="picker-animal-card__tag">${animal.type_animal}</span>
      </div>
      <div class="picker-animal-card__body">
        <span class="picker-animal-card__name">${animal.name}</span>
        <span class="picker-animal-card__meta">${animal.gender} · ${animal.age} años</span>
      </div>
    `;
    card.addEventListener("click", () => selectAnimal(animal, card));
    grid.appendChild(card);
  });
}

buildGrid();

trigger.addEventListener("click", openPicker);
closeBtn.addEventListener("click", closePicker);
backdrop.addEventListener("click", closePicker);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closePicker();
});
