const express = require('express')
const compression = require('compression')

const app = express()
const history = require('connect-history-api-fallback')
app.use(history())
app.use(compression())
app.use(express.static('../dist'))

app.listen(80, '127.0.0.1', () => console.log('80端口开启'))
