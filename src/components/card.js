export function createCard(cardData, removeCard, toggleLike, openImage) {
  const cardTemplate = document.querySelector('#card-template').content;
  const card = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');

  cardImage.src = cardData.link;
  cardImage.alt = `Изображение ${cardData.name}`;
  cardTitle.textContent = cardData.name;

  cardImage.addEventListener('click', () => openImage(cardData));

  const removeButton = card.querySelector('.card__delete-button');
  removeButton.addEventListener('click', () => removeCard(card));

  const likeButton = card.querySelector('.card__like-button');
  likeButton.addEventListener('click', toggleLike);

  return card;
}

export function toggleLike(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export function removeCard(card) {
  card.remove();
}