const express = require('express');
const router = new express.Router();
const Post = require('../../models/Post');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isEmpty } = require('../../../helpers/upload');
const Categories = require('../../models/Categories');

const publicUploads = path.join(__dirname, '../../../public/uploads/');


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';


    next()
});

router.get('/posts', async (req, res) => {
    try {

        const post = await Post.find({owner: req.user._id}).populate('category')

        res.status(200).render('admin/posts/index', {post});
        
    } catch (error) {
        res.status(400)
    }
});

router.get('/posts/create', async (req, res) => {
    const category = await Categories.find({});

    res.render('admin/posts/create', {category})
});

const storage = multer.diskStorage({
    destination: publicUploads,
    filename(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
            return cb(new Error('Please upload an image file'))
        }

        cb(null, true)
    }
})




router.post('/posts/create', upload.single('image'), async (req, res) => {
    
      
    const post = new Post({
        ...req.body,
        allowComments: req.body.allowComments === 'on'? true: false,
        owner: req.user._id
    })


    try {
        if(req.file){
            post.image = req.file.filename
        }
        await post.save();
    
        req.flash('notice', `Your post ${post.title} was created successfully`)
        res.redirect('/admin/posts')
      
    } catch (error) {
        const errorMsg = Object.keys(error.errors).map(key => error.errors[key].message)
        res.render('admin/posts/create', {error: req.flash('warning', errorMsg)})
       
        
    }


}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
});

router.get('/posts/edit/:id', async (req, res) => {
    const categories = await Categories.find({});
    try {
        const post = await Post.findOne({_id: req.params.id, owner: req.user._id});
       
        const category = await Categories.findOne({_id: post.category})
        
        
        res.render('admin/posts/edit', {post, category, categories})
    } catch (error) {
        res.status(400).send(error)
    }
});

router.put('/posts/edit/:id', upload.single('image'), async (req, res) => {
   try {
        const post = await Post.findOne({_id: req.params.id, owner: req.user._id});
        if(!post){
            return res.send({Error: 'Could not find your post'})
        }

        if(req.file){
            ///fs.unlinkSync(`${publicUploads}${post.image}`);
            post.image = req.file.filename
            
        }
        post.allowComments = req.body.allowComments === 'on'? true : false;
        post.title = req.body.title;
        post.status = req.body.status;
        post.body = req.body.body;
        post.category = req.body.category;
        post.owner = req.user._id;
       
        await post.save();
        req.flash('notice', 'Your post was edited successfully!')
        res.status(200).redirect('/admin/posts')
   } catch (error) {
       res.status(401).send({Error: error})
   }

  
}, (error, req, res, next) => {
    res.status(400).send({error: error})
});

router.delete('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.id, owner: req.user._id}).populate('comments');

        if(!post){
            return res.status(400).send({Error: 'Could not find your post'})
        }
        if(post.image){
            fs.unlinkSync(`${publicUploads}${post.image}`);
        }

        if(post.comments.length !== null){
            post.comments.forEach(comment => comment.remove() )
        }
        await post.remove();
        req.flash('notice', 'Your post has been removed successfully')
        

        res.status(200).redirect('/admin/posts');

    } catch (error) {
        res.status(500).send(error);
    }

})


// router.put('/admin/posts/edit/:id',  upload.single('image'), async (req, res) => {
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ['title', 'body', 'status', 'image', 'allowComments'];
//     const isValid = updates.every(update => allowedUpdates.includes(update));

//     if(!isValid){
//         return res.send({Error: 'Invalid Update'})
//     }

//     try {
//         const post = await Post.findOne({_id: req.params.id});

//         if(!post){
//             return res.send({Error: 'Could not find your post'})
//         }

//         if(req.file){
//             fs.unlinkSync(`${publicUploads}${post.image}`);
//             post.image = req.file.filename
//         }

//         updates.forEach(update => {
//             post[update] = req.body[update]

//         })

//         post.allowComments = req.body.allowComments === 'on'? true:false;

//         await post.save();
//         req.flash('notice', 'Your post was edited successfully!')
//         res.status(200).redirect('/admin/posts')
//     } catch (error) {
//         res.send({Error: error})
//     }
// }, (error, req, res, next) => {
//     res.send({Error: error})
// })





module.exports = router;

