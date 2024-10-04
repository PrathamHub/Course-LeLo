const express = require("express");
const router = express.Router();
const { capturePayment, verifySignature } = require("../controllers/Payments");

const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../middlewears/Auth");
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifySignature);
// router.post('')
module.exports = router;
