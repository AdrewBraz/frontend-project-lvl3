import { XMLParser } from 'fast-xml-parser/src/fxp'


export default (url) => {
  const parser =  new XMLParser();
  const feedData = parser.parse(url);
  const { rss: { channel } } = feedData;
  const { title, description, image, link, item} = channel
  return { title, description, image, link, articles: item}
};
