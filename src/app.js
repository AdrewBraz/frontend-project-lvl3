import axios from 'axios';
import watchJs from 'melanke-watchjs';
import $ from 'jquery';
import uniqid from 'uniqid';
import _ from 'lodash';
import { renderFeed, renderFeedList } from './render';
import {
  updateUrl, checkRequestState, checkUrlState, updateDisable,
} from './controllers';
import state from './state';
import parseContent from './parsers';

const parser = new DOMParser();
const { watch } = watchJs;
const proxy = 'https://cors-anywhere.herokuapp.com/';


const app = () => {
  const input = document.getElementById('input');
  const form = document.getElementById('rss-form');
  const feedListContainer = document.querySelector('.feedList');

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
        getDataFromUrl(url)
          .then((feed) => {
            const { articles } = feed;
            const updatedFeed = _.unionBy(articles, content.articles, 'title');
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
    const feedUrl = input.value;
    state.requestState = 'loading';
    getDataFromUrl(feedUrl)
      .then((data) => {
        state.activeFeedId = uniqid();
        addFeed(state.activeFeedId, feedUrl, data);
        state.requestState = 'success';
      })
      .catch((err) => {
        state.requestState = 'error';
        console.log(err);
      });
  };

  setTimeout(updateRSSFeeds, 5000);

  watch(state, 'inputUrl', checkUrlState);
  watch(state, 'inputUrl', updateDisable);
  watch(state, 'requestState', checkRequestState);
  watch(state, 'activeFeedId', () => renderFeed(state.activeFeedId, state.feedCollection));
  watch(state, 'feedCollection', () => renderFeedList(state.feedCollection), 1, true);
  watch(state, 'modalDescription', () => $('body').find('.modal-body').text(state.modalDescription));

  input.addEventListener('input', (e) => {
    const { value } = e.target;
    updateUrl(value);
  });

  form.addEventListener('submit', (e) => {
    submitHandler(e);
  });

  feedListContainer.addEventListener('click', (e) => {
    state.activeFeedId = e.target.dataset.id;
  });

  $('#myModal').on('show.bs.modal', (e) => {
    const text = $(e.relatedTarget).data('description');
    state.modalDescription = text;
  });
};


export default app;
