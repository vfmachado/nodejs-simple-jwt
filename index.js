
const express = require('express');
const cors = require('cors');

const app = express();
const jwt = require('jsonwebtoken');

const users = [];

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

const isAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send('A token is required for authentication.');
    }
    try {
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
}

app.get('/users', isAuth, (req, res) => {
    res.send(users);
    }
);

app.post('/users', (req, res) => {
    const user = req.body;
    users.push(user);
    res.status(201).send(user);
    });

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find((user) => {
        return user.email === email && user.password === password;
    });
    if (user) {
        const token = jwt.sign(user, 'secret');
        res.status(200).send({ user, token });
    } else {
        res.status(404).send('User not found.');
    }
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
    }
);