import '../pages/index.css';
import { createCard, toggleLike, removeCard } from './card.js';
import { openModal, closeModal, closeOnClick } from './modal.js';
import { getUserInfo, getCards, changeUserName, sendCardToServer } from './api.js';
import { enableValidation, clearValidation } from './validation.js';

enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
});

const places = document.querySelector('.places__list');
const editProfileButton = document.querySelector('.profile__edit-button');
const newCardButton = document.querySelector('.profile__add-button');
const editModal = document.querySelector('.popup_type_edit');
const newCardModal = document.querySelector('.popup_type_new-card');
const imageModal = document.querySelector('.popup_type_image');
const imageModalImg = imageModal.querySelector('.popup__image');
const imageModalCaption = imageModal.querySelector('.popup__caption');
const editformElement = editModal.querySelector('.popup__form');
const nameInput = editformElement.querySelector('.popup__input_type_name');
const jobInput = editformElement.querySelector('.popup__input_type_description');
const cardFormElement = newCardModal.querySelector('.popup__form');
const cardTitleInput = newCardModal.querySelector('.popup__input_type_card-name');
const cardLinkInput = newCardModal.querySelector('.popup__input_type_url');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

let userId;

function openImageModal(cardData) {
  imageModalImg.src = cardData.link;
  imageModalImg.alt = `Изображение ${cardData.name}`;
  imageModalCaption.textContent = cardData.name;
  openModal(imageModal);
}

editProfileButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editformElement, {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  });
  openModal(editModal);
});

newCardButton.addEventListener('click', () => {
  clearValidation(cardFormElement, {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  });
  openModal(newCardModal);
});

[editModal, newCardModal, imageModal].forEach((modal) => {
  modal.addEventListener('click', (e) => closeOnClick(e, modal));
});

function editFormSubmit(evt) {
  evt.preventDefault();

  const name = nameInput.value;
  const description = jobInput.value;

  profileTitle.textContent = name;
  profileDescription.textContent = description;
  changeUserName(name, description);
  closeModal(editModal);
}

function addNewCard(evt) {
  evt.preventDefault();

  const title = cardTitleInput.value;
  const link = cardLinkInput.value;

  const newCardData = {
    name: title,
    link: link,
    likes: [], // Пустой массив для новых карточек
    owner: { _id: userId } // Текущий пользователь как владелец
  };

  const newCard = createCard(newCardData, removeCard, toggleLike, openImageModal, userId);
  places.prepend(newCard);
  sendCardToServer(title, link);
  cardFormElement.reset();
  clearValidation(cardFormElement, {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  });
  closeModal(newCardModal);
}

cardFormElement.addEventListener('submit', addNewCard);
editformElement.addEventListener('submit', editFormSubmit);

Promise.all([getUserInfo(), getCards()])
  .then(([userData, cardsData]) => {
    userId = userData._id; // Сохранение ID пользователя
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;

    cardsData.forEach((item) => {
      const card = createCard(item, removeCard, openImageModal, userId);
      places.append(card);
    });
    cardsData.forEach((item, index) => {
      const cardLikes = document.querySelectorAll('.card__likes')[index];
      if (cardLikes) {
        cardLikes.textContent = item.likes.length;
      }
    });
  })
  .catch((err) => {
    console.error(`Ошибка загрузки данных: ${err}`);
  });