import '../pages/index.css';
import { createCard, removeCard } from './card.js';
import { openModal, closeModal, closeOnClick } from './modal.js';
import { 
  getUserInfo, 
  getCards, 
  changeUserName, 
  sendCardToServer, 
  deleteCardFromServer, 
  changeAvatar 
} from './api.js';
import { enableValidation, clearValidation } from './validation.js';

const objectWithFormElements = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

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
const cardTitleInput = cardFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardFormElement.querySelector('.popup__input_type_url');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const deleteCardModal = document.querySelector('.popup_type_confirm');
const changeAvatarModal = document.querySelector('.popup_type_changeavatar');
const profileImage = document.querySelector('.profile__image');
const avatarUrlInput = changeAvatarModal.querySelector('.popup__input_type_url');
const avatarForm = changeAvatarModal.querySelector('.popup__form');
let userId;

function renderLoading(isLoading, button) {
  button.textContent = isLoading ? 'Сохранение...' : 'Сохранить';
}

function openImageModal(cardData) {
  imageModalImg.src = cardData.link;
  imageModalImg.alt = `Изображение ${cardData.name}`;
  imageModalCaption.textContent = cardData.name;
  openModal(imageModal);
}

function openDeleteModal(card, cardId) {
  openModal(deleteCardModal);

  const confirmButton = deleteCardModal.querySelector('.popup__button');
  const handleConfirm = () => {
    renderLoading(true, confirmButton);
    deleteCardFromServer(cardId)
      .then(() => {
        removeCard(card);
        closeModal(deleteCardModal);
      })
      .catch((err) => console.error(`Ошибка удаления карточки: ${err}`))
      .finally(() => renderLoading(false, confirmButton));

    confirmButton.removeEventListener('click', handleConfirm);
  };

  confirmButton.addEventListener('click', handleConfirm);
}

editProfileButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editformElement, objectWithFormElements);
  openModal(editModal);
});

profileImage.addEventListener('click', () => {
  openModal(changeAvatarModal);
});

avatarForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const saveButton = avatarForm.querySelector('.popup__button');
  renderLoading(true, saveButton);

  changeAvatar(avatarUrlInput.value)
    .then((res) => {
      profileImage.style.backgroundImage = `url(${res.avatar})`;
      closeModal(changeAvatarModal);
      avatarForm.reset();
    })
    .catch((err) => console.error(`Ошибка изменения аватара: ${err}`))
    .finally(() => renderLoading(false, saveButton));
});

newCardButton.addEventListener('click', () => {
  clearValidation(cardFormElement, objectWithFormElements);
  openModal(newCardModal);
});

[editModal, newCardModal, imageModal, deleteCardModal, changeAvatarModal].forEach((modal) => {
  modal.addEventListener('click', (e) => closeOnClick(e, modal));
});

function editFormSubmit(evt) {
  evt.preventDefault();
  const saveButton = editformElement.querySelector('.popup__button');
  renderLoading(true, saveButton);

  const name = nameInput.value;
  const description = jobInput.value;

  changeUserName(name, description)
    .then(() => {
      profileTitle.textContent = name;
      profileDescription.textContent = description;
      closeModal(editModal);
    })
    .catch((err) => console.error(`Ошибка изменения профиля: ${err}`))
    .finally(() => renderLoading(false, saveButton));
}

function addNewCard(evt) {
  evt.preventDefault();
  const saveButton = cardFormElement.querySelector('.popup__button');
  renderLoading(true, saveButton);

  const title = cardTitleInput.value;
  const link = cardLinkInput.value;

  const newCardData = {
    name: title,
    link: link,
    likes: [],
    owner: { _id: userId }
  };

  sendCardToServer(title, link)
    .then((res) => {
      const newCard = createCard(res, openImageModal, openDeleteModal, userId);
      places.prepend(newCard);
      cardFormElement.reset();
      clearValidation(cardFormElement, objectWithFormElements);
      closeModal(newCardModal);
    })
    .catch((err) => console.error(`Ошибка добавления карточки: ${err}`))
    .finally(() => renderLoading(false, saveButton));
}

cardFormElement.addEventListener('submit', addNewCard);
editformElement.addEventListener('submit', editFormSubmit);

Promise.all([getUserInfo(), getCards()])
  .then(([userData, cardsData]) => {
    userId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;
    cardsData.forEach((item) => {
      const card = createCard(item, openImageModal, openDeleteModal, userId);
      places.append(card);
    });
  })
  .catch((err) => console.error(`Ошибка загрузки данных: ${err}`));

enableValidation(objectWithFormElements);