import axios from 'axios';

const proxy = 'https://cors-anywhere.herokuapp.com/';

const parseFeedElements = (listOfElements, node, obj) => {
  const newObject = obj;
  listOfElements.forEach((element) => {
    const value = node.querySelector(element).textContent;
    newObject[element] = value;
  });
  return obj;
};

const parseContent = (data) => {
  const parser = new DOMParser();
  const feedData = parser.parseFromString(data, 'text/xml');
  const newFeed = { articles: [] };
  const elementList = ['title', 'description', 'link'];
  const articleList = feedData.querySelectorAll('item');
  parseFeedElements(elementList, feedData, newFeed);
  articleList.forEach((article) => {
    const newArticle = {};
    parseFeedElements([...elementList, 'guid'], article, newArticle);
    newFeed.articles.push(newArticle);
  });
  return newFeed;
};

export default feedUrl => axios(`${proxy}${feedUrl}`)
  .then(res => parseContent(res.data));
