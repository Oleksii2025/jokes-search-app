import Jokes from "./jokes.js";
import Elements from "./elements.js";
import { heartSVG } from "../assets/icons.js";

const jokes = new Jokes();
const $elements = new Elements();
const categories = await jokes.getCategories();
const storedJokes = localStorage.getItem("favoriteJokes");

let jokesArray = [];
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
  jokesArray = JSON.parse(storedJokes);
  jokesArray.forEach((joke) => renderJoke(joke.text, true, joke.id));
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
  const jokeId = heartBtn.dataset.id;
  const jokeText = heartBtn.dataset.text;
  heartBtn.classList.toggle("active");
  const jokeIndex = jokesArray.findIndex((joke) => joke.id === jokeId);
  if (heartBtn.classList.contains("active")) {
    if (jokeIndex === -1) {
      jokesArray.push({ id: jokeId, text: jokeText });
    }
  } else {
    if (jokeIndex !== -1) {
      jokesArray.splice(jokeIndex, 1);
    }
  }
  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem("favoriteJokes", JSON.stringify(jokesArray));
}

const selectionOfJokes = async () => {
  switch (jokeType) {
    case "jokeByRandom":
      const joke = await jokes.getRandomJoke();
      renderJoke(joke.value, isFavorite(joke.id), joke.id);
      break;
    case "jokeByCategories":
      const jokeByCategory = await jokes.getJokeByCategory(categoryName);
      renderJoke(
        jokeByCategory.value,
        isFavorite(jokeByCategory.id),
        jokeByCategory.id
      );
      break;
    case "jokeBySearch":
      const jokesBySearch = await jokes.getJokesBySearch(searchValue);
      jokesBySearch.result.forEach((joke) =>
        renderJoke(joke.value, isFavorite(joke.id), joke.id)
      );
      break;
  }
};

function isFavorite(id) {
  return jokesArray.some((joke) => joke.id === id);
}

// Rendering a single joke in the DOM
function renderJoke(text, favorite = false, id) {
  $elements.jokes.insertAdjacentHTML(
    "beforeend",
    `<div class="jokes--joke-wrapper">
       <div>${text}</div>
       <div class="mark-as-favorite">
         <button class="heart-btn ${
           favorite ? "active" : ""
         }" aria-label="Like" data-id="${id}" data-text="${text}">
           ${heartSVG}
         </button>
       </div>
     </div>`
  );
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
