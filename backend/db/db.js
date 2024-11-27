const mongoose = require('mongoose')

function connectToDb(){
  mongoose.connect(process.env.mogo_URI)
  .then(() => {
    console.log('Mongodb Connected!')
}).catch((err)=> {
  console.log(err);
})
}

module.exports = connectToDb