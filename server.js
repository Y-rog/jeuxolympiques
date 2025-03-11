const express = require('express');
const path = require('path');

const app = express();

// Indique à Express de servir les fichiers statiques
app.use(express.static(__dirname + '/dist/jeuxolympiques/browser/'));

// Redirige toutes les requêtes vers index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/jeuxolympiques/browser/index.html'));
});

// Le port que Heroku choisira automatiquement
app.listen(process.env.PORT || 8080, () => {
  console.log('Server started on port 8080');
});

