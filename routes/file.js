const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const {Storage} = require('@google-cloud/storage');
const verifyToken = require('./verifyToken');
const File = require('../models/File');
const {createValidation, shareValidation} = require('../validation/folder');
const User = require('../models/User');

const gc = new Storage({
    keyFilename: path.join(__dirname, './videorecorderextensionserver-457ff0fc023b.json'),
    projectId: 'videorecorderextensionserver'
});
const bucket = gc.bucket('techtestfiles')


router.post('/upload?:folderId', verifyToken, async (req, res)=>{
    console.log('ss')
    try {
        console.log(req.query.folderId)
        let fileName = Date.now() + ".mp4"
        console.log(__dirname)
        const filePath = path.join(__dirname + `${fileName}`);
        console.log(filePath)
        const stream = fs.createWriteStream(filePath);
        const rs = fs.createReadStream(filePath);
        rs.pipe(
            bucket.file(fileName).createWriteStream({
                resumable: false, gzip: true
            })
            .on('finish', () => {
                fs.unlinkSync(filePath); //delete file locally
                
                //add file to db
                const file = new File({
                    FileName: fileName, 
                    FilePath: 'https://storage.googleapis.com/techtestfiles/' + fileName,
                    Type: 'file',
                    Parent: req.query.folderId,
                    CreatedBy: req.user._id
                });
                file.save().then(data => {
                     res.json(data);
                });
                 
            })
        )
        
        // res.send(savedFile);
    } catch (error) {
        // next(error)
        return res.status(400).json(error);
    }
});

router.post('/folder', verifyToken, async (req, res) => {
    //VALIDATE THE DATA BEFORE CREATING Folder
    const {error} = createValidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    try{
        //add file to db
        const file = new File({
            FileName: req.body.FolderName, 
            FilePath: '',
            Type: 'folder',
            Parent: req.body.Parent,
            CreatedBy: req.user._id
        });
        const folder = await file.save();
        return res.json(folder);
    }
    catch(err){
        return res.status(400).json(err);
    }
})


router.delete('/folder/:folderId', verifyToken, async (req, res) => {
    if(!req.params.folderId){
        return res.status(400).json('Folder id is required')
    }
    try{
        const deletedFile = await File.remove({_id:req.params.folderId});
        res.json({Message: "Deleted succesfully"});
    }
    catch(err){
        res.send(err);
    }
})

router.patch('/folder/:folderId', verifyToken, async (req, res) => {
    //VALIDATE THE DATA BEFORE CREATING Folder
    const {error} = createValidation(req.body);
    if(error){
        return res.status(400).json(error.details[0].message);
    }

    try{
        const updatedFile = await File.updateOne(
            {_id: req.params.folderId}, 
            { $set: {
                FileName: req.body.FileName,
                Parent: req.body.Parent
            }}
        );
        res.json(updatedFile);
    }
    catch(err){
        console.log(err);
        res.json(err)
    }
})


router.post('/share', verifyToken, async (req, res) => {
    //VALIDATE THE DATA BEFORE CREATING Folder
    const {error} = shareValidation(req.body);
    if(error){
        return res.status(400).json(error.details[0].message);
    }

    try{
        //get file and return error if not existant
        const file = await File.findById(req.body.FileId);
        if(!file)
            return res.status(404).json({Message: "File Not found"});

        //get user and return error if not existant
        const user = await User.findById(req.body.UserId);
        if(!user || user._id == req.user._id)
            return res.status(404).json({Message: "User Not found"});

        // if(user.Files != null && user.Files.indexOf(file._id) >= 0)
        //     return res.status(400).json({Message: "File already shared with user"});

        const newFile = new File({
            FileName: file.FileName, 
            FilePath: file.FilePath,
            Type: file.Type,
            Parent: file.Parent,
            CreatedBy: user._id
        });
        const addedFile = await newFile.save();
        res.json({Message: "success"});
    }
    catch(err){
        console.log(err);
        res.json(err)
    }
})


router.get('/', verifyToken, async (req, res) => {
    try{
        const files = await File.find({CreatedBy: req.user._id});
        console.log(files)
        return res.json(files);
    }
    catch(err){
        return res.status(400).json({Message: err});
    }
})


module.exports = router;