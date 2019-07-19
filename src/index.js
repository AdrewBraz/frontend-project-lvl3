import 'bootstrap/dist/css/bootstrap.min.css';
import { isURL } from 'validator';

const app = () => {
  const state = {
    feedList: [],
    addFeed(url) {
      this.feedList.push({ url });
    },
  };

  const isValid = value => isURL(value) || !state.feedList.includes(value);

  const input = document.getElementById('text');
  input.addEventListener('input', (e) => {
    const { value } = e.target;
    if (value === '') {
      e.target.classList.remove('is-valid', 'is-invalid');
    } else if (isValid(value)) {
      e.target.classList.remove('is-invalid');
      e.target.classList.add('is-valid');
    } else {
      e.target.classList.remove('is-valid');
      e.target.classList.add('is-invalid');
    }
  });
};

app();
