const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbconnect = require('./dbconnect')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const newsRouter = require('./routes/news')
const relationsRouter = require('./routes/relations')

const app = express();

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/evaluateImpact', newsRouter);
app.use('/relations', relationsRouter);

dbconnect()

module.exports = app;
