import express from 'express';
import path from 'path'
import cors from 'cors'
import axios from 'axios'
import parser from './parser'
import routes from './routes';
import getToken from './rss'
import Feedly from 'feedly';

const app = express();
const postData = JSON.stringify({});
const options = {
    hostname: 'datorss.com',
    port: 443,
    path: '/api/tokens',
    method: 'POST',
    headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'Content-Length': postData.length
       }
  };

app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static('dist/public'))
app.use(cors())

app.get('/', (req, res) => {
    const postData = JSON.stringify({})
    const {auth} = routes(postData)
    // getToken(auth, JSON.stringify({}))
    res.render('index', { title: 'RSS FEED'})
})

app.get('/api/*', async (req, res) => {
    const { url } = req.query
    console.log(url)
    const data = await axios.get(url).then(response => {
        return parser(response.data)
    })
        res.send(data)
})

export default app