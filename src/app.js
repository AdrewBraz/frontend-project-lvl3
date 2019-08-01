import { isURL } from 'validator';
import axios from 'axios';
import watchJs from 'melanke-watchjs';
import $ from 'jquery';
import uniqid from 'uniqid';
import _ from 'lodash';
import {  renderFeed, renderFeedList } from './render';

const parser = new DOMParser();
const { watch } = watchJs;
const proxy = 'https://cors-anywhere.herokuapp.com/';

const app = () => {
  const state = {
    feedCollection: {},
    inputUrl: 'empty',
    modalDescription: '',
    activeFeedId: '',
    requestState: null,
  };

  const input = document.getElementById('input');
  const form = document.getElementById('rss-form');
  const message = document.getElementById('message');

  const addFeed = (id, url, content) => {
    state.feedCollection[id] = { url, content, title: content.title };
  };

  const updateFeed = (id, updatedArticles) => {
    const { content } = state.feedCollection[id];
    content.articles = updatedArticles;
  };

  const isVisitedUrl = (newUrl) => {
    const keys = Object.values(state.feedCollection);
    return keys.find(({ url }) => url === newUrl);
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

  const checkRequestState = () => {
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

  const updateRSSFeeds = () => {
    const keys = Object.keys(state.feedCollection);
    if (keys === 0) {
      setTimeout(updateRSSFeeds, 5000);
    } else {
      keys.forEach((key) => {
        const { url, content } = state.feedCollection[key];
        axios(`${proxy}${url}`)
          .then(res => parser.parseFromString(res.data, 'text/xml'))
          .then((feed) => {
            const { articles } = getContent(feed);
            const updatedFeed = _.unionBy(articles, content.articles, 'title');
            updateFeed(key, updatedFeed);
          })
          .finally()
          .catch((err) => {
            console.error(err);
          });
      });
    }
  };

  setTimeout(updateRSSFeeds, 5000);

  watch(state, 'inputUrl', checkUrlState);
  watch(state, 'requestState', checkRequestState);
  watch(state, 'feedCollection', () => renderFeed(state.activeFeedId, state.feedCollection), 3, true);
  watch(state, 'feedCollection', () => renderFeedList(state.feedCollection));
  watch(state, 'modalDescription', () => $('body').find('.modal-body').text(state.modalDescription));

  input.addEventListener('input', (e) => {
    const { value } = e.target;
    updateUrl(value);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.inputUrl !== 'valid') {
      message.textContent = 'URL is not valid';
    } else {
      const feedUrl = input.value;
      state.activeFeedId = uniqid();
      state.requestState = 'loading';
      axios(`${proxy}${feedUrl}`)
        .then(res => parser.parseFromString(res.data, 'text/xml'))
        .then(feed => {
          state.requestState = 'success';
          addFeed(state.activeFeedId, feedUrl, getContent(feed))
        })
        .catch(err => console.log(err));
    }
  });

  $('#myModal').on('show.bs.modal', (e) => {
    const text = $(e.relatedTarget).data('description');
    state.modalDescription = text;
  });
};


export default app;
