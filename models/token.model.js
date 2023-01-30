const {Schema, model} = require('mongoose')


const schema = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
    
},
{
    collection: "tokens"
})
module.exports = model('Token', schema)