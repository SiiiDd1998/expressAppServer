const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const newsRouter = require('./routes/news.js')
const testLocal = require('./routes/testLocal')

const app = express();

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/news', newsRouter)
app.use('/testlocal', testLocal)

module.exports = app;
