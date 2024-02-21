const Joi = require("joi");

const validatePositionDataTypes = (req, res, next) => {
  const schema = Joi.object({
    group_pos: Joi.number().integer().optional(),
    targetItem_position: Joi.number().integer().optional(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  next();
};

module.exports = { validatePositionDataTypes };
