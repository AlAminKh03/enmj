const fs= require('node:fs')
const http= require('node:http')

// const readingInput = fs.readFileSync('./txt/input.txt','utf-8')
// console.log(readingInput);

// const writingForWrite = `this text for writing a file \n i mean creating a file ${readingInput}`
// fs.writeFileSync('./txt/output.txt', writingForWrite)
// console.log("done writing file");

const dataJson=fs.readFileSync(`${__dirname}/data.json`,'utf-8')
console.log(dataJson);
const dataObj = JSON.parse(dataJson);


const server = http.createServer((req,res)=>{
    const pathName=req.url;
    console.log(pathName);
    if (pathName=== '/' || pathName==='/overview'){
        res.end("Hello from the server")
    }
    else if(pathName === '/product'){
        res.end("Product Page")
    }
    else if(pathName === '/api'){
        res.writeHead(200,{
           "Content-type" : "application/json"
        })
        res.end(dataJson)
    }
    else{
        res.writeHead(404,{
            'Content-type':'text/html'
        })
        res.end("page not found")
    }
    
    
})

server.listen(8000,()=>{
    console.log("listening from port 8000");
})