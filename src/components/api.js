// Запрос данных пользователя
export function getUserInfo() {
  return fetch('https://nomoreparties.co/v1/pwff-cohort-1/users/me', {
    method: 'GET',
    headers: {
      authorization: '41411de9-cf42-4ce5-b3d1-441d6ba71a09'
    }
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Ошибка: ${res.status}`);
    }
    return res.json();
  });
}

// Запрос данных карточек
export function getCards() {
  return fetch('https://nomoreparties.co/v1/pwff-cohort-1/cards', {
    method: 'GET',
    headers: {
      authorization: '41411de9-cf42-4ce5-b3d1-441d6ba71a09'
    }
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Ошибка: ${res.status}`);
    }
    return res.json();
  });
}


export function changeUserName (name, about) {
  return fetch('https://nomoreparties.co/v1/pwff-cohort-1/users/me', {
  method: 'PATCH',
  headers: {
    authorization: '41411de9-cf42-4ce5-b3d1-441d6ba71a09',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: name,
    about: about
  })
});
}


export function sendCardToServer(name, link) {
  return fetch('https://nomoreparties.co/v1/pwff-cohort-1/cards', {
    method: 'POST',
    headers: {
      authorization: '41411de9-cf42-4ce5-b3d1-441d6ba71a09',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, link })
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Ошибка: ${res.status}`);
    }
    return res.json();
  });
}

export const deleteCardFromServer = (cardId) => {
  return fetch(`https://nomoreparties.co/v1/pwff-cohort-1/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: '41411de9-cf42-4ce5-b3d1-441d6ba71a09',
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  });
};

export function addLikeToServer(cardId) {
  return fetch(`https://nomoreparties.co/v1/pwff-cohort-1/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: {
      authorization: '41411de9-cf42-4ce5-b3d1-441d6ba71a09',
      'Content-Type': 'application/json'
    }
  }).then((res) => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
}

export function removeLikeFromServer(cardId) {
  return fetch(`https://nomoreparties.co/v1/pwff-cohort-1/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: '41411de9-cf42-4ce5-b3d1-441d6ba71a09',
      'Content-Type': 'application/json'
    }
  }).then((res) => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
}


export const changeAvatar = function (avatarUrl) {
  return fetch('https://nomoreparties.co/v1/pwff-cohort-1/users/me/avatar', {
    method: 'PATCH',
    headers: {
      authorization: '41411de9-cf42-4ce5-b3d1-441d6ba71a09',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      avatar: avatarUrl 
    })
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  });
};