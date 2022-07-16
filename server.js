const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { type } = require('os');
const basicAuth = require('express-basic-auth');

const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());

// Requires basic auth with username "admin" and password "secret1234"

var staticUserAuth = basicAuth({
    users: {
        'admin': '123',
        'user': '123'
    },
    challenge: false
});

// app.use(staticUserAuth);


app.use(express.static(path.join(__dirname, '/client/build')))
   .listen(PORT, () => console.log(`Listening to port: ${PORT}`));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use(cookieParser('82e4e438a0705fabf61f9854e3b575af'));

app.get('/authenticate', staticUserAuth, (req, res) => {
    const options = {
        httpOnly: true,
        signed: true,
    };
    
    if (req.auth.user === 'admin') {
        res.cookie('name', 'admin', options).send({screen: 'admin'});
    } else if (req.auth.user === 'user') {
        res.cookie('name', 'user', options).send({screen: 'user'});
    }
});

app.get('/read-cookie', (req, res) => {
    console.log("signedCookies    === " + JSON.stringify(req.signedCookies));
    if (req.signedCookies.name === 'admin') {
        res.send({screen: 'admin'});
    } else if (req.signedCookies.name === 'user') {
        res.send({screen: 'user'});
    } else {
        res.send({screen: 'auth'});
    }
});

app.get('/clear-cookie', (req, res) => {
    res.clearCookie('name').end();
});

app.get('/get-data', (req, res) => {
    if (req.signedCookies.name == 'admin') {
        res.send('This is admin panel');
    } else if (req.signedCookies.name == 'user') {
        res.send('This is user data');
    } else {
        res.end();
    }
})

