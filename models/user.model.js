const {Schema, model} = require('mongoose')

const schema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false,
        default: 18
    },
    password: {
        type: String,
        required: true
    },
},
{
    collection: "users"
})
module.exports = model('User', schema)