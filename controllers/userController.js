const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mailConfig = require("../utils/email");


const signToken = (id, firstName, lastName, email, role) => {
    return jwt.sign({ id, firstName, lastName, email, role }, process.env.JWT_SECRET, {
        expiresIn: `${process.env.JWT_EXPIRE_IN}`,
    });
}

// new user signup
exports.signup = async (req, res, next) => {
    // console.log(req);
    //const { role: permission } = req.user;
    const { firstName, lastName, departmentName, email, password, confirmPassword, role, libraryId } = req.body;

    //if (permission === "member") return res.status(430).json({ message: 'You are not permitted', status: false });

    const userEmail = await User.findOne({ email });
    if (userEmail)
        return res.status(406).json({
            message: "Email already exist!"
        });

    try {
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password invalid",
            });
        }

        const newUser = await User.create({
            firstName, lastName, departmentName, email, password, confirmPassword, role, libraryId
        });

        const token = signToken(newUser._id, newUser.firstName, newUser.departmentName, newUser.lastName, newUser.email, newUser.role);

        res.status(201).json({
            token,
            message: "successfully login",
            status: true
        });

    } catch (error) {
        return res.status(500).json({
            err: error.message,
            message: "Server side error!",
        });

    }
}


// user login
exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: "User not found!",
            });
        }
        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        );
        // hide password from output
        user.password = undefined;
        if (isPasswordValid) {
            const token = signToken(user._id, user.firstName, user.lastName, user.email, user.role);
            return res.status(200).json({
                status: true,
                token,
                user
            });

        } else {
            return res.status(400).json({
                status: false,
                message: "Login failed!",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            err: error.message,
            message: "Server side error!",
        });
    }
}
// user password chance
exports.passwordChange = async (req, res, next) => {
    const { id } = req.user;
    const { currentPassword, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({
            status: false,
            message: 'Password invalid!'
        })
    }

    try {

        const userInfo = await User.findById(id);

        const isMatched = await bcrypt.compare(currentPassword, userInfo.password);

        if (isMatched) {
            const hashedPassword = await bcrypt.hash(password, 12);
            await User.findByIdAndUpdate(id, { $set: { password: hashedPassword } });
            return res.status(200).json({
                status: true,
                message: 'Password has changed successfully!'
            })
        } else {
            return res.status(403).json({
                status: false,
                message: 'Request rejected!'
            });
        }

    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
}


// send email to reset password
exports.sendUserPasswordResetEmail = async (req, res, next) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Please provide valid email." })
    try {
        const user = await User.findOne({ email }).select('-password');
        if (!user) return res.status(404).json({ message: "Invalid request!" })

        // generate link with token and send it to user email
        const secret = process.env.JWT_SECRET;
        const token = await jwt.sign({ id: user._id }, secret, { expiresIn: '10m' });
        const originURL = req.headers.origin;
        const link = `${originURL}/user/reset/${token}`;

        // now send token to email
        const info = await mailConfig(user, link)

        if (info) {
            return res.status(200).json({ status: true, message: "Password Reset Email Sent, Please Check Your Email." });
        } else {
            return res.status(500).json({ status: false, message: "Failed, try again!" });
        }

    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
}


// password update after verify, this function little bit different from passwordChange()
// because of currentPassword field
exports.passwordReset = async (req, res, next) => {
    const { id } = req.user;
    const { password, confirmPassword } = req.body;

    try {
        const user = await User.findById(id).select("-password -__v");
        if (!user) return res.status(404).json({ message: "Invalid Request, User Not Found!" });

        if (password !== confirmPassword) return res.status(400).json({ message: "Invalid Password" });

        const hashedPassword = await bcrypt.hash(password, 12);
        await User.findByIdAndUpdate(id, { $set: { password: hashedPassword } });

        return res.status(200).json({
            status: true,
            message: 'Password has changed successfully!'
        });

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    };
};
