const express = require('express');
const basicAuth = require('express-basic-auth')
const app = express();
app.use(basicAuth({
    users: { 'admin': '123' },
    challenge: false,
}))
app.get('/', (req, res) => {
  res.send('authorized');
});
app.listen(5000, () => console.log('server started'));

