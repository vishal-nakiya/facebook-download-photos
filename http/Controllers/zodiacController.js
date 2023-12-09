const Zodiac = require("../../Models/Zodiac");
const fs = require('fs');
const path = require('path');


const zodiacController = () => {
    return {
        addZodiac: async (req, res) => {
            try {
                const data = {
                    name: req.body.name,
                    status: req.body.status,
                    order: req.body.order,
                };
        
                const imageFolder = 'images';
                const uploadDir = path.join(__dirname, '..', imageFolder);
        
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir);
                }
        
                // const imageFile = req.files.image;
                // const imageName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.png`;
        
                // const imagePath = path.join(uploadDir, imageName);
                // imageFile.mv(imagePath);
        
                // const mydata = await Zodiac.create({
                //     ...data,
                //     image: imageName,
                // });

                if (req.files && req.files.image) {
                  const imageFile = req.files.image;
                  const imageName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.png`;
      
                  const imagePath = path.join(uploadDir, imageName);
                  imageFile.mv(imagePath);
      
                  data.image = imageName;
                }
      
                const mydata = await Zodiac.create(data);
        
                res.status(200).json({
                    success: true,
                    message: 'Data stored successfully',
                    // data: mydata,
                });
            } catch (error) {
                console.log(error);
                res.status(400).json({ message: 'Bad request', success: false });
            }
        },
        readZodiac: async (req, res) => {
            try {
      
              const mydata = await Zodiac.findAll({
                where: {
                  deleted_at: null
                },
                attributes: [
                  "id",
                  "name",
                  "status",
                  "order",
                  "image"
                ],
              });
              // const imageBaseUrl = 'http://localhost:8000/images';

              // for (const x of mydata) {
              //   const imagePath = path.join('http', 'images', x.dataValues.image);
          
              //   if (fs.existsSync(imagePath)) {
              //     x.dataValues.image = `${imageBaseUrl}/${x.dataValues.image}`;
              //   }
              // }

              const imageBaseUrl = 'https://api.jugadu.cloud/images';

              for (const x of mydata) {
                if (x.dataValues.image) {
                  const imagePath = path.join('http', 'images', x.dataValues.image);
          
                  if (fs.existsSync(imagePath)) {
                    x.dataValues.image = `${imageBaseUrl}/${x.dataValues.image}`;
                  } else {
                    x.dataValues.image = null;
                  }
                } else {
                  x.dataValues.image = null;
                }
              }
      
              res.status(200).json({
                success: true,
                message: "Data fetched successfully",
                data: mydata,
              });
            } catch (error) {
                console.log(error);
                res.status(400).json({ message: 'Bad request', success: false });
            }
        },
        updateZodiac: async (req, res) => {
            try {
                const id = req.params.id;
        
                const parametercheck = await Zodiac.findByPk(req.params.id);
                if (!parametercheck) {
                  return res.status(502).json({
                    message: "There is no data related to this parameter",
                    success: false,
                  });
                }
        
                const name = req.body.name;
                const status = req.body.status;
                const order = req.body.order;
        
                if (req.files && req.files.image) {
                    const imageFolder = 'images';
                    const uploadDir = path.join(__dirname, '..', imageFolder);
        
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir);
                    }
        
                    const imageFile = req.files.image;
                    const imageName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.png`;
                    const imagePath = path.join(uploadDir, imageName);
                    imageFile.mv(imagePath);
        
                    parametercheck.image = imageName;
                }
        
                const updatedData = await Zodiac.update(
                    {
                      name, status, order, image: parametercheck.image
                    },
                    {
                      where: { id: id },
                    }
                  );
        
                res.status(200).json({
                    success: true,
                    message: 'Zodiac updated successfully',
                });
            } catch (error) {
                console.log(error);
                res.status(400).json({ message: 'Bad request', success: false });
            }
        },
        deleteZodiac: async (req, res) => {
            try {
          
              const parametercheck = await Zodiac.findByPk(req.params.id);
              if (!parametercheck) {
                return res.status(502).json({
                  message: "there is no data related to this parameter",
                  success: false,
                });
              }
              
              const id = req.params.id;
              const mydata = await Zodiac.destroy({ where: { id: id } });

              res
                .status(200)
                .json({ message: "Data deleted successfully", success: true });
            } catch (error) {
                console.log(error);
                res.status(400).json({ message: 'Bad request', success: false });
            }
          },
    }
};

module.exports = zodiacController