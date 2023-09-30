import React, { FC } from 'react'
import { useTypedSelector } from '../hooks/useTypeSelector';
import { ListItem, IImage } from '../types'
import Image from 'react-bootstrap/Image';
import { CloseButton } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useAppDispatch } from '../hooks/AppDispatch';
import actions from '../actions';




const FeedList: FC = () => {
    const {list, activeId} = useTypedSelector(state => state.listSlice)
    const dispatch = useAppDispatch()

    const handleSwitch = (id: string) => {
      dispatch(actions.switchActiveFeed(id))
    }

    const handleDelete= (id: string) => {
      dispatch(actions.unSubscribefromFeed(id))
    }

    const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Cancel subscription
      </Tooltip>
    );

    const renderList = () => {
        const result = list.map((item: ListItem) => {
          const {link, image, id, title} = item;
          const active =  activeId === id ? 'active' : ''
          const color = active ? "link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" 
            :  "link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover"

          const {url, width, height} = image
          return (
            <li onClick={() => handleSwitch(id)} key={id} className={`list-group-item list-group-item-action ${active}`}>
                <a className={color} href={`${link}`}>{title}</a>
                <Image src={`${url}`} style={{width, height}}></Image>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <CloseButton onClick={() => handleDelete(id)} style={{top: "0", right: "0", position: 'absolute'}} />
                </OverlayTrigger>
                
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