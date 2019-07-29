import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal';
import { isURL } from 'validator';
import axios from 'axios';
import watchJs from 'melanke-watchjs';
import $ from 'jquery';
import uniqid from 'uniqid';
import _ from 'lodash';
import { renderFeedList, renderFeed } from './render';

const parser = new DOMParser();
const { watch } = watchJs;
const proxy = 'https://cors-anywhere.herokuapp.com/';

const app = () => {
  const state = {
    feedList: {},
    inputUrl: 'empty',
    modalDescription: '',
    activeFeedId: '',
  };

  const input = document.getElementById('text');
  const submit = document.querySelector('[type=submit]');

  const addFeed = (id, url, content) => {
    state.feedList[id] = { url, content, title: content.title };
  };

  const updateFeed = (id, updatedArticles) => {
    const { content } = state.feedList[id];
    content.articles = updatedArticles;
  };

  const isVisitedUrl = (newUrl) => {
    const keys = Object.keys(state.feedList);
    const listOfUrls = keys.reduce((acc, feed) => {
      const { url } = state.feedList[feed];
      return [...acc, url];
    }, []);
    return listOfUrls.includes(newUrl);
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

  const updateRSSFeeds = () => {
    const keys = Object.keys(state.feedList);
    if (keys === 0) {
      setTimeout(updateRSSFeeds, 5000);
    } else {
      keys.forEach((key) => {
        const { url, content } = state.feedList[key];
        axios(`${proxy}${url}`)
          .then(res => parser.parseFromString(res.data, 'text/xml'))
          .then((feed) => {
            const { articles } = getContent(feed);
            const updatedFeed = _.unionBy(articles, content.articles, 'title');
            updateFeed(key, updatedFeed);
            setTimeout(updateRSSFeeds, 5000);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }
  };

  setTimeout(updateRSSFeeds, 5000);

  watch(state, 'inputUrl', checkUrlState);
  watch(state, 'feedList', () => renderFeed(state.activeFeedId, state.feedList), 3, true);
  watch(state, 'feedList', () => renderFeedList(state.feedList));
  watch(state, 'modalDescription', () => $('body').find('.modal-body').text(state.modalDescription));

  input.addEventListener('input', (e) => {
    const { value } = e.target;
    updateUrl(value);
  });

  submit.addEventListener('click', () => {
    if (state.inputUrl === 'valid') {
      const feedUrl = input.value;
      const id = uniqid();
      state.activeFeedId = id;
      input.value = '';
      updateUrl(input.value);
      axios(`${proxy}${feedUrl}`)
        .then(res => parser.parseFromString(res.data, 'text/xml'))
        .then(feed => addFeed(id, feedUrl, getContent(feed)))
        .catch(err => console.log(err));
    }
  });

  $('#myModal').on('show.bs.modal', (e) => {
    const text = $(e.relatedTarget).data('description');
    state.modalDescription = text;
  });
};


export default app;
