const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    // expires: 5 * 60,
  },
});

//email sending function
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      otpTemplate(otp)
    );
    console.log("Email send successfully ", mailResponse.response);
  } catch (error) {
    console.log("error occurred while sending email", error);
  }
}
OTPSchema.pre("save", async function (next) {
  console.log("New document saved to database");
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  // console.log(ress);

  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
