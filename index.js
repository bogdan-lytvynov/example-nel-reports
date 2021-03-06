const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
var concat = require('concat-stream');
const app = express()
const PORT = process.env.PORT || 3001

app.use(morgan('combined'))
app.use(express.json({
  strict: false,
  type: 'application/reports+json'
}))

app.use((_, resp, next) => {
  resp.set('nel', JSON.stringify({
    'report_to': 'test',
    'max_age': 604800,
    "include_subdomains": true,
    "failure_fraction": 1.0
  }))

  resp.set('report-to', '{"endpoints":[{"url":"https:\\/\\/nel-reports.herokuapp.com\\/report"}],"group":"test","max_age":604800,"include_subdomains":true}')
  next()
})

const reports = []

app.get('/', (req, res) => {
    res.json(reports)
})

app.options('/report', cors(), (req, resp, next) => {
  resp.json({status: 'ok'})
})

app.post('/report', cors(), (req, resp, next) => {
  console.log(req.body)
  reports.push(req.body)
  resp.json({status: 'ok'})
})


app.get('/cors',  (req, resp) => {
  resp.json({status: 'ok'})
})

app.use(function(req, res, next){
    res.status(404);

    res.format({
          html: function () {
                  res.render('404', { url: req.url })
                },
          json: function () {
                  res.json({ error: 'Not found' })
                },
          default: function () {
                  res.type('txt').send('Not found')
                }
        })
});

// error-handling middleware, take the same form
// // as regular middleware, however they require an
// // arity of 4, aka the signature (err, req, res, next).
// // when connect has an error, it will invoke ONLY error-handling
// // middleware.
//
// // If we were to next() here any remaining non-error-handling
// // middleware would then be executed, or if we next(err) to
// // continue passing the error, only error-handling middleware
// // would remain being executed, however here
// // we simply respond with an error page.
//
app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);
  res.json({error: err });
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
