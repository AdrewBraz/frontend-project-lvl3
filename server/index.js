import express from 'express';
import path from 'path'

const app = express();

app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static('dist'))

app.get('/', (req, res) => {
    res.render('index', { title: 'RSS FEED'})
})

export default app