import { addLikeToServer, removeLikeFromServer } from './api.js';

export function toggleLike(evt, cardId, likesCounter) {
  const likeButton = evt.target;

  if (likeButton.classList.contains('card__like-button_is-active')) {
    removeLikeFromServer(cardId)
      .then((card) => {
        likeButton.classList.remove('card__like-button_is-active');
        likesCounter.textContent = card.likes.length;
      })
      .catch((err) => console.error(`Ошибка снятия лайка: ${err}`));
  } else {
    addLikeToServer(cardId)
      .then((card) => {
        likeButton.classList.add('card__like-button_is-active');
        likesCounter.textContent = card.likes.length;
      })
      .catch((err) => console.error(`Ошибка постановки лайка: ${err}`));
  }
}

export function createCard(cardData, removeCard, openImage, userId) {
  const cardTemplate = document.querySelector('#card-template').content;
  const card = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');
  const likeButton = card.querySelector('.card__like-button');
  const removeButton = card.querySelector('.card__delete-button');
  const likesCounter = card.querySelector('.card__likes');

  cardImage.src = cardData.link;
  cardImage.alt = `Изображение ${cardData.name}`;
  cardTitle.textContent = cardData.name;
  likesCounter.textContent = cardData.likes.length;

  card.dataset.id = cardData._id;

  if (cardData.likes.some((like) => like._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  if (cardData.owner._id !== userId) {
    removeButton.style.display = 'none';
  } 

  cardImage.addEventListener('click', () => openImage(cardData));
  likeButton.addEventListener('click', (evt) => toggleLike(evt, cardData._id, likesCounter));

  return card;
}

export function removeCard(card) {
  card.remove();
}

export function renderLoading(isLoading) {
  const button = document.querySelector('.popup__button')
  if (isLoading) {
    button.textContent = "Сохранение..."
  } else {
    button.textContent = "Сохранить"
  }
}
