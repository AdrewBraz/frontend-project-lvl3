import { XMLParser } from 'fast-xml-parser/src/fxp'

const parseFeedElements = (listOfElements, node, obj) => {
  const newObject = obj;
  listOfElements.forEach((element) => {
    const value = node.querySelector(element).textContent;
    newObject[element] = value;
  });
  return obj;
};

export default (data) => {
  const parser =  new XMLParser();
  const feedData = parser.parse(data);
  const { rss } = feedData;
  console.log(rss.channel.item)
  // const newFeed = { articles: [] };
  // const elementList = ['title', 'description', 'link'];
  // const articleList = feedData.querySelectorAll('item');
  // parseFeedElements(elementList, feedData, newFeed);
  // articleList.forEach((article) => {
  //   const newArticle = {};
  //   parseFeedElements([...elementList, 'guid'], article, newArticle);
  //   newFeed.articles.push(newArticle);
  // });
  // return newFeed;
};
