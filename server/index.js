import express from 'express';
import path from 'path'
import cors from 'cors'
import axios from 'axios'
import parser from './parser'

const app = express();

app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static('dist/public'))
app.use(cors())

app.get('/', (req, res) => {
    res.render('index', { title: 'RSS FEED'})
})

app.get('/rss*', async (req, res) => {
    const { url } = req.query
    await axios.get(url).then(response => {
        parser(response.data)
    })
    res.send({status: "something"})
})

export default app