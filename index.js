const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(morgan('combined'))

const reports = []

app.get('/', (req, res) => {
    res.json(reports)
})

app.post('/report', (req, resp) => {
  reports.push(req.body)
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
  res.render('500', { error: err });
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
