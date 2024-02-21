const User = require('../models/user.js');


const userController = {
    getUserinfo: (req, res, next) => {

/**
* @openapi
* parameters:
*   userIdParam:
*     name: id
*     in: path
*     description: ID of the user
*     required: true
*     schema:
*         $ref: '#/components/schemas/User/properties/id'
*/
const userId = req.params.id; // 从请求参数中获取用户 ID

try {
  // 模拟从数据库中查询用户信息
  const mockUser = {
    id: '1023',
    username: 'John Doe',
    age: 30,
    email: 'john.doe@example.com'
  };
//NOTE 應該要從models中直接引用mockUser，如何應對不止一筆數據的情況

/**
* @openapi
* responses:
*   userIdResponse200:
*     schema:
*       type: object
*       properties:
*         status:
*           type: string
*           example: 200
*         data:
*           properties:
*               username:
*                   $ref: '#/components/schemas/User/properties/username'
*               age:
*                   $ref: '#/components/schemas/User/properties/age'
*/
  // 构造响应数据
  const responseData = {
    status: '200',
    data: {
      username: mockUser.username,
      age: mockUser.age
    }
  };

  // 返回模拟的响应数据
  res.status(200).json(responseData);
} catch (error) {
  // 如果出现错误，返回500错误
  console.error('Error fetching user:', error);
  res.status(500).json({ error: 'Server error' });
}

  }
}

module.exports = userController


//以json server為備案（db.json）res{ dbjson} {username,age}<-res  =>middware篩選,，express寫