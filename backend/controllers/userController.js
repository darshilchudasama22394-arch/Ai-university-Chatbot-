const User = require("../models/User");

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "-password -otp -otp_expiry"
    );

    if (!user) { return res.status(404).json({ success: false, message: "User not found", }); }
    res.json({
      success: true,
      user: user,
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email } = req.body;

    if (!fullName || !email) { return res.status(400).json({ success: false, message: "Full name and email are required", }); }

    const existingUser = await User.findOne({
      email: email,
      _id: { $ne: id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already exits",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullName: fullName,
        email: email,
      },
      {
        new: true,
        runValidators: true,
      } ).select("-password -otp -otp_expiry");

      if (!updatedUser) { return res.status(404).json({ success: false, message: "User not found", }); }


    res.json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};