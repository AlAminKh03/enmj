const fs= require('fs')
const { nextTick } = require('process')

const deleteFiles= (fileLink)=>{
    fs.unlink(fileLink,(err)=>{
        if(err){
            next( err)
        }
    })
}

exports.deleteFiles= deleteFiles