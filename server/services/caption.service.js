const captionModel = require('../models/caption.model');

exports.createCaption = async ({firstname, lastname, email, password, color, plate, capacity, vehicleType, vehicleModel}) => {
    if(!firstname || !email || !password || !firstname || !color || !plate || !capacity || !vehicleType || !vehicleModel) {
        throw new Error('All fields are required');
    }
    const captionService = await captionModel.create({
        fullname:{
            firstname,
            lastname,
        },
        email,
        password,
        vehicle:{
            color,
            plate,  
            capacity,
            vehicleType,
            vehicleModel
        }
    });
    await captionService.save();
    return captionService;
};
