import express from 'express';
import upload from '../services/multer.js';
import cloudinary from '../config/cloudinary.js';

const uploadRoute = express.Router();

uploadRoute.post('/upload', upload.single('image'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, 
        { folder: 'products' },
        (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({
                success: false, 
                message: "Error"
            });
        }

        console.log(result);
        res.status(200).json({
            success: true,
            message: "Uploaded!",
            data: result
        })
    })
});


export default uploadRoute;
