import '../pages/index.css';
import { createCard, toggleLike, removeCard } from './card.js';
import { openModal, closeModal, closeOnClick } from './modal.js';
import { initialCards } from './cards.js';

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

function openImageModal(cardData) {
  imageModalImg.src = cardData.link;
  imageModalImg.alt = `Изображение ${cardData.name}`;
  imageModalCaption.textContent = cardData.name;
  openModal(imageModal);
}

editProfileButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editModal);
});

newCardButton.addEventListener('click', () => openModal(newCardModal));

[editModal, newCardModal, imageModal].forEach((modal) => {
  modal.addEventListener('click', (e) => closeOnClick(e, modal));
});

function editFormSubmit(evt) {
  evt.preventDefault();

  const name = nameInput.value;
  const description = jobInput.value;

  profileTitle.textContent = name;
  profileDescription.textContent = description;

  closeModal(editModal);
}

function addNewCard(evt) {
  evt.preventDefault();
  
  const title = cardTitleInput.value;
  const link = cardLinkInput.value;
  
  const newCardData = {
    name: title,
    link: link
  };
  
  const newCard = createCard(newCardData, removeCard, toggleLike, openImageModal);
  places.prepend(newCard);
  
  cardFormElement.reset()
  closeModal(newCardModal);
}

cardFormElement.addEventListener('submit', addNewCard);
editformElement.addEventListener('submit', editFormSubmit);

initialCards.forEach((item) => {
  const card = createCard(item, removeCard, toggleLike, openImageModal);
  places.append(card);
});