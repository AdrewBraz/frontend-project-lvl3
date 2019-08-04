import { isURL } from 'validator';
import state from './state';

const input = document.getElementById('input');
const message = document.getElementById('message');

const isVisitedUrl = (newUrl) => {
  const keys = Object.values(state.feedCollection);
  return keys.find(({ url }) => url === newUrl);
};

export const updateUrl = (value) => {
  const urlList = [
    {
      name: 'empty',
      check: url => url === '',
    },
    {
      name: 'notValid',
      check: url => !isURL(url),
    },
    {
      name: 'visited',
      check: url => isVisitedUrl(url),
    },
    {
      name: 'valid',
      check: url => url,
    },
  ];
  const { name } = urlList.find(({ check }) => check(value));
  state.inputUrl = name;
};

export const checkRequestState = () => {
  switch (state.requestState) {
    case 'loading':
      message.textContent = 'Your feed is loading';
      break;
    case 'success':
      message.textContent = 'URL added to Feed List';
      input.value = '';
      updateUrl('');
      console.log('loaded');
      break;
    case 'error':
      message.textContent = 'Something went wrong';
      console.log('error');
      break;
    default:
      break;
  }
};

export const checkUrlState = () => {
  switch (state.inputUrl) {
    case 'empty':
      input.classList.remove('is-valid', 'is-invalid');
      break;
    case 'notValid':
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      break;
    case 'visited':
      input.classList.add('is-valid');
      input.classList.add('is-invalid');
      break;
    case 'valid':
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      break;
    default:
      input.classList.remove('is-valid', 'is-invalid');
  }
};
