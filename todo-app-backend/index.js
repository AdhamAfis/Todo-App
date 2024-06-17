const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');
const xss = require('xss-clean');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(xss()); 

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User Signup
app.post(
  '/signup',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Email already exists' });
    }
  }
);

// User Signin
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(400).json({ error: 'Invalid email or password' });
  }
});

// Get User
app.get('/user', authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, email: true },
  });
  res.json(user);
});

// Get Todos
app.get('/todos', authenticateToken, async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: { userId: req.user.userId },
  });
  res.json(todos);
});

// Add Todo
app.post(
  '/todos',
  authenticateToken,
  body('title').trim().isLength({ min: 1, max: 255 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title } = req.body;
    const todo = await prisma.todo.create({
      data: {
        title,
        userId: req.user.userId,
      },
    });
    res.json(todo);
  }
);

// Update Todo
app.put('/todos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const todo = await prisma.todo.update({
    where: { id: parseInt(id) },
    data: { completed },
  });
  res.json(todo);
});

// Delete Todo
app.delete('/todos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  await prisma.todo.delete({
    where: { id: parseInt(id) },
  });
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
