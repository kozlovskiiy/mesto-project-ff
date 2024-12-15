import '../pages/index.css';
import { createCard, toggleLike, removeCard, renderLoading } from './card.js';
import { openModal, closeModal, closeOnClick } from './modal.js';
import { getUserInfo, getCards, changeUserName, sendCardToServer, deleteCardFromServer, changeAvatar } from './api.js';
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
const deleteCardModal = document.querySelector('.popup_type_confirm');
const changeAvatarModal = document.querySelector('.popup_type_changeavatar')
const profileImage = document.querySelector('.profile__image')
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

profileImage.addEventListener('click', () => {
  openModal(changeAvatarModal);
  const avatarUrlInput = changeAvatarModal.querySelector('.popup__input_type_url');
  const form = changeAvatarModal.querySelector('.popup__form')
  changeAvatarModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup__button')) {
      changeAvatar(avatarUrlInput.value)
      .then((res) => {
        profileImage.style.backgroundImage = `url(${res.avatar})`;
        closeModal(changeAvatarModal)
        form.reset()
      })
      .catch((err) => console.error(`Ошибка изменения аватара: ${err}`))
      .finally(() => renderLoading(false))
    }
  })
})

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

[editModal, newCardModal, imageModal, deleteCardModal, changeAvatarModal].forEach((modal) => {
  modal.addEventListener('click', (e) => closeOnClick(e, modal));
});

places.addEventListener('click', (e) => {
  if (e.target.classList.contains('card__delete-button')) {
    const cardToDelete = e.target.closest('.card'); 
    const cardId = cardToDelete.dataset.id; 

    openModal(deleteCardModal);

    deleteCardModal.addEventListener('click', function handleDelete(e) {
      if (e.target.classList.contains('popup__button')) {
        renderLoading(true)
        deleteCardFromServer(cardId) 
          .then(() => {
            removeCard(cardToDelete); 
            closeModal(deleteCardModal);
          })
          .catch((err) => console.error(`Ошибка удаления карточки: ${err}`))
          .finally(() => {
            renderLoading(false)
        });
      }
      deleteCardModal.removeEventListener('click', handleDelete); 
    });
  }
});

function editFormSubmit(evt) {
  evt.preventDefault();

  const name = nameInput.value;
  const description = jobInput.value;

  profileTitle.textContent = name;
  profileDescription.textContent = description;
  renderLoading(true)
  changeUserName(name, description);
  renderLoading(false)
  closeModal(editModal);
}

function addNewCard(evt) {
  
  evt.preventDefault();
  const title = cardTitleInput.value;
  const link = cardLinkInput.value;
  
  const newCardData = {
    name: title,
    link: link,
    likes: [], 
    owner: { _id: userId } 
  };
  renderLoading(true)
  sendCardToServer(title, link)
    .then(() => {
      const newCard = createCard(newCardData, removeCard, toggleLike, openImageModal, userId);
      places.prepend(newCard);
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
    })
    .catch((err) => console.error(`Ошибка добавления карточки: ${err}`))
    .finally(() => renderLoading(false))
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