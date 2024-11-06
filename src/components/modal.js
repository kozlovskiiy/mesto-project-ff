export function openModal(modal) {
  modal.classList.add('popup_is-animated');
  setTimeout(() => {
    modal.classList.add('popup_is-opened');
  }, 10);
  document.addEventListener('keydown', closeOnEscape);
}

export function closeModal(modal) {
  modal.classList.remove('popup_is-opened');
  setTimeout(() => {
    modal.classList.remove('popup_is-animated');
  }, 600);
  document.removeEventListener('keydown', closeOnEscape);
}

function closeOnEscape(e) { 
  if (e.key === 'Escape') { 
    const modal = document.querySelector('.popup_is-opened');
    if (modal) {
      closeModal(modal);
    }
  } 
}

export function closeOnClick(e, modal) {
  if (e.target.classList.contains('popup__close') || e.target.classList.contains('popup')) {
    closeModal(modal);
  }
}