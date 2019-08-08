const feedListContainer = document.querySelector('.feedList');
const feedContainer = document.querySelector('.feed');

export const renderFeedList = (coll) => {
  const keys = Object.keys(coll);
  const result = keys.reduce((acc, feedItem) => {
    const { title, url } = coll[feedItem];
    return `${acc}<a src="${url}" data-id="${feedItem}" class="list-group-item list-group-item-action">
      <p class="mb-1">${title}</p>
    </a>`;
  }, []);
  feedListContainer.innerHTML = `<ul class="list-group">${result}</ul>`;
};

export const renderFeed = (id, coll) => {
  const { url, content } = coll[id];
  const feedArticles = content.articles.reduce((acc, article) => `${acc}<li class="list-group-item d-flex align-items-center justify-content-between" data-guid="${article.guid}">
      <h3>${article.title}</h3>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" data-description="${article.description}">Description</button>
    </li>`, []);
  const feedContent = `<h2>${content.title}</h2>
  <p>${content.description}<p>
  <ul class="list-group">${feedArticles}</ul>`;
  feedContainer.innerHTML = `<div data-url="${url}">${feedContent}<div>`;
};
