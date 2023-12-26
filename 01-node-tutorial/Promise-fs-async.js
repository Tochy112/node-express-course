console.log('Welcome to Node Tutorial')

// const http = require('./12-http')

const {readFile, writeFile} = require('fs').promises 

//IMPORT UTIL
const util = require('util') 

//USE THE PROMISIFY VALUE FROM THE UTIL OBJECT
// const readFilePromisify = util.promisify(readFile)
// const writeFilePromisify = util.promisify(writeFile)


const start = async () => {
    try{
        const first = await readFile('./content/first.txt', 'utf-8')
        await writeFile('./content/second.txt', 'this is a new text')
        console.log(first);
    }catch(err){
        console.log(err);
    }
}

// HERE WE WROTE THE PROMISE CODE MANUALLY
// const getText = (path) => {
//    return new Promise((reject, resolve) => {
//         readFile(path, "utf-8", (err, result) => {
//             if (err) {
//                 return reject(err)
//             }else{
//                 return resolve(result)
//             }
//         })
//     })
// } 
start()
