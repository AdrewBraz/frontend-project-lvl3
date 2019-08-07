export default (feed) => {
  console.log(feed);
  const newFeed = { articles: [] };
  const elementList = ['title', 'description', 'link'];
  const articleElementsList = [...elementList, 'guid'];
  const articleList = feed.querySelectorAll('item');
  elementList.forEach((element) => {
    const value = feed.querySelector(element).textContent;
    newFeed[element] = value;
  });
  articleList.forEach((article) => {
    const newArticle = {};
    articleElementsList.forEach((element) => {
      const value = article.querySelector(element).textContent;
      newArticle[element] = value;
    });
    newFeed.articles.push(newArticle);
  });
  return newFeed;
};
