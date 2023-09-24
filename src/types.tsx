export interface IContent{
  title: string,
  description: string,
  url: string,
  guid: string,
  link: string,
  pubDate: string
}
  
export interface IImage{
  url: string,
  width: number,
  height: number,
}

export interface ListItem{
  title: string,
  image: IImage,
  id: string,
  link: string
}
  
export interface IFeed {
  title: string,
  description: string,
  link: string,
  image: IImage
  articles: IContent[],
  id: string
}