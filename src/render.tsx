const feedListContainer = document.querySelector('.feedList') as HTMLUListElement
const feedContainer = document.querySelector('.feed') as HTMLDivElement

export const renderFeedList = (coll, activeId) => {
  const keys = Object.keys(coll);
  const result = keys
    .map((feedItem) => {
      const { title, url } = coll[feedItem];
      const active = feedItem === activeId ? 'active' : '';
      return `<a href="${url}" data-id="${feedItem}" class="list-group-item list-group-item-action ${active}">
        ${title}
      </a>`;
    })
    .join('');
  feedListContainer.innerHTML = `<ul class="list-group">${result}</ul>`;
};

export const renderFeed = (feed) => {
  const { link, articles, title, description } = feed[0];
  const feedArticles = articles
    .map(article => `<li class="list-group-item d-flex align-items-center justify-content-between" data-guid="${article.guid}">
      <h3>${article.title}</h3>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" data-description="${article.description}">Description</button>
      </li>`)
    .join('');
  const feedContent = `<h2>${title}</h2>
  <p>${description}<p>
  <ul class="list-group">${feedArticles}</ul>`;
  return `<div data-url="${link}">${feedContent}<div>`;
};
