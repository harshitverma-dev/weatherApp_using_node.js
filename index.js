const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homefile = fs.readFileSync('home.html', 'utf-8');

const replaceData = (homefile, currentData) => {
    let storehtmlFile = homefile.replace('{%name%}', currentData.name);
    storehtmlFile = storehtmlFile.replace('{%country%}', currentData.sys.country);
    storehtmlFile = storehtmlFile.replace('{%temp%}', currentData.main.temp);
    storehtmlFile = storehtmlFile.replace('{%temp_min%}', currentData.main.temp_min);
    storehtmlFile = storehtmlFile.replace('{%temp_max%}', currentData.main.temp_max);
    storehtmlFile = storehtmlFile.replace('{%tempStatus%}', currentData.weather[0].main);
    return storehtmlFile;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Lucknow&appid=0979322e087dbc2ec5d08d30a65c4507')
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                const realTimeData = arrData.map((item) => {
                    return replaceData(homefile, item)
                }).join(' ');
                // console.log(realTimeData);
                res.end(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                console.log('end');
            });
    }
})

server.listen('3000', '127.0.0.1', () => {
    console.log('server started');
})

