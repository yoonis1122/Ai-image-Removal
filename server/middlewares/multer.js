import multer from 'multer';

//creating middleware for multer parsing form data//
const storage = multer.diskStorage({
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
})

const upload = multer({storage})

export default upload;