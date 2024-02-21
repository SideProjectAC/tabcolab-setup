const { check, validationResult } = require('express-validator');

const { v4: uuidv4 } = require('uuid');

function generateGroupId() {
  return uuidv4();
}

const validateGroupDataTypes = [
    check('group_id').optional().isString().withMessage('Group ID must be a string'),
    check('group_icon').optional().isString().withMessage('Group Icon must be a string'),
    check('group_title').optional().isString().withMessage('Group Title must be a string'),
    check('items').optional().isArray(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      }
  ];
  

module.exports = { generateGroupId,validateGroupDataTypes,validationResult};
/**
 * @openapi
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         group_id:
 *           type: string
 *         group_icon:
 *           type: string
 *         group_title:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Item'
 */
