import 'bootstrap/dist/css/bootstrap.min.css';
import { isURL } from 'validator';
import axios from 'axios';
import watchJs from 'melanke-watchjs';
import getFeedElement from './getFeedElement';

const parser = new DOMParser();
const { watch } = watchJs;
const proxy = 'https://cors-anywhere.herokuapp.com/';

const app = () => {
  const state = {
    feedList: [],
    visitedUrls: [],
  };

  const isValid = value => isURL(value) && !state.visitedUrls.includes(value);
  const input = document.getElementById('text');
  const submit = document.querySelector('[type=submit]');

  const addFeed = (url, content) => {
    state.feedList.push({ url, content });
  };

  const addVisitedUrl = () => {
    const list = state.feedList.reduce((acc, feed) => [...acc, feed.url], []);
    state.visitedUrls = [...list];
    console.log(state);
  };

  const getContent = (feed) => {
    console.log(feed);
    const title = getFeedElement(feed, 'title', 'single');
    const description = getFeedElement(feed, 'description', 'single');
    const articles = [];
    getFeedElement(feed, 'item', 'multiple').forEach((article) => {
      const newArticle = {};
      newArticle.title = getFeedElement(article, 'title', 'single');
      newArticle.description = getFeedElement(article, 'description', 'single');
      newArticle.link = getFeedElement(article, 'link', 'single');
      articles.push(newArticle);
    });
    const newFeed = { title, description, articles };
    return newFeed;
  };


  watch(state.feedList, addVisitedUrl);

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

  submit.addEventListener('click', () => {
    if (input.value !== '' && isValid(input.value)) {
      const feedUrl = input.value;
      input.classList.remove('is-valid');
      input.value = '';
      axios(`${proxy}${feedUrl}`)
        .then(res => parser.parseFromString(res.data, 'text/xml'))
        .then(feed => addFeed(feedUrl, getContent(feed)))
        .catch(err => console.log(err));
    }
  });
};


app();
