const URI = 'https://nomoreparties.co/v1/pwff-cohort-1/';
const headersToken = '41411de9-cf42-4ce5-b3d1-441d6ba71a09';
const headerContentType = 'application/json';


const headers = {
  authorization: headersToken,
  'Content-Type': headerContentType,
};

function handleResponse(res) {
  if (!res.ok) {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
  return res.json();
}

export function getUserInfo() {
  return fetch(`${URI}users/me`, {
    method: 'GET',
    headers,
  }).then(handleResponse);
}

export function getCards() {
  return fetch(`${URI}cards`, {
    method: 'GET',
    headers,
  }).then(handleResponse);
}

export function changeUserName(name, about) {
  return fetch(`${URI}users/me`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ name, about }),
  }).then(handleResponse);
}

export function sendCardToServer(name, link) {
  return fetch(`${URI}cards`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, link }),
  }).then(handleResponse);
}

export const deleteCardFromServer = (cardId) => {
  return fetch(`${URI}cards/${cardId}`, {
    method: 'DELETE',
    headers,
  }).then(handleResponse);
};

export function addLikeToServer(cardId) {
  return fetch(`${URI}cards/likes/${cardId}`, {
    method: 'PUT',
    headers,
  }).then(handleResponse);
}

export function removeLikeFromServer(cardId) {
  return fetch(`${URI}cards/likes/${cardId}`, {
    method: 'DELETE',
    headers,
  }).then(handleResponse);
}

export const changeAvatar = (avatarUrl) => {
  return fetch(`${URI}users/me/avatar`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ avatar: avatarUrl }),
  }).then(handleResponse);
};
