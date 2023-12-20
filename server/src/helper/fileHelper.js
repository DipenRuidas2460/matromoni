const fs = require("fs");
const path = require("path");

const getImage = async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = "../uploads/image/" + fileName;
  const profImgPath = path.join(__dirname, filePath);
  const fileImg = await fs.readFileSync(profImgPath);
  res.write(fileImg);
  res.end();
};

module.exports = { getImage };
