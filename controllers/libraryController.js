const Library = require('../models/libraryModel');
const ObjectId = require('mongodb').ObjectId;

// create new library
exports.libraryRegistration = async (req, res, next) => {
    const { role } = req.user;
    const { libraryName, libraryEmail, institutionName } = req.body;
    if (role === "admin") {
        try {
            const library = await Library.create({
                libraryName, libraryEmail, institutionName
            });

            return res.status(200).json({
                status: true,
                message: 'success',
                library
            })

        } catch (error) {
            if (error.code == 11000) {
                return res.status(406).json({
                    message: "Email already exist!"
                });

            } else {
                return res.status(500).json({
                    err: error.message,
                    message: "Server side error!",
                });
            }
        }

    } else {
        return res.status(403).json({
            status: false,
            message: "You have no permission for this action!"
        })
    }
}


// get one library by id or email
exports.getlibrary = async (req, res, next) => {
    if (req.params.id || req.params.email) {
        try {
            const library = await Library.findById(req.params.id)
            if (!library) return res.status(404).json({ message: 'Library Not Found!', status: false })

            res.status(200).json({
                status: true,
                library
            })

        } catch (error) {
            res.status(500).json({
                status: false,
                error
            })
        }
    } else {
        res.status(500).json({
            status: false,
            message: "Invalid Request!"
        })
    }
}


// get all library
exports.getAllLibrary = async (req, res, next) => {
    try {
        const librarys = await Library.find();
        // console.log(librarys);
        if (!librarys) return res.status(404).json({ message: 'librarys Not Found!', status: false })

        res.status(200).json({
            status: true,
            total: librarys.length,
            librarys
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            error
        })
    }
}



// delete library
exports.deleteLibrary = async (req, res, next) => {
    const { role } = req.user;
    const { id } = req.params;

    if (role !== "admin") return res.status(403).json({ message: "Permission denied" })
    try {

        const library = await Library.findById(id);
        if (!library)
            return res.status(404).json({ message: 'School Not Found!', status: false })

        const response = await Library.findByIdAndDelete(id)

        res.status(200).json({
            status: true,
            message: 'deleted successfully!'
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            error
        })
    }
}


// filtering
exports.getFilteredLibraryData = async (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'librarian') {
        try {
            const data = await Library.find(req.query)
            if (data.length < 1) return res.status(404).json({ message: "Not Found!", status: false });

            res.status(200).json({
                status: true,
                data
            })

        } catch (error) {
            res.status(500).json(
                {
                    status: false,
                    error
                }
            )
        }
    } else {
        res.status(403).json(
            {
                status: false,
                message: 'You are not Permitted!'
            }
        )
    }

}
//update library information
exports.updateLibraryInfo = async (req, res, next) => {
    const { libraryId, libraryName, libraryEmail, institutionName, libraryDescription } = req.body.data;
    try {
        const lib = await Library.findByIdAndUpdate(libraryId, {
            libraryName,
            libraryEmail,
            institutionName,
            libraryDescription
        })
        if (!lib) return res.status(404).json({ message: 'library Not Found!', status: false })

        res.status(200).json({
            status: true,
            lib
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            error
        })
    }
    //console.log("lib=", lib);
}
// exports.updateLibraryImage = async (req, res, next) => {
//     const { libraryId } = req.body.data;
//     const destination = (req.files[0].destination)
//     const filename = (req.files[0].filename)
//     const imagePath = destination + filename;
//     console.log('file', imagePath)
//     try {
//         // const lib = await Library.findById(libraryId);
//         // if (!lib) return res.status(404).json({ message: "User Not Found!" });
//         const libImage = await Library.findByIdAndUpdate(libraryId, { $set: { libaryPicture: imagePath } });
//         res.status(200).json({
//             status: true,
//             message: "Image uploaded successfully!",
//             libImage
//         })
//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: error.message
//         })
//     }
// }