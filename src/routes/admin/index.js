const express = require('express');
const router = new express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Categories');
const Comment = require('../../models/Comment');
const faker = require('faker');
const { userAuth } = require('../../middleware/middleware')

router.all('/*', userAuth, (req, res, next) => {
    req.app.locals.layout = 'admin';


    next()
})


router.get('/admin', async (req, res) => {
    const postCount = await Post.find({owner: req.user._id, }).countDocuments();
    const catCount = await Category.countDocuments({});
    const commentCount = await Comment.find({user: req.user._id, }).countDocuments();

    res.render('admin/index', {postCount, catCount, commentCount })
});

router.get('/admin/allposts', async (req, res) => {
    try {
        const posts = await Post.find({}).populate({path: 'category'}).populate('owner')

        res.render('admin/posts/allpost', {post: posts.filter(post => post.status === 'public') })

        
    } catch (error) {
        res.send({error})
    }
   
})




router.post('/admin/generate', (req, res) => {

    for(let i=0; i < req.body.number; i++){
        let status = Math.floor(Math.random() * 3);
        switch(status){
            case 0:
                status = "private";
                break;
    
            case 1:
                status = "public";
                break;
            
            case 2:
                status = "draft";
                break;
    
        }

        let post = new Post();
        post.title = faker.name.title();
        post.status = status;
        post.owner = req.user._id;
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.paragraphs();

        post.save()
        .catch(function(error){
            console.log(error);
        })
    }

    res.redirect('/admin/posts');
})



module.exports = router;