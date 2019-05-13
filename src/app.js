const express = require('express')
const badgen = require('badgen')
const path = require('path')

const db = require('./db')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.set('views', './src/views')
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'pug');


let e404 =''
db.get('error').then(res => {
  e404 = res})

const svgString = badgen({
  subject: 'hello',
  status: 'world',
  color: '0ff',
  style: 'flat',
})
db.put('svg', svgString)

app.get('/', (req,res) => {
  res.render('pages/index')
})

app.post('/gitlab', (req,res) => {
    const data = req.body.link.split('/')
  res.json({
    link: req.body.link,
    namespace: data[3],
    project: data[4] 
  })
})

app.get('/:id', async (req,res) => {
  res.set('Content-Type', 'image/svg+xml')
  const svg = await db.get(req.params.id)
  if(svg) res.send(svg)
  else res.send(e404)
})

app.listen(8000)

