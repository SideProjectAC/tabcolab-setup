const Joi = require("joi");

const validateGroupDataTypes = (req, res, next) => {
  const schema = Joi.object({
    group_id: Joi.string().optional(),
    group_icon: Joi.string().optional(),
    group_title: Joi.string().optional(),
    items: Joi.array().optional(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  next();
};

module.exports = { validateGroupDataTypes };
