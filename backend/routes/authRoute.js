const express = require('express');
const router = express.Router();
const {
  createUser, loginUserCtrl, loginAdminCtrl, handleRefreshToken,
} = require('../controller/userCtrl');


router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdminCtrl);

router.get('/refresh', handleRefreshToken);

module.exports = router;
