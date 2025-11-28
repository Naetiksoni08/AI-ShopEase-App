const router = require("express").Router();
const Authcontroller = require("../controllers/auth.controller");
const { userRegisterValidator} = require("../validations/user/register");
const {userLoginValidator} = require("../validations/user/login");
const validate = require("../middlewares/validate");


router.post("/login",validate(userLoginValidator),Authcontroller.login);
router.post("/register",validate(userRegisterValidator), Authcontroller.register);



module.exports = router;