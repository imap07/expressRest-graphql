const express = require('express');
const eventController = require('../controllers/event.controller');

const app = express();

app.post('/', eventController.create);
app.get('/list', eventController.getEvents);
app.get('/:id', eventController.getEvent);
app.put('/:id', eventController.update);
app.delete('/:id', eventController.delete);

module.exports = app;