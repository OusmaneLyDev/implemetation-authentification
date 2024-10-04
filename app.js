const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const secretKey = 'password123';

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const validEmail = 'utilisateur@example.com';
    const validPassword = 'motdepasse';

    if (email === validEmail && password === validPassword) {
        const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
        return res.json({ token });
    }

    res.status(401).json({ message: 'Email ou mot de passe incorrect' });
});

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Accès non autorisé : token manquant' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Accès non autorisé : token invalide' });
        req.user = user;
        console.log(req.user)
        next();
    });
}

app.get('/api/new-private-data', authenticateToken, (req, res) => {
    res.json({ message: 'Vous avez accédé à des données privées !' });
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
