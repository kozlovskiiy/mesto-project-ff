import { deleteCardFromServer } from './api.js';

export function createCard(cardData, removeCard, toggleLike, openImage, userId) {
  const cardTemplate = document.querySelector('#card-template').content;
  const card = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');
  const likeButton = card.querySelector('.card__like-button');
  const removeButton = card.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = `Изображение ${cardData.name}`;
  cardTitle.textContent = cardData.name;

  card.dataset.id = cardData._id;

  if (cardData.likes && cardData.likes.some((like) => like._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Проверяем наличие owner перед скрытием кнопки удаления
  if (cardData.owner && cardData.owner._id !== userId) {
    removeButton.style.display = 'none';
  } else {
    removeButton.addEventListener('click', () => {
      deleteCardFromServer(cardData._id)
        .then(() => {
          removeCard(card);
        })
        .catch((err) => console.error(`Ошибка удаления карточки: ${err}`));
    });
  }

  cardImage.addEventListener('click', () => openImage(cardData));
  likeButton.addEventListener('click', toggleLike);

  return card;
}

export function toggleLike(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export function removeCard(card) {
  card.remove();
}