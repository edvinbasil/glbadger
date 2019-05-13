const express = require('express')
const badgen = require('badgen')
const db = require('./db')

const app = express()



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

app.get('/:id', async (req,res) => {
  res.set('Content-Type', 'image/svg+xml')
  const svg = await db.get(req.params.id)
  if(svg) res.send(svg)
  else res.send(e404)
})

app.listen(8000)

