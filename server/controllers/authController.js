const TempUser = require("../models/tempUser");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");

exports.signup = async (req, res) => {
  // Handle user signup

  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(404).json({ message: "email already exist" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await TempUser.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password,
        otp,
        otpExpires: Date.now() + 5 * 60 * 1000,
      },
      { upsert: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: "mr7569107@gmail.com",
      to: email,
      subject: "Verify your email",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
    res
      .status(200)
      .json({ message: "OTP sent to email.Please verify to complete signup" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempUser = await TempUser.findOne({ email });

    if (!tempUser)
      return res
        .status(400)
        .json({ error: "No signup found. Please register again." });

    if (tempUser.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (tempUser.otpExpires < Date.now()) {
      await TempUser.deleteOne({ email });
      return res
        .status(400)
        .json({ error: "OTP expired. Please sign up again." });
    }

    const user = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password, // already hashed if you hash at signup
    });

    await user.save();
    await TempUser.deleteOne({ email });

    const token = await user.generateToken();

    res.status(200).json({
      message: "Account verified & created successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
         vendor: user.vendor,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Successful login
    res.status(200).json({
      message: "Login successful",
      token: await user.generateToken(),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
         vendor: user.vendor,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
