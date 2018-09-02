var express = require("express")
var UserModel = require('../model/user')
var _ = require('lodash')

var router = express.Router()

// User regist
router.post('/', async (req, res) => {
  let userBuf = _.pick(req.body, ['name', 'account', 'password'])
  let passwordConfirmed = req.body.password2

  // verify the two password is same
  if (userBuf.password !== passwordConfirmed){
    return res.json({
      result: false
    });
  }

  let user = new UserModel(userBuf)

  try {
    await user.save()

    let token = user.setAuthToken();
    res.header('x-auth', token)
      .json({
        result: true
      })
  } catch (err) {
    let errMsg;

    // custom err msg from mongoose err code
    if (err.code === 11000){
      errMsg = '帳號已有人使用'
    } else {
      errMsg = '未知錯誤'
    }

    res.json({
      result: false,
      errMsg,
      err
    })
  }
})

// User login
router.post('/login', async (req, res) => {
  let body = _.pick(req.body, ['account', 'password'])

  try {
    let user = await UserModel.findByCredentials(body.account, body.password)
    let token = user.setAuthToken()

    res.header('x-auth', token)
      .json({
        result: true
      })
  } catch (err) {
    res.json({
      result: false,
      errMsg: '帳號或密碼錯誤',
      err
    })
  }
})

// User logout
router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router;