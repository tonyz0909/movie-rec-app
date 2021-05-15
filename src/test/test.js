const axios = require('axios');

export default function() {
    // fetch('https://www.google.com/')
    //     .then(response => response.json())
    //     .then(data => console.log(data));

    axios.get('https://www.google.com/')
        .then(function (response) {
            // handle success
            console.log(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    // console.log('here')
}

