const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists safely
const uploadDir = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];
  
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.pdf', '.doc', '.docx'];

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Unsupported file type. Only PDF, DOC, and DOCX are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
