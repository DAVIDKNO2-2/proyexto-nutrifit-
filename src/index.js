// Importamos las dependencias necesarias
const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/authRoutes');

// Creamos la aplicación de Express
const app = express();

// Puerto donde se ejecutará el servidor
const PORT = process.env.PORT || 3000;

// Middleware para interpretar datos de formularios (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para manejar sesiones
app.use(session({
  secret: 'nutrifit-secret-key', // Clave secreta para firmar la cookie de sesión
  resave: false,
  saveUninitialized: false
}));

// Servimos archivos estáticos (HTML, CSS, JS del cliente) desde la carpeta "public"
app.use(express.static(path.join(__dirname, '..', 'public')));

// Set view engine
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Usamos las rutas de autenticación (login, register, logout, etc.)
app.use('/', authRoutes);

// Ruta para el login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Ruta para obtener los datos de la sesión
app.get('/session', (req, res) => {
  if (req.session.userId) {
    // Si la sesión existe, devolver los datos de la sesión
    res.json({
      userName: req.session.userName,
      userEmail: req.session.userEmail
    });
  } else {
    // Si no hay sesión activa, devolver un error
    res.json({ error: 'No estás logueado' });
  }
});
