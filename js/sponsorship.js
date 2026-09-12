import { getAvailableAnimals } from "./data.js";

const donationTypeInputs = document.querySelectorAll(
  'input[name="donation-type"]',
);
const animalField = document.getElementById("animal-field");
const animalInput = document.getElementById("animal");

const trigger = document.getElementById("animal-picker-trigger");
const modal = document.getElementById("animal-picker-modal");
const backdrop = document.getElementById("picker-backdrop");
const closeBtn = document.getElementById("picker-close");
const grid = document.getElementById("animal-picker-grid");
const preview = document.getElementById("picker-preview");

donationTypeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const isAnimal = input.value === "animal" && input.checked;
    animalField.hidden = !isAnimal;
    animalInput.required = isAnimal;
  });
});

function getImgUrl(type) {
  if (type === "tejon melero") return "./../assets/imgs/tejon-melero.jpg";
  if (type === "panda rojo") return "./../assets/imgs/panda-rojo.jpg";
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
  modal.addEventListener(
    "transitionend",
    () => {
      modal.hidden = true;
    },
    { once: true },
  );
  trigger.focus();
}

function selectAnimal(animal, card) {
  grid
    .querySelectorAll(".picker-animal-card")
    .forEach((c) => c.classList.remove("is-selected"));
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

const form = document.querySelector(".sponsorship-form");
const errorBanner = document.getElementById("form-errors");
const errorList = document.getElementById("form-error-list");
const messageContainer = document.getElementById("gratitude");

buildGrid();

trigger.addEventListener("click", openPicker);
closeBtn.addEventListener("click", closePicker);
backdrop.addEventListener("click", closePicker);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closePicker();
});

function validateForm() {
  const errors = [];
  const donationType = document.querySelector(
    'input[name="donation-type"]:checked',
  ).value;

  if (donationType === "animal" && !animalInput.value) {
    errors.push("Debes seleccionar el animal que quieres apadrinar.");
  }

  const name = document.getElementById("name").value.trim();
  if (!name) {
    errors.push("El nombre completo es obligatorio.");
  }

  const email = document.getElementById("email").value.trim();
  if (!email) {
    errors.push("El correo electrónico es obligatorio.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("El correo electrónico no tiene un formato válido.");
  }

  const address = document.getElementById("address").value.trim();
  if (!address) {
    errors.push("La dirección es obligatoria.");
  }

  const amount = Number(document.getElementById("amount").value);
  if (!amount || amount < 1) {
    errors.push("El valor del aporte debe ser un número mayor a 0.");
  }

  const consent = document.querySelector('input[name="consent"]').checked;
  if (!consent) {
    errors.push("Debes aceptar que el equipo se comunique contigo.");
  }

  return errors;
}

function showErrors(errors) {
  errorList.innerHTML = "";
  errors.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    errorList.appendChild(li);
  });
  errorBanner.hidden = false;
  errorBanner.scrollIntoView({ behavior: "smooth", block: "center" });
}

function clearErrors() {
  errorBanner.hidden = true;
  errorList.innerHTML = "";
}

async function getAnimalNameFromId(id) {
  const animals = await getAvailableAnimals();
  const found = animals.find(
    (a) => a.name.toLowerCase().replaceAll(" ", "-") === id,
  );
  return found ? found.name : id;
}

function resetPicker() {
  animalInput.value = "";
  preview.innerHTML = `<span class="animal-picker-trigger__placeholder">Selecciona un ejemplar</span>`;
  grid
    .querySelectorAll(".picker-animal-card")
    .forEach((c) => c.classList.remove("is-selected"));
}

function showThankYou(userName, donationType, animalName) {
  const msg =
    donationType === "animal"
      ? `¡Muchas gracias! ${userName}, ${animalName} va a estar muy agradecido contigo, gracias por tu grano de arena 🌿`
      : `¡Muchas gracias! ${userName}, tu generosidad ayuda directamente al bienestar de toda la reserva. Cada aporte cuenta y el nuestro lo sabe 🌿`;
  const container = messageContainer.closest(".message-container");
  form.reset();
  resetPicker();
  container.style.display = "block";
  requestAnimationFrame(() => container.classList.add("is-visible"));
  messageContainer.textContent = msg;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();
  const errors = validateForm();
  if (errors.length) {
    showErrors(errors);
    return;
  }
  const userName = document.getElementById("name").value.trim();
  const donationType = document.querySelector(
    'input[name="donation-type"]:checked',
  ).value;
  const animalName =
    donationType === "animal" ? await getAnimalNameFromId(animalInput.value) : null;
  showThankYou(userName, donationType, animalName);
});
