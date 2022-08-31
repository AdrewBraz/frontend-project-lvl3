import express from 'express';
import path from 'path'
import cors from 'cors'
import axios from 'axios'
import parser from './parser'
import https from './rss'
import Feedly from 'feedly';

const app = express();

const feedly = new Feedly({
    client_id: "sandbox",
    client_secret: "NdyYvHssp6H6c2iTiU6mMaBQQ409pMOy",
    base: 'https://sandbox7.feedly.com/',
    port: 8080
})

app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static('dist/public'))
app.use(cors())

app.get('/', (req, res) => {
    res.render('index', { title: 'RSS FEED'})
})

app.get('/rss*', async (req, res) => {
    const postData = JSON.stringify({});
    https.on('error', (e) => {
        console.error(e);
      });
      
    https.write(postData);
    https.end();
    const { url } = req.query
    await axios.get(url).then(response => {
        parser(response.data)
    })
    res.send({status: "something"})
})

export default app