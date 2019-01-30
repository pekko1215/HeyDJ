const express = require('express')
const app = express()
const https = require('https')
const fs = require('fs')
const port = 3000

app.use(express.static('./'));

const httpsOptions = {
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./keys/cert.pem')
}
const server = https.createServer(httpsOptions, app).listen(port, () => {
  console.log('server running at ' + port)
})