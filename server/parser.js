import { XMLParser } from 'fast-xml-parser/src/fxp'


export default (data) => {
  const parser =  new XMLParser();
  const feedData = parser.parse(data);
  const { rss: { channel } } = feedData;
  const { title, description, image, link, item} = channel
  return { title, description, image, link, articles: item}
};
