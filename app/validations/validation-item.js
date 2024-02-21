const Joi = require("joi");

const validateItemDataTypes = (req, res, next) => {
  const schema = Joi.object({
    item_id: Joi.string().optional(),
    item_type: Joi.number().valid(0, 1, 2).optional(),
    browserTab_favIconURL: Joi.string().optional(),
    browserTab_title: Joi.string().optional(),
    browserTab_url: Joi.string().optional(),
    note_content: Joi.string().optional(),
    note_bgColor: Joi.string().optional(),
    doneStatus: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  next();
};

module.exports = { validateItemDataTypes };
