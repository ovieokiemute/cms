const express = require('express');
const router = new express.Router();
const Post = require('../../models/Post');
const Categories = require('../../models/Categories');
const { userAuth } = require('../../middleware/middleware');



router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';

    next();
})

router.get('/', async (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;
    const count = await Post.countDocuments()
    try {
        const posts = await Post.find({})
        .limit(perPage)
        .skip((perPage * page) - perPage)

        const category = await Categories.find({})


        res.render('home/index', { 
            posts,
            category,
            current: parseInt(page),
            pages: Math.ceil(count / perPage)
     })
    } catch (error) {
        res.status(400).send({error})
    }
   
});


router.get('/about', (req, res) => {
    res.render('home/about')
});

router.get('/register', (req, res) => {
    res.render('home/register')
});

router.get('/login', (req, res) => {
    res.render('home/login');
});


router.get('/post/:slug', async (req, res) => {
    try {
        const post = await Post.findOne({slug: req.params.slug})
        .populate({path: 'comments', match: {approveComment: true}, populate: {path: 'user', model: 'user'}})
        .populate('owner');
        const category = await Categories.find({});

        if(!post){
            return res.status(400).send({message: 'Post not found'})
        }

        res.render('home/post', {post, category})
    } catch (error) {
        res.status(401).send({error})
    }
});


module.exports = router;