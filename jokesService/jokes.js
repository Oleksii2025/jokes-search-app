export default class Jokes {
  constructor() {
    this.apiBase = "https://api.chucknorris.io/jokes";
  }

  async fetchJSON(url) {
    const response = await fetch(url);
    return response.json();
  }

  getRandomJoke() {
    return this.fetchJSON(`${this.apiBase}/random`);
  }

  getCategories() {
    return this.fetchJSON(`${this.apiBase}/categories`);
  }

  getJokeByCategory(categories) {
    return this.fetchJSON(`${this.apiBase}/random?category=${categories}`);
  }

  getJokesBySearch(searchQuery) {
    return this.fetchJSON(`${this.apiBase}/search?query=${searchQuery}`);
  }
}
