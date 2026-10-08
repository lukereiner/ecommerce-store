const express = require('express')
const path = require("path")
const app = express()
const loaders = require('./loaders')
const { PORT } = require('./config')

const startServer = async() => {

    app.use(express.json());

    const distPath = path.join(__dirname, '../dist');
    app.use(express.static(distPath));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'))
    })

    await loaders(app);

    app.listen(PORT, () => {
        console.log(`Server listening on PORT ${PORT}`);
    });
};

startServer();