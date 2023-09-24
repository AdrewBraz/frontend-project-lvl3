import React, { FC } from 'react'
import { useTypedSelector } from '../hooks/useTypeSelector';
import { ListItem, IImage } from '../types'
import Image from 'react-bootstrap/Image';
import { useAppDispatch } from '../hooks/AppDispatch';
import actions from '../actions';



const FeedList: FC = () => {
    const {list, activeId} = useTypedSelector(state => state.listSlice)
    const dispatch = useAppDispatch()

    const handleSwitch = (id) => {
      dispatch(actions.switchActiveFeed(id))
    }

    const renderList = () => {
        const result = list.map((item: ListItem) => {
          const {link, image, id, title} = item;
          const active =  activeId === id ? 'active' : ''
          const {url, width, height} = image
          return (
            <li onClick={() => handleSwitch(id)} key={id} className={`list-group-item list-group-item-action ${active}`}>
                <a href={`${link}`}>{title}</a>
                <Image src={`${url}`} style={{width, height}}></Image>
            </li>
          )
        })
        return result
    }

    return (
        <ul  className="list-group">
          {renderList()}
        </ul>
    )
}

export default FeedList