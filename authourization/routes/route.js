const { register, login } = require('../controllers/authController');
const { getUser } = require('../controllers/userController')
const express = require('express');
const { check } = require('express-validator');
const authenticateToken = require('../middleware/auth');
const {getAllOrganisations, createOrganisation, addUserToOrganisation, getOrganisation} = require('../controllers/organisationController');
const router = express.Router();

router.post('/auth/register', [
    check('firstName').not().isEmpty().withMessage('Firt name is required!'),
    check('lastName').not().isEmpty().withMessage('Last name is required!'),
    check('email').not().isEmpty().withMessage('Enter a valid email!'),
    check('password').not().isEmpty().withMessage('password must be atleast 8 characters long'),
], register);
router.post('/auth/login', [
    check('email').not().isEmpty().withMessage('Enter a valid email!'),
    check('password').not().isEmpty().withMessage('password must be atleast 8 characters long'),
], login);

router.get('/api/users/:id', authenticateToken, getUser);
router.get('/api/organisations', authenticateToken, getAllOrganisations);
router.get('/api/organisations/:orgId', authenticateToken, getOrganisation);
router.post('/api/organisations', authenticateToken, [
  check('name').not().isEmpty().withMessage('Name is required')
], createOrganisation);
router.post('/api/organisations/:orgId/users', authenticateToken, addUserToOrganisation);


module.exports = router;
