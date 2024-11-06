export function openModal(modal) {
  modal.classList.add('popup_is-animated');
  setTimeout(() => {
    modal.classList.add('popup_is-opened');
  }, 10);
  document.addEventListener('keydown', (e) => closeOnEscape(e, modal));
}

export function closeModal(modal) {
  modal.classList.remove('popup_is-opened');
  setTimeout(() => {
    modal.classList.remove('popup_is-animated');
  }, 600);
  document.removeEventListener('keydown', (e) => closeOnEscape(e, modal));
}

function closeOnEscape(e, modal) {
  if (e.key === 'Escape') {
    closeModal(modal);
  }
}

export function closeOnClick(e, modal) {
  if (e.target.classList.contains('popup__close') || e.target.classList.contains('popup')) {
    closeModal(modal);
  }
}