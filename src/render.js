export const renderFeedList = (list) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  const result = list.reduce((acc, feedItem) => `<li class="list-group-item d-flex justify-content-between">
      <a src="${feedItem.url}">${feedItem.title}</a>
    </li>`, []);
  ul.insertAdjacentHTML('beforeend', result);
  return ul;
};

export const render = () => {

};
