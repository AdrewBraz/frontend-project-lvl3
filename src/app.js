import axios from 'axios';
import { isURL } from 'validator';
import watchJs from 'melanke-watchjs';
import $ from 'jquery';
import uniqid from 'uniqid';
import _ from 'lodash';
import { renderFeed, renderFeedList } from './render';
import parseContent from './parser';

const { watch } = watchJs;
const proxy = 'https://cors-anywhere.herokuapp.com/';

const app = () => {
  const input = document.getElementById('input');
  const form = document.getElementById('rss-form');
  const feedListContainer = document.querySelector('.feedList');
  const message = document.getElementById('message');
  const submit = document.getElementById('submit-btn');

  const state = {
    feedCollection: {},
    inputUrl: 'empty',
    modalDescription: '',
    activeFeedId: '',
    requestState: null,
  };

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

  const updateMessage = () => {
    switch (state.requestState) {
      case 'loading':
        message.textContent = 'Your feed is loading';
        message.classList.replace('text-muted', 'text-info');
        break;
      case 'success':
        message.textContent = 'URL added to Feed List';
        message.classList.replace('text-info', 'text-success');
        // input.value = '';
        break;
      case 'error':
        message.textContent = 'Something went wrong';
        message.classList.replace('text-info', 'text-danger');
        // input.value = '';
        break;
      default:
        throw new Error('Uknown condition');
    }
  };

  const updateInput = () => {
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
        throw new Error('Uknown condition');
    }
  };

  const updateDisable = () => (state.inputUrl === 'valid' ? submit.removeAttribute('disabled') : submit.setAttribute('disabled', 'disabled'));

  const getDataFromUrl = feedUrl => axios(`${proxy}${feedUrl}`)
    .then(res => parseContent(res.data));

  const updateRSSFeeds = () => {
    const keys = Object.keys(state.feedCollection);
    if (keys === 0) {
      setTimeout(updateRSSFeeds, 5000);
    } else {
      keys.forEach((key) => {
        const { url, content } = state.feedCollection[key];
        getDataFromUrl(url)
          .then((feed) => {
            const { articles } = feed;
            const updatedFeed = _.unionBy(articles, content.articles, 'guid');
            updateFeed(key, updatedFeed);
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setTimeout(updateRSSFeeds, 5000);
          });
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const feedUrl = formData.get('input');
    state.requestState = 'loading';
    getDataFromUrl(feedUrl)
      .then((data) => {
        state.activeFeedId = uniqid();
        addFeed(state.activeFeedId, feedUrl, data);
        state.requestState = 'success';
      })
      .catch((err) => {
        state.requestState = 'error';
        e.target.reset();
        console.log(err);
      })
      .finally(() => {
        state.inputUrl = 'empty';
        e.target.reset();
      });
  };

  setTimeout(updateRSSFeeds, 5000);

  watch(state, 'inputUrl', updateInput);
  watch(state, 'inputUrl', updateDisable);
  watch(state, 'requestState', updateMessage);
  watch(state, 'activeFeedId', () => renderFeed(state.activeFeedId, state.feedCollection));
  watch(state, 'activeFeedId', () => renderFeedList(state.feedCollection, state.activeFeedId));
  watch(state, 'modalDescription', () => $('body').find('.modal-body').text(state.modalDescription));

  input.addEventListener('input', (e) => {
    const { value } = e.target;
    updateUrl(value);
  });

  form.addEventListener('submit', (e) => {
    submitHandler(e);
  });

  feedListContainer.addEventListener('click', (e) => {
    e.preventDefault();
    state.activeFeedId = e.target.dataset.id;
  });

  $('#myModal').on('show.bs.modal', (e) => {
    const text = $(e.relatedTarget).data('description');
    state.modalDescription = text;
  });
};


export default app;
