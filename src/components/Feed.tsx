import React, {FC} from 'react'
import { IFeed, IContent, ListItem } from '../types'
import {Accordion, Button } from 'react-bootstrap';
import { useTypedSelector } from '../hooks/useTypeSelector';
import { useAppDispatch } from '../hooks/AppDispatch';
import actions from '../actions';


interface Props {
  feed: IFeed
}

const Feed: FC<Props> = (props: Props) => {
  const dispatch = useAppDispatch()
  const {list} = useTypedSelector(state => state.listSlice)

  const { link, articles, title, description, id, image } = props.feed;

  const subscribeHandler = () => {
    const obj: ListItem = {
      title,
      image,
      link,
      id
    }
    const isExsist = list.some((item: ListItem) => item.link === obj.link)
    if(!isExsist){
      dispatch(actions.subscribetoFeed(obj))
    }

    console.log('allready here')

  }

  const feedArticles = articles.map( (article:IContent ) => { 
      return (
        <div key={`${article.guid}`}>
          <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>{article.title}</Accordion.Header>
            <Accordion.Body>
              <p>{article.description}</p>
              <span>{article.pubDate}</span>
              <a href={`${article.link}`}>{article.link}</a>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        </div>
      )
    })

  return (
    <div data-url={link}>
     <div className="d-inline-flex justify-content-between w-100">
       <h2>{title}</h2>
       <Button onClick={subscribeHandler} variant='primary'>Follow</Button>
     </div>
      <p>{description}</p>
      <ul className='list-group'>
        {feedArticles}
      </ul>
    </div>
    )

};

export default Feed
