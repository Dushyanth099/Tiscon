import multer from "multer";

// multer Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/avi",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, JPEG,PNG,MP4,and AVI are allowed."
      ),
      false
    );
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});
export const uploadProfileImage = upload.single("profilePicture");
export const uploadSingleImage = upload.single("image");
export const uploadMultipleImages = upload.array("images", 3);
export const uploadSingleVideo = upload.single("video");
