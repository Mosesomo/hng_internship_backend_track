const asyncHandler = require('express-async-handler');
const requestIp = require('request-ip');
const axios = require('axios');

const greetVisitor = asyncHandler(async (req, res) => {
    const visitorName = req.query.visitor_name;
    const clientIp = requestIp.getClientIp(req);

    let city = 'Nairobi';
    if (clientIp !== '127.0.0.1' && clientIp !== '::1') {
        try {
            const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
            const locationData = locationResponse.data;
            city = locationData.city || 'Nairobi';
        } catch (err) {
            res.status(500).json({Error: "Server error....Failed to get location"});
        }
    }

    try {
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
        const temperature = weatherResponse.data.main.temp;

        console.log(weatherResponse);

        res.status(200).json({
            client_ip: clientIp,
            location: city,
            greetings: `Hello, ${visitorName}!, Your temperature is ${temperature} degrees Celsius in ${city}`
        });
    } catch (err) {
        res.status(500).json({Error: "server error...failed to fetch temp!!"});
    }
})

module.exports = greetVisitor;