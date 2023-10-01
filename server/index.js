import express from 'express';
import path from 'path'
import cors from 'cors'
import axios from 'axios'
import parser from './parser'
import { v4 as uuidv4 } from 'uuid';


const app = express();


app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static('dist/public'))
app.use(cors())

app.get('/', (req, res) => {
    // getToken(auth, JSON.stringify({}))
    res.render('index', { title: 'RSS FEED'})
})

app.get('/api/pooling/*', async (req, res) => {
    const { url } = req.query
    const id = uuidv4()
    console.log(url, 'pooling')
    setTimeout(async() => {
        const data = await axios.get(url).then(response => {
            return parser(response.data)
        })
        console.log('time to answer')
        res.send({...data, id, url })
    }, 50000)
})

app.get('/api/*', async (req, res) => {
    const { url } = req.query
    const id = uuidv4()
    console.log(url)
    const data = await axios.get(url).then(response => {
        return parser(response.data)
    })
    res.send({...data, id, url, diff: 0 })
})

export default app  