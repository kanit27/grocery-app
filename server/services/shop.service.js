const shopModel = require('../models/shop.model');

exports.createShop = async ({
    shopname, 
    firstname, 
    lastname, 
    email, 
    password, 
    phone, 
    address, 
    location, 
    shopType, 
    description,
    businessHours
}) => {
    if (!shopname || !firstname || !email || !password || !phone || !address || !location || !shopType) {
        throw new Error('All required fields must be provided');
    }

    // Validate location coordinates
    if (!location.coordinates || location.coordinates.length !== 2) {
        throw new Error('Valid location coordinates (longitude, latitude) are required');
    }

    const shop = await shopModel.create({
        shopname,
        ownername: {
            firstname,
            lastname
        },
        email,
        password,
        phone,
        address,
        location,
        shopType,
        description,
        businessHours: businessHours || { open: '09:00', close: '21:00' }
    });

    return shop;
};
