import { isURL } from 'validator';
import axios from 'axios';
import watchJs from 'melanke-watchjs';
import $ from 'jquery';
import uniqid from 'uniqid';
import { renderFeed, renderFeedList } from './render';
import { XMLParser } from 'fast-xml-parser';

const { watch } = watchJs;
const proxy = 'https://cors-anywhere/';
const parser = new XMLParser()

export default () => {
  const input = document.getElementById('input') as HTMLInputElement
  const form = document.getElementById('rss-form') as HTMLFormElement
  const feedListContainer = document.querySelector('.feedList')  as HTMLUListElement
  const message = document.getElementById('message') as HTMLDivElement
  const submit = document.getElementById('submit-btn') as HTMLButtonElement

interface IContent{
  title: string,
  description: string,
  url: string,
  guid: string
}

interface IFeed {
  url: string,
  content: IContent,
  title: string
}

interface State {
  feedCollection: IFeed,
  inputUrlState: string,
  modalDescription: string,
  activeFeedId: string,
  requestState: string
}

  const state: State = {
    feedCollection: {} as IFeed,
    inputUrlState: 'empty',
    modalDescription: '',
    activeFeedId: '',
    requestState: '',
  };

  const addFeed = (id: number, url: string, content: IContent): void => {
    state.feedCollection[id] = { url, content, title:  content.title};
  };

  const updateFeed = (id: number, updatedArticles: string[]): void => {
    const { content } = state.feedCollection[id];
    content.articles = updatedArticles;
  };

  const isVisitedUrl = (newUrl: string) => {
    const keys = Object.values(state.feedCollection);
    return keys.find(({ url }) => url === newUrl);
  };

  const getDataFromUrl = (feedUrl: string) => axios.get<IFeed>(`${proxy}${feedUrl}`)
    .then(res => parser.parse(res.data));

  const updateUrlState = (value: string) => {
    interface IUrlList {
      name: any;
      check: (url: string) => string | boolean
    }

    const urlList: IUrlList[] = [
      {
        name: 'empty',
        check: (url: string): boolean => url === '',
      },
      {
        name: 'notValid',
        check: (url: string): boolean => !isURL(url),
      },
      {
        name: 'visited',
        check: (url: string): boolean => isVisitedUrl(url),
      },
      {
        name: 'valid',
        check: (url: string): string => url,
      },
    ];
    const result = urlList.find(({ check }) => check(value));
    state.inputUrlState = result?.name;
  };

  const updateInterval = 5000;

  const updateRSSFeeds = () => {
    const keys = Object.keys(state.feedCollection);
    if (keys.length === 0) {
      setTimeout(updateRSSFeeds, updateInterval);
    } else {
      keys.forEach((key) => {
        const { url, content } = state.feedCollection[key];
        console.log(url);
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
            setTimeout(updateRSSFeeds, updateInterval);
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
        console.log(err);
      })
      .finally(() => {
        state.inputUrlState = 'empty';
      });
  };

  setTimeout(updateRSSFeeds, updateInterval);

  watch(state, 'inputUrlState', () => {
    switch (state.inputUrlState) {
      case 'empty':
        input.classList.remove('is-valid', 'is-invalid');
        setTimeout(() => {
          message.classList.remove('text-success', 'text-danger');
          message.classList.add('text-muted');
          message.textContent = 'Please, be sure your URL is valid';
        }, updateInterval);
        break;
      case 'notValid':
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        break;
      case 'visited':
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        break;
      case 'valid':
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        break;

      default:
        throw new Error('Uknown condition');
    }
  });
  watch(state, 'inputUrlState', () => (state.inputUrlState === 'valid' ? submit.removeAttribute('disabled') : submit.setAttribute('disabled', 'disabled')));
  watch(state, 'requestState', () => {
    switch (state.requestState) {
      case 'loading':
        message.textContent = 'Your feed is loading';
        message.classList.replace('text-muted', 'text-info');
        input.setAttribute('disabled', 'disabled');
        submit.setAttribute('disabled', 'disabled');
        break;
      case 'success':
        message.textContent = 'URL added to Feed List';
        message.classList.replace('text-info', 'text-success');
        input.removeAttribute('disabled');
        submit.removeAttribute('disabled');
        form.reset();
        break;
      case 'error':
        message.textContent = 'Something went wrong';
        message.classList.replace('text-info', 'text-danger');
        input.removeAttribute('disabled');
        submit.removeAttribute('disabled');
        break;
      default:
        throw new Error('Uknown condition');
    }
  });
  watch(state, 'activeFeedId', () => renderFeed(state.activeFeedId, state.feedCollection));
  watch(state, 'activeFeedId', () => renderFeedList(state.feedCollection, state.activeFeedId));
  watch(state, 'modalDescription', () => $('body').find('.modal-body').text(state.modalDescription));

  input.addEventListener('input', (e) => {
    const { value } = e.target;
    updateUrlState(value);
  });

  form.addEventListener('submit', submitHandler);

  feedListContainer.addEventListener('click', (e) => {
    e.preventDefault();
    state.activeFeedId = e.target.dataset.id;
  });

  $('#myModal').on('show.bs.modal', (e) => {
    const text = $(e.relatedTarget).data('description');
    state.modalDescription = text;
  });
};
