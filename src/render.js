export default (prop) => {
  const { url, content } = state.feedList[prop];
  const newItem = document.createElement('li');
  newItem.classList.add('list-group-item');
  newItem.dataset.url = url;
  const feedArticles = content.articles.reduce((acc, article) => `${acc}<li class="list-group-item d-flex justify-content-between">
        <h3>${article.title}</h3>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" data-description="${article.description}">Description</button>
      </li>`, []);
  const feedContent = `<h2>${content.title}</h2>
    <p>${content.description}<p>
    <ul class="list-group">${feedArticles}</ul>`;
  newItem.insertAdjacentHTML('beforeend', feedContent);
  document.body.appendChild(newItem);
};
