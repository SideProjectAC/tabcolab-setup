const { check, validationResult } = require('express-validator');
const {validateGroupDataTypes} = require('../models/group'); //middleware
const {validateItemDataTypes} = require('../models/item');//middleware


//NOTE- 如何與model關聯
// const validateDataTypes = [
//     validateGroupDataType,
//     validateItemDataType,
//     // // check('group_id').optional().isString(),
//     // // check('group_icon').optional().isString(),
//     // // check('group_title').optional().isString(),
//     // // check('items').optional().isArray(),
//     // // check('item_id').optional().isString(),
//     // // check('item_type').optional().isIn([0, 1, 2]),
//     // // check('browserTab_favIconURL').optional().isString(),
//     // // check('browserTab_title').optional().isString(),
//     // // check('browserTab_url').optional().isString(),
//     // // check('note_content').optional().isString(),
//     // // check('note_bgColor').optional().isString(),
//     // // check('doneStatus').optional().isBoolean(),
//     // // check('targetItem_position').optional().isInt({ strict: true }),//NOTE - "num" 還是可以
//     (req, res,next) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       next();
//     }

//   ];

const validateDataTypes = [
    validateGroupDataTypes,
    validateItemDataTypes,
    check('group_pos').optional().isInt({ strict: true }).withMessage('Group Position must be a Interger'),
    check('targetItem_position').optional().isInt({ strict: true }).withMessage('Target Item Position must be a Interger'), //FIXME - 強制型別轉換問題
        (req, res,next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
];



module.exports = validateDataTypes;