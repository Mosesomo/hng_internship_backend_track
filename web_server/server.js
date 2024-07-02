const express = require('express');
const dotenv = require('dotenv').config();
const route = require('./routes/route')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get('/', (req, res) => {
    res.status(200).json({message: "Hello!! Welcome"})
});

app.use('/api', route);

app.listen(port, () => {
    console.log(`server listening on port: ${port}`)
})