const Joi = require("joi");
const { validateGroupDataTypes } = require("./validation-group");
const { validateItemDataTypes } = require("./validation-item");
const { validatePositionDataTypes } = require("./validation-position");

const validateDataTypes = (req, res, next) => {
  const schema = Joi.object({
    ...validateGroupDataTypes,
    ...validateItemDataTypes,
    ...validationPosition,
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  next();
};

module.exports = validateDataTypes;
