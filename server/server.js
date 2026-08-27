const express = require('express')
const app = express()
const loaders = require('./loaders')
const { PORT } = require('./config')

const startServer = async() => {

    await loaders(app);

    app.listen(PORT, () => {
        console.log(`Server listening on PORT ${PORT}`);
    });
};

startServer();