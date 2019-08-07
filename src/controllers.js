import { isURL } from 'validator';
import state from './state';

const input = document.getElementById('input');
const message = document.getElementById('message');
const submit = document.getElementById('submit-btn');

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
      message.classList.replace('text-muted', 'text-info');
      break;
    case 'success':
      message.textContent = 'URL added to Feed List';
      message.classList.replace('text-info', 'text-success');
      input.value = '';
      updateUrl('');
      console.log('loaded');
      break;
    case 'error':
      message.textContent = 'Something went wrong';
      message.classList.replace('text-info', 'text-danger');

      input.value = '';
      updateUrl('');
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
      setTimeout(() => {
        message.classList.remove('text-success', 'text-danger');
        message.classList.add('text-muted');
        message.textContent = 'Please, be sure your URL is valid';
      }, 5000);
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

export const updateDisable = () => (state.inputUrl === 'valid' ? submit.removeAttribute('disabled') : submit.setAttribute('disabled', 'disabled'));
