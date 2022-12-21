const fs= require('node:fs')
const http= require('node:http')

// const readingInput = fs.readFileSync('./txt/input.txt','utf-8')
// console.log(readingInput);

// const writingForWrite = `this text for writing a file \n i mean creating a file ${readingInput}`
// fs.writeFileSync('./txt/output.txt', writingForWrite)
// console.log("done writing file");

// const dataJson=fs.readFileSync(`${__dirname}/data.json`,'utf-8')
// console.log(dataJson);
// const dataObj = JSON.parse(dataJson);


// const server = http.createServer((req,res)=>{
//     const pathName=req.url;
//     console.log(pathName);
//     if (pathName=== '/' || pathName==='/overview'){
//         res.end("Hello from the server")
//     }
//     else if(pathName === '/product'){
//         res.end("Product Page")
//     }
//     else if(pathName === '/api'){
//         res.writeHead(200,{
//            "Content-type" : "application/json"
//         })
//         res.end(dataJson)
//     }
//     else{
//         res.writeHead(404,{
//             'Content-type':'text/html'
//         })
//         res.end("page not found")
//     }
    
    
// })

const server = http.createServer((req,res)=>{
    const url= req.url;
    const method= req.method;
    if (url==='/'){
        res.write('<html>')
        res.write('<head><title>My first server for form</title></head>')
        res.write("<body><form action='/message' method='POST'><input type='text' name='message'></input ><button type='submit'>submit</button></form></body>")
        res.write('</html>')
        return res.end()
    }
    else if (url==="/message" && method==="POST"){
        const body=[]
        req.on('data',(chunk)=>{
            body.push(chunk)
        })
        return req.on('end', ()=>{
            // console.log(Buffer);
            const parsedBody=Buffer.concat(body).toString()
            // console.log(parsedBody);
            const message = parsedBody.split('=')[1];
            fs.writeFile("message.txt", message,(err)=>{
                res.statusCode=302;
                res.setHeader('location','/')
                return res.end()
            })
            
        })
    }
    res.setHeader('Content-type','text/html')
    res.write("<html>")
    res.write('<head><title> Main page for my server</title></head>')
    res.write('<body><h1>Hello from Main page of my server</h1></body>')
    res.write("</html>")
    return res.end()

  
    
})

server.listen(8000)