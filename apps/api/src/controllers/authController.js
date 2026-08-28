const User = require("../models/User");

const { comparePassword, createToken } = require("../services/authService");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user || !user.active) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordValid = await comparePassword(password, user.passwordHash);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.sub).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.json({
    success: true,
    message: "Logged out successfully",
  });
}

module.exports = {
  login,
  me,
  logout,
};
