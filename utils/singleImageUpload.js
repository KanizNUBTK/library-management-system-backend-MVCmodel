const multer = require('multer');
const path = require('path');

function uploader(subFolder, fileTypeName, maxFileSize, errorMsg){

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `public/users/${subFolder}/`);
        },
        filename: (req, file, cb) => {
            // console.log(file)
            const fileExt = path.extname(file.originalname);
            const fileName = file.originalname.replace(fileExt, '')
                                              .toLowerCase()
                                              .split(' ')
                                              .join('-') + '-' + Date.now();
            cb(null, fileName + fileExt);
        }
    })

    const upload = multer({
        storage: storage,
        limits: {
            fileSize: maxFileSize
        },
        fileFilter: (req, file, cb) => {
            // console.log(file)
            if(fileTypeName.includes(file.mimetype)){
                cb(null, true);
            } else {
                cb(new Error(errorMsg));
            }
        }
    })

    return upload;
}


module.exports = uploader;