class Animal {
  constructor(name, type_animal, age, gender, description) {
    this.name = name;
    this.type_animal = type_animal;
    this.age = age;
    this.gender = gender;
    this.description = description;
  }
}

export const arrayAnimals = [
  new Animal(
    "Rosi",
    "tejon melero",
    2,
    "Hembra",
    "Dieta enriquecida con miel pura y raíces silvestres. ",
  ),
  new Animal(
    "Boc",
    "panda rojo",
    3,
    "Macho",
    "prioriza brotes de bambú tierno seleccionados ",
  ),
  new Animal(
    "Nami",
    "león marino",
    4,
    "Hembra",
    "Disfruta nadar a alta velocidad y alimentarse con pescado fresco.",
  ),
  new Animal(
    "Kabu",
    "tejon melero",
    5,
    "Macho",
    "Muy activo y curioso, explora constantemente los refugios del recinto.",
  ),
  new Animal(
    "Mei",
    "panda rojo",
    1,
    "Hembra",
    "Suele descansar en las ramas altas tras consumir sus hojas de bambú.",
  ),
  new Animal(
    "Tritón",
    "león marino",
    6,
    "Macho",
    "Responde bien al entrenamiento de enriquecimiento con pelotas acuáticas.",
  ),
  new Animal(
    "Bruno",
    "tejon melero",
    3,
    "Macho",
    "Posee un carácter audaz y le encanta cavar en su zona de tierra.",
  ),
  new Animal(
    "Jin",
    "panda rojo",
    2,
    "Macho",
    "Prefiere las horas frescas de la mañana para comer sus frutos secos.",
  ),
  new Animal(
    "Cora",
    "león marino",
    3,
    "Hembra",
    "Le gusta tomar el sol sobre las rocas después de nadar.",
  ),
  new Animal(
    "Zuri",
    "tejon melero",
    4,
    "Hembra",
    "Inspecciona metódicamente cada rincón en busca de raíces e insectos.",
  ),
  new Animal(
    "Ling",
    "panda rojo",
    5,
    "Hembra",
    "Tranquila y trepadora ágil; adora los brotes más suaves del día.",
  ),
];

export async function getAvailableAnimals() {
  return arrayAnimals;
}