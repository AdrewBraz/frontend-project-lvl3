const feedListContainer = document.querySelector('.feedList');
const feedContainer = document.querySelector('.feed');

export const renderFeedList = (list) => {
  const keys = Object.keys(list);
  const result = keys.reduce((acc, feedItem) => {
    const { title, url } = list[feedItem];
    return `${acc}<li class="list-group-item d-flex justify-content-between">
      <a src="${url}">${title}</a>
    </li>`;
  }, []);
  feedListContainer.innerHTML = `<ul class="list-group">${result}</ul>`;
};

export const renderFeed = (id, list) => {
  const { url, content } = list[id];
  const feedArticles = content.articles.reduce((acc, article) => `${acc}<li class="list-group-item d-flex justify-content-between">
      <h3>${article.title}</h3>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" data-description="${article.description}">Description</button>
    </li>`, []);
  const feedContent = `<h2>${content.title}</h2>
  <p>${content.description}<p>
  <ul class="list-group">${feedArticles}</ul>`;
  feedContainer.innerHTML = `<div data-url="${url}">${feedContent}<div>`;
};
