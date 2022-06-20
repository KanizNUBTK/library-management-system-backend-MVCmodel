const User = require('../models/userModel');
const ObjectId = require('mongodb').ObjectId;

// get one user info by token id (req.user)
exports.getLoggedUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user.id }).populate('libraryId');
        if (!user) return res.status(404).json({ message: 'User not found!', status: false })
        return res.status(200).json({
            status: true,
            user
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

exports.getusers = async (req, res, next) => {

    try {
        let { body } = req
        let user = new User({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email.toLowerCase(),
            password: bcrypt.hashSync(body.password, 8),
        })
        await user.save()
        let token = jwt.sign({ _id: user._id, role: user.role }, secret, { expiresIn: '8h' })
        return res.status(200).send({
            error: false,
            msg: 'Successfully registered',
            token,
        })
    } catch (e) {
        if (e.code === 11000) {
            return res.status(406).send({
                error: true,
                msg: 'Email already exists',
            })
        }
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}
// update only user's profile info, access for everyone
exports.updateProfile = async (req, res, next) => {
    const { id } = req.user;
    const { firstName, lastName, email } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User Not Found!" });

        await User.findByIdAndUpdate(id, { $set: { firstName, lastName, email } });

        res.status(200).json({
            status: true,
            message: "success"
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            error
        })
    }

}


// only authorized role can update user's whole information
exports.updateUserByAuthorized = async (req, res, next) => {
    const { role } = req.user;
    const { id } = req.params;
    const { firstName, lastName, email, role: rol, libraryId } = req.body;

    if (role === 'admin' || role === 'librarian') {
        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: 'User Not Found!' });

            await User.findByIdAndUpdate(id, {
                firstName,
                lastName,
                email,
                role: rol,
                libraryId,
            });

            res.status(200).json({
                status: true,
                message: "successfully updated"
            })

        } catch (error) {
            return res.status(500).json({ status: false, message: error.message })
        }

    } else {
        return res.status(403).json({
            status: false,
            message: "You're Not Permitted to this action."
        })
    }
}


// only authorized role can delete user
exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.user;
    if (role === 'admin' || role === 'librarian') {
        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User Not Found!" });

            await User.findByIdAndDelete(id);

            return res.status(200).json({
                status: true,
                message: "User deleted successfully!"
            });

        } catch (error) {
            return res.status(500).json({ status: false, error })
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "You're Not Permitted to this action."
        })
    }
}
// profile image upload
exports.updateProfileImage = async (req, res, next) => {
    const { id } = req.user;
    const destination = (req.files[0].destination)
    const filename = (req.files[0].filename)
    const imagePath = destination + filename;
    //console.log('file', imagePath)
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User Not Found!" });
        await User.findByIdAndUpdate(id, { $set: { image: imagePath } });
        res.status(200).json({
            status: true,
            message: "Image uploaded successfully!"
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}
// filtering
exports.getUserById = async (req, res, next) => {
    if (req.params.id) {
        try {
            const data = await User.findOne({ _id: req.params.id }).select('-password -__v').populate('libraryId', '_id libraryName libraryEmail institutionName');
            if (!data) return res.status(404).json({ message: "Not Found!" });
            res.status(200).json({
                status: true,
                data
            })

        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            })
        }
    } else {
        res.status(200).json({
            status: false,
            message: 'PLease provide valid id'
        })
    }
}
// filtering
exports.getFilteredData = async (req, res, next) => {
    try {
        const data = await User.find(req.query).select('-password -__v').sort({ 'updatedAt': -1 });
        if (data.length === 0) return res.status(404).json({ message: "Not Found!" });

        res.status(200).json({
            status: true,
            total: data.length,
            data
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}
// only authorized role can delete user
exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.user;
    if (role === 'admin' || role === 'librarian') {
        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User Not Found!" });

            await User.findByIdAndDelete(id);

            return res.status(200).json({
                status: true,
                message: "User deleted successfully!"
            });

        } catch (error) {
            return res.status(500).json({ status: false, error })
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "You're Not Permitted to this action."
        })
    }
}
// get all filtered user according to library
exports.getAllFilteredUser = async (req, res, next) => {
    const { libraryId } = req.params;
    //console.log(req.body);
    try {
        const users = await User.find({ libraryId: ObjectId(libraryId) }).populate('libraryId');
        //const users = await User.find({ libraryId: ObjectId(libraryId) }).select('-password -__v');
        if (!users) return res.status(404).json({ message: 'User not found!', status: false })
        //console.log(users);
        res.status(200).json({
            status: true,
            total: users.length,
            users
        });

    } catch (error) {
        //console.log(error);
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

// filtering by libraryId and role
exports.getDatalibraryIdRole = async (req, res, next) => {
    const { libraryId, role } = req.params;
    if (libraryId && role) {
        const id = ObjectId(libraryId);
        //console.log(id);
        try {
            const users = await User.find({ role, libraryId: id }).select('-password -__v').sort({ 'updatedAt': -1 });
            if (!users) return res.status(404).json({ message: "Not Found!" });
            res.status(200).json({
                status: true,
                total: users.length,
                users
            })

        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            })
        }

    } else {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}
