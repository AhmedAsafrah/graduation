const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    folder: req.folder || "uploads", // Dynamic folder, fallback to "uploads"
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: `${file.fieldname}-${Date.now()}-${file.originalname.split(".")[0]}`,
  }),
});

const upload = multer({ storage });

module.exports = upload;