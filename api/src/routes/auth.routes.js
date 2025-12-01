const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const { validateLogin } = require('../middlewares/validation');
const { requireAuth } = require('../middlewares/auth');

/**
 * POST /api/auth/login
 * Login de funcionário
 */
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    
    const result = await authService.login(email, senha);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/verify
 * Verificar token JWT
 */
router.post('/verify', requireAuth, async (req, res, next) => {
  try {
    // Se chegou aqui, o token é válido (verificado pelo middleware requireAuth)
    res.json({
      valid: true,
      funcionario: req.user
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
