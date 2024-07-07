const asyncHandler = require('express-async-handler');
const { User } = require('../models');

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ status: 'Not Found', message: 'User not found', statusCode: 404 });
    }

    res.status(200).json({
      status: 'success',
      message: 'User fetched successfully',
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'Bad Request', message: 'Client error', statusCode: 400 });
  }
});

module.exports = {
    getUser
};
