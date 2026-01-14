const exprees = require('express');
const dataRoutes = require('./routes/data.routes');

const app = exprees();

app.use(exprees.json());
app.use('/api', dataRoutes);

module.exports = app;