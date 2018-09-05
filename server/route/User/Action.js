var express = require('express')
var UserModel = require('../../model/user')
var _ = require('lodash')

var router = express.Router()

router.get('/follow/:UserId', async (req, res) => {
  if (!req.user) {
    return res.json({
      result: false,
      errMsg: '尚未登入'
    })
  }

  try {
    let targetUser = await UserModel.findOne({account: req.params.UserId})
    if (!targetUser) {
      throw new Error('無法追蹤未知用戶')
    }

    let user = req.user
    if (user.following.find(val => val.toString() === targetUser._id.toString())) {
      throw new Error('已追蹤過此用戶')
    }

    await user.update({
      $push: {
        following: targetUser._id
      }
    })

    return res.json({
      result: true,
    })
  } catch (e) {
    return res.json({
      result: false,
      errMsg: e.message || '查看系統錯誤訊息',
      err: e
    })
  }
})

module.exports = router;