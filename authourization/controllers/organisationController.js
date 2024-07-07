const { Organisation, User } = require('../models');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const getAllOrganisations = asyncHandler( async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: Organisation
    });

    res.status(200).json({
      status: 'success',
      message: 'Organisations fetched successfully',
      data: {
        organisations: user.Organisations
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'Bad Request', message: 'Client error', statusCode: 400 });
  }
});

const getOrganisation = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  try {
    const organisation = await Organisation.findByPk(orgId);

    if (!organisation) {
      return res.status(404).json({ status: 'Not Found', message: 'Organisation not found', statusCode: 404 });
    }

    res.status(200).json({
      status: 'success',
      message: 'Organisation fetched successfully',
      data: organisation
    });
  } catch (error) {
    res.status(400).json({ status: 'Bad Request', message: 'Client error', statusCode: 400 });
  }
});

const createOrganisation = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map(err => ({ field: err.param, message: err.msg })) });
  }

  const { name, description } = req.body;

  try {
    const orgId = uuidv4();
    const newOrganisation = await Organisation.create({ orgId, name, description });

    const user = await User.findByPk(req.user.userId);
    await user.addOrganisation(newOrganisation);

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: newOrganisation
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 'Bad Request', message: 'Client error', statusCode: 400 });
  }
});

const addUserToOrganisation = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  try {
    const organisation = await Organisation.findByPk(orgId);
    const user = await User.findByPk(userId);

    if (!organisation || !user) {
      return res.status(404).json({ status: 'Not Found', message: 'Organisation or User not found', statusCode: 404 });
    }

    await organisation.addUser(user);

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully'
    });
  } catch (error) {
    res.status(400).json({ status: 'Bad Request', message: 'Client error', statusCode: 400 });
  }
});

module.exports = {
  getAllOrganisations,
  getOrganisation,
  createOrganisation,
  addUserToOrganisation
};

