const uploader = require('../utils/singleImageUpload');
const path = require('path');

function imageUpload(req, res, next) {
    const upload = uploader(
        'images',
        ['image/jpeg', 'image/jpg', 'image/png'],
        500000,
        'Only .png .jpg $ .jpeg files are allowed'
    );

    upload.any()(req, res, (err) => {
        if (err) {

            if (req?.files?.length > 0) {
                const { filename } = req.files[0];
                fs.unlink(path.join(__dirname, 'public', 'users', 'images'), filename, (err) => {
                    if (err) {
                        res.status(500).json({
                            message: err.message
                        });
                    }
                })
            }

            res.status(500).json({
                message: err.message
            });

        } else {
            next()
        }
    })
}


module.exports = {
    imageUpload,
}