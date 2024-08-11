import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const createMulterInstance = (folder,filename) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, './','storage', 'upload', folder);
      
        fs.access(uploadPath, fs.constants.F_OK, (err) => {
          if (err) {
            fs.mkdirSync(uploadPath, { recursive: true }); 
          }
          cb(null, uploadPath);
        });
      },
      filename: (req, file, cb) => {
        
        //const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, filename+path.extname(file.originalname));
      },
    });
  
    return multer({
      storage: storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5MB
      fileFilter: (req, file, cb) => { 
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.xls', '.xlsx', '.pdf'];
  
        const extname = path.extname(file.originalname).toLowerCase();
        
        if (allowedExtensions.includes(extname)) {
          cb(null, true);
        } else {
          cb(new Error('Only .jpg, .jpeg, .png, .xls, .xlsx, .pdf files are allowed!'));
        }
      },
    });
  };