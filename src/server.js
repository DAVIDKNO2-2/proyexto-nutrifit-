const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Set view engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Routes
const mainRoutes = require('../routes/main');
app.use('/', mainRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
