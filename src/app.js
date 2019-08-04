import axios from 'axios';
import watchJs from 'melanke-watchjs';
import $ from 'jquery';
import uniqid from 'uniqid';
import _ from 'lodash';
import { renderFeed, renderFeedList } from './render';
import { updateUrl, checkRequestState, checkUrlState } from './controllers';
import state from './state';
import parseContent from './parsers';

const parser = new DOMParser();
const { watch } = watchJs;
const proxy = 'https://cors-anywhere.herokuapp.com/';


const app = () => {
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


  const getDataFromUrl = feedUrl => axios(`${proxy}${feedUrl}`)
    .then(res => parser.parseFromString(res.data, 'text/xml'))
    .then(feed => parseContent(feed));

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
            const { articles } = parseContent(feed);
            const updatedFeed = _.unionBy(articles, content.articles, 'title');
            updateFeed(key, updatedFeed);
          })
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
      getDataFromUrl(feedUrl)
        .then((data) => {
          addFeed(state.activeFeedId, feedUrl, data);
          state.requestState = 'success';
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
