const { check, validationResult } = require("express-validator");

const { v4: uuidv4 } = require("uuid");

function generateItemId() {
  return uuidv4();
}

const validateItemDataTypes = [
  check("item_id")
    .optional()
    .isString()
    .withMessage("Item ID must be a string"),
  check("item_type")
    .optional()
    .isIn([0, 1, 2])
    .withMessage("Item Type invalidate"),
  check("browserTab_favIconURL")
    .optional()
    .isString()
    .withMessage("Browser Tab favIcon Url must be a string"),
  check("browserTab_title")
    .optional()
    .isString()
    .withMessage("Browser Tab Title must be a string"),
  check("browserTab_url")
    .optional()
    .isString()
    .withMessage("Browser Tab Url must be a string"),
  check("note_content")
    .optional()
    .isString()
    .withMessage("Note Content must be a string"),
  check("note_bgColor")
    .optional()
    .isString()
    .withMessage("Note Background Color must be a string"),
  check("doneStatus").optional().isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { generateItemId, validateItemDataTypes, validationResult };

/**
 * @openapi
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         item_id:
 *           type: string
 *         item_type:
 *           type: integer
 *           enum: [0, 1, 2]
 *           description: '0: Tab, 1: Note, 2: Todo'
 *         browserTab_favIconURL:
 *           type: string
 *         browserTab_title:
 *           type: string
 *         browserTab_url:
 *           type: string
 *         note_content:
 *           type: string
 *         note_bgColor:
 *           type: string
 *         doneStatus:
 *           type: boolean
 *           description: Indicates whether the todo is done or not
 */
