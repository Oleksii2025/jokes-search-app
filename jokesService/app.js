import Jokes from "./jokes.js";
import Elements from "./elements.js";
import { renderHTML } from "./jokeTemplate.js";

const jokes = new Jokes();
const $elements = new Elements();
const categories = await jokes.getCategories();
const storedJokes = localStorage.getItem("favoriteJokes");

let jokesArray = [];
let favoritesJokesArray = [];
let jokeType = "jokeByRandom";
let categoryName = "";
let searchValue = "";

// Hide search and category blocks at start
$elements.search.style = "display: none";
$elements.categories.style = "display: none";

// Rendering category buttons in the DOM
categories.forEach((category) => {
  $elements.categories.innerHTML += `<button type="button" class="categories--category-btn" value="${category}">${category}</button>`;
});

if (storedJokes) {
  favoritesJokesArray = JSON.parse(storedJokes);
  favoritesJokesArray.forEach((joke) =>
    renderJoke(joke, $elements.favoritesJokes, true)
  );
}

document.addEventListener("click", (e) => {
  if (e.target.type === "radio") {
    jokeType = e.target.value;
    displayQuerySelection(jokeType);
  }
  if (e.target.type === "button") {
    e.preventDefault();
  }
  if (e.target.type === "button" && e.target.value === "send") {
    selectionOfJokes();
  }
  if (
    e.target.type === "button" &&
    e.target.className === "categories--category-btn"
  ) {
    categoryName = e.target.value;
  }
  const heartBtn = e.target.closest(".heart-btn");
  if (heartBtn) {
    handleHeartButtonClick(heartBtn);
  }
});

document.addEventListener("input", (e) => {
  if (e.target.id === "search") {
    searchValue = e.target.value;
  }
});

function handleHeartButtonClick(heartBtn) {
  const joke = { ...heartBtn.dataset };
  heartBtn.classList.toggle("active");
  const jokeIndex = favoritesJokesArray.findIndex((j) => j.id === joke.id);
  if (heartBtn.classList.contains("active")) {
    if (jokeIndex === -1) {
      favoritesJokesArray.push(joke);
    }
  } else {
    if (jokeIndex !== -1) {
      favoritesJokesArray.splice(jokeIndex, 1);
    }
  }
  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem("favoriteJokes", JSON.stringify(favoritesJokesArray));
  $elements.favoritesJokes.innerHTML = "";
  favoritesJokesArray.forEach((favoritesJoke) => {
    renderJoke(favoritesJoke, $elements.favoritesJokes, true);
  });
  let $renderElement = document.querySelectorAll(".heart-btn");
  $renderElement.forEach((btn) => {
    const isFav = favoritesJokesArray.some((fav) => fav.id === btn.dataset.id);
    btn.classList.toggle("active", isFav);
  });
}

const selectionOfJokes = async () => {
  switch (jokeType) {
    case "jokeByRandom":
      const joke = await jokes.getRandomJoke();
      jokesArray.push(joke);
      renderJoke(joke, $elements.jokes);
      break;
    case "jokeByCategories":
      if (categoryName) {
        const jokeByCategory = await jokes.getJokeByCategory(categoryName);
        jokesArray.push(jokeByCategory);
        renderJoke(jokeByCategory, $elements.jokes);
      }
      break;
    case "jokeBySearch":
      if (searchValue) {
        const jokesBySearch = await jokes.getJokesBySearch(searchValue);
        jokesBySearch.result.forEach((joke) => {
          renderJoke(joke, $elements.jokes);
          jokesArray.push(joke);
        });
      }
      break;
  }
};

// Render a single joke into a specified container in the DOM
function renderJoke(joke, container, favorite = false) {
  container.insertAdjacentHTML("beforeend", renderHTML(joke, favorite));
}

const displayQuerySelection = (param) => {
  switch (param) {
    case "jokeByRandom":
      $elements.search.style = "display: none";
      $elements.categories.style = "display: none";
      break;
    case "jokeByCategories":
      $elements.categories.style = "display: block";
      $elements.search.style = "display: none";
      break;
    case "jokeBySearch":
      $elements.search.style = "display: block";
      $elements.categories.style = "display: none";
      break;
  }
};

selectionOfJokes();
