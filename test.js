const axios = require('axios');
axios.get('http://localhost:5300/api/products/featured?limit=6').then(res => console.log(res.data)).catch(err => console.log(err.response.data));
