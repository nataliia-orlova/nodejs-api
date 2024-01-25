const http = require('http');
const url = require('url');
var fs = require('fs');
const port = 3000;
const hostname = '127.0.0.1';
var fs = require('fs'),
    obj;
const products = [];
// Read the file and send to the callback
fs.readFile('./db.json', handleFile);

// Write the callback function
function handleFile(err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    console.log(obj['products']);
}

//GET products - retrieve a list of products
const handleGetProducts = (res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(obj['products']));
};

//POST products - add a new product
const addPostProduct = async (req, res) => {
    try {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        await new Promise((resolve, reject) => {
            req.on('end', () => {
                const product = JSON.parse(body);
                obj.products.push(product);
                console.log(obj.products);
                //Write data to the json file
                fs.writeFile('db.json', JSON.stringify(obj), function (err) {
                    if (err) throw err;
                    console.log('The "data to append" was appended to file!');
                });
                //write in the response
                res.writeHead(201, { 'contexnt-Type': 'application/json' });
                res.end(JSON.stringify(product));
                resolve();
            });
            req.on('error', (error) => reject(error));
        });
    } catch (error) {
        res.writeHead(400, { 'content-Type': 'text/plain' });
        res.end('Invalid data');
    }
};

//create server
const server = http.createServer(async (req, res) => {
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    if (path == '/products' && req.method == 'GET') {
        handleGetProducts(res);
    } else if (path == '/products' && req.method == 'POST') {
        await addPostProduct(req, res);
    } else {
        //Show Error id the Path not Found
        res.writeHead(404, { 'content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

//start the server

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
