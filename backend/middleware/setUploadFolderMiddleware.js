const setUploadFolder = (folder) => (req, res, next) => {
  req.folder = folder;
  next();
};

module.exports = setUploadFolder;
