const cols = document.querySelectorAll(".col");

document.addEventListener("keydown", (event) => {
  if (event.code.toLowerCase() === "space") {
    event.preventDefault();
    setRandomColors();
  }
});

document.addEventListener("click", (event) => {
  const type = event.target.dataset.type;

  if (type === "lock") {
    const node =
      event.target.tagName.toLowerCase() === "i"
        ? event.target
        : event.target.children[0];

    node.classList.toggle("fa-lock-open");
    node.classList.toggle("fa-lock");
  } else if (type === "copy") {
    copyColorToClickBoard(event.target.textContent);
  }
});

//Ф-я для создания рандомных цветов
function generateRandomColors() {
  const hexCodes = "0123456789ABCDEF"; // Символы с помощью кот. можно сгенерить цвет
  let color = ""; //Строка-цвет, которую формируем

  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
  }

  //Возвращаем цвет
  return "#" + color;
}

function copyColorToClickBoard(text) {
  // Конструкция возвращает просмис, поэтому возвращаем через return(на случай, если понадобится обработка результата)
  return navigator.clipboard.writeText(text);
}

// Установка цветов колонкам
// Параметр isInitial - индикатор первоначальной загрузки страницы(для открытия страницы с заданным массивом цветов)
function setRandomColors(isInitial = false) {
  // Массив для дальнейшей передачи цветов как параметров в Hash)
  const colors = isInitial ? getColorsFromHash() : [];

  cols.forEach((col, index) => {
    const isLocked = col.querySelector("i").classList.contains("fa-lock");
    const textField = col.querySelector("h2");
    const btn = col.querySelector("button");

    if (isLocked) {
      colors.push(textField.textContent);
      return;
    }

    //Вариант 1 рандомизации цвета - "ручной"
    // const color = generateRandomColors();
    //Вариант 2 рандомизации цвета - с библиотекой
    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random();

    if (!isInitial) {
      colors.push(color);
    }

    textField.textContent = color;
    col.style.background = color;

    setTextColor(textField, color);
    setTextColor(btn, color);
  });

  updateColorsHash(colors);
}

function updateColorsHash(colors = []) {
  // Форматируме представление массива параметро-цветов
  // Убираем знак решетки и разделяем цвета дефисами
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join("-");
}

// Функция переопределения цвета заголовка для лучшей читаемости в зависимости от цвета блока:
// если цвет блока очень светлый, то инвертируем цвет шрифта
function setTextColor(text, color) {
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? "black" : "white";
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    // Убираем знак # в начале строки
    // Разбиваем строку параметров в массив цветов
    // И добавляем знак # уже для каждого цвета
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }
  return [];
}

setRandomColors(true);
