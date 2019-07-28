export const renderFeedList = (list) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  const keys = Object.keys(list);
  const result = keys.reduce((acc, feedItem) => {
    const { title, url } = list[feedItem];
    return `<li class="list-group-item d-flex justify-content-between">
      <a src="${url}">${title}</a>
    </li>`;
  }, []);
  ul.insertAdjacentHTML('beforeend', result);
  return ul;
};

export const render = (id, list) => {
  const { url, content } = list[id];
  const newItem = document.createElement('div');
  newItem.classList.add('list-group');
  newItem.dataset.url = url;
  const feedArticles = content.articles.reduce((acc, article) => `${acc}<li class="list-group-item d-flex justify-content-between">
      <h3>${article.title}</h3>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" data-description="${article.description}">Description</button>
    </li>`, []);
  const feedContent = `<h2>${content.title}</h2>
  <p>${content.description}<p>
  <ul class="list-group">${feedArticles}</ul>`;
  newItem.insertAdjacentHTML('beforeend', feedContent);
  return newItem;
};
