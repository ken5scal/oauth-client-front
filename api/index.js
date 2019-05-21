const express = require('express')
const app = express()

app.get('/hello', (req, res) => res.send('world'))
app.get('/authorize/callback', function(req, res) {
  console.log(req.query)
  res.json({ authz: req.query })
})

module.exports = {
  path: '/api',
  handler: app
}
