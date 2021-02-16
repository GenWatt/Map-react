const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require('cors')
const multer = require('multer')
const path = require('path');
const fs = require("fs");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(path.resolve(__dirname, 'uploads', 'images'))) {
            fs.mkdirSync(path.resolve(__dirname, 'uploads', 'images'));
            console.log("Directory is created.");
        }
        cb(null, path.resolve(__dirname, 'uploads', 'images'))
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        const newFileName = file.fieldname + '-' + Date.now() + '.' + ext
        req.body.imagePath = `images/${newFileName}`
        cb(null, newFileName)
    }
})
const app = express();
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"))
app.use(express.static('uploads'))

const upload = multer({ storage })
let data = []

app.post('/crew', upload.single('crewImage'), (req, res) => {
    data.push(req.body, req.file)
    console.log(data)
    res.json('')
})
app.put('/crew/:id', upload.single('crewImage'), (req, res) => {
    const id = req.params.id
    data.push(req.files, req.body)
    console.log(data)
    res.json('')
})

app.get('/crew', (req, res) => {
    res.json(data)
})

app.listen(process.env.PORT || 5000);