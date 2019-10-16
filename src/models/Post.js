const mongoose = require('mongoose');
const mongooseSlugPlugin = require('mongoose-slug-plugin');


const postSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    title: {
        type: String,
        required: [true, 'You need a title'],
    },

    
    status: {
        type: String,
        default: 'public'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },

    allowComments: {
        type: Boolean
    },
    body: {
        type: String,
        required: true
    },
    image: {
        type: String
    },

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }],

    date: {
        type: Date,
        default: Date.now()
    }
});

// postSchema.statics.addComment = async function(id){
//     const post = await Post.findOne({_id: id});

//     this.comments = this.comments.concat({ post })

// }

postSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=title%>' });
const Post = mongoose.model('post', postSchema);



module.exports = Post;