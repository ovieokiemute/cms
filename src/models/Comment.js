const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        
    },

    body: {
        type: String,
        validate(value){
            if(value.length < 1){
                throw new Error('Cannot submit and empty comment')
            }
        }
    },

    approveComment: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        default: Date.now()
    }



});





const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment
