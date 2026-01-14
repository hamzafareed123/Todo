import multer from "multer";
import fs from "fs";
import path from "path";
import { customError } from "./customError.js";

const  uploadDir = "uploads/profile-pics";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${req.user.id}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);

  if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
    return cb(new customError("Only Images are allowed",400));
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
   limits: { 
    fileSize: 5 * 1024 * 1024 
  }
});

export default upload;
