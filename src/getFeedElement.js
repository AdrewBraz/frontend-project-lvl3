export default (feed, name, type) => {
  switch (type) {
    case 'single':
      return feed.querySelector(name).textContent;
    case 'multiple':
      return feed.querySelectorAll(name);
    default:
      return null;
  }
};
