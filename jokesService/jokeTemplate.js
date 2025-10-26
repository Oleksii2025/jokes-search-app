import { heartSVG, linkSVG, chatSVG } from "../assets/icons.js";

export const renderHTML = (joke, favorite) => {
  return `<div class="jokes--joke-wrapper">
      <div class="mark-as-favorite">
         <button class="heart-btn ${
           favorite ? "active" : ""
         }" aria-label="Like" 
         data-id="${joke.id}"
          data-value="${joke.value}"
           data-url="${joke.url}" 
           data-updated_at="${joke.updated_at}"
           data-categories="${joke.categories}">
           ${heartSVG}
         </button>
       </div>
      <div class="joke d-flex">
        <div class="joke--icon">${chatSVG}</div>
        <div class="joke--content d-flex flex-column">
          <div class="joke--content--id-link-container d-flex">
            <div class="joke--content--id-link-container--id">ID:&nbsp;</div>
            <a href="${
              joke.url
            }" class="joke--content--id-link-container--link" target="blank">
            <span>${joke.id}</span>&nbsp;${linkSVG}</a>
          </div>
          <div class="joke--content--text">${joke.value}</div>
          <div class="joke--content--last-update-and-category d-flex justify-content-between">
            <div class="joke--content--last-update-and-category--last-update">
              Last update: ${getHoursFromNow(joke.updated_at)} hours ago
            </div>
            ${
              joke.categories.length > 0
                ? `<div class="joke--content--last-update-and-category--category">
                ${joke.categories}
              </div>`
                : ""
            }
          </div>
        </div>
      </div>
    </div>`;
};

const getHoursFromNow = (dateString) => {
  const pastDate = new Date(dateString);
  const now = new Date();
  const diffMs = now - pastDate; // різниця у мілісекундах
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // переводимо в години
  return diffHours;
};
