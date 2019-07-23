import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal';
import { isURL } from 'validator';
import axios from 'axios';
import watchJs from 'melanke-watchjs';
import $ from 'jquery';
import render from './render';


const parser = new DOMParser();
const { watch } = watchJs;
const proxy = 'https://cors-anywhere.herokuapp.com/';

const app = () => {
  const state = {
    feedList: [],
    inputUrl: 'empty',
  };

  const input = document.getElementById('text');
  const submit = document.querySelector('[type=submit]');

  const addFeed = (url, content) => {
    state.feedList.push({ url, content });
    console.log(state);
  };

  const isVisitedUrl = (url) => {
    const listOfUrls = state.feedList.reduce((acc, feed) => [...acc, feed.url], []);
    return listOfUrls.includes(url);
  };

  const updateUrl = (value) => {
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

  const checkUrlState = () => {
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

  const getContent = (feed) => {
    const newFeed = { articles: [] };
    const elementList = ['title', 'description', 'link'];
    const articleList = feed.querySelectorAll('item');
    elementList.forEach((element) => {
      const value = feed.querySelector(element).textContent;
      newFeed[element] = value;
    });
    articleList.forEach((article) => {
      const newArticle = {};
      elementList.forEach((element) => {
        const value = article.querySelector(element).textContent;
        newArticle[element] = value;
      });
      newFeed.articles.push(newArticle);
    });
    return newFeed;
  };

  watch(state, 'inputUrl', checkUrlState);
  watch(state, 'feedList', render);

  input.addEventListener('input', (e) => {
    const { value } = e.target;
    updateUrl(value);
  });

  submit.addEventListener('click', () => {
    if (state.inputUrl === 'valid') {
      const feedUrl = input.value;
      input.classList.remove('is-valid');
      input.value = '';
      axios(`${proxy}${feedUrl}`)
        .then(res => parser.parseFromString(res.data, 'text/xml'))
        .then(feed => addFeed(feedUrl, getContent(feed)))
        .catch(err => console.log(err));
    }
  });

  $('#myModal').on('show.bs.modal', (e) => {
    const text = $(e.relatedTarget).data('description');
    $('body').find('.modal-body').text(text);
  });
};


app();
