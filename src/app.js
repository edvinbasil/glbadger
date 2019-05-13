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

// badgen({
//   subject: 'hello',
//   status: 'world',
//   color: '0ff',
//   style: 'flat',
// })

app.get('/', (req,res) => {
  res.render('pages/index')
})

app.post('/hook', (req,res) => {
  const kind = req.body.object_kind;
  let dat = {}
  if(kind === 'pipeline'){
    dat.status = req.body.object_attributes.detailed_status;
    dat.id = req.body.project.id;
    dat.time = req.body.object_attributes.finished_at;
    dat.color = dat.status == 'passed' ? 'green' : 'orange'
    dat.pipeline = badgen({
      subject: 'pipeline',
      status: dat.status,
      color: dat.color,
      style: 'flat'
    })
    json = JSON.stringify(dat)
    db.put(dat.id, json)
  }
  res.end()
  console.log(req.body)
})

app.get('/:id', async (req,res) => {
  const dat = await db.get(req.params.id)
  const json = JSON.parse(dat)
  res.render('pages/project', json)
})
app.get('/:id/:type', async (req,res) => {
  const dat = await db.get(req.params.id)
  const json = JSON.parse(dat)
  // console.log(json)
  const type = req.params.type
  console.log(type)
  if(type in json){
    res.set('Content-Type', 'image/svg+xml')
    res.send(json[type])
  }  
  else res.status(404).send('Not Found')
})

app.listen(8000)

