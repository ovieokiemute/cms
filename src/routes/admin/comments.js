const express = require('express');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const router = new express.Router();



router.get('/', async (req, res) => {
    const comments = await Comment.find({user: req.user._id}).populate('user');


    res.render('admin/comments', {comments})
})


router.post('/', async (req, res) => {
    const comment = new Comment({
        ...req.body,
        user: req.user._id
    });

    try {
        
        const post = await Post.findOne({_id: req.body.id});
        post.comments.push(comment);
        
        await post.save();
        await comment.save();
        
        req.flash('notice', 'Your comment has been submitted pending approval');

        res.redirect(`/post/${post.slug}`);
    

    } catch (error) {
        res.status(400).send({error});
    }
});


router.delete('/:id', async (req, res) => {
    try {

       const comments =  await Comment.findByIdAndDelete({_id: req.params.id}) // to delete
        await Post.findOneAndUpdate({comments: comments.id}, {$pull: {comments: comments.id}})

        res.redirect('/admin/comments')
        

    } catch (error) {
        console.log(error)
    }
})

router.post('/approve-comment', async (req, res) => {
    try {
        
        const comment = await Comment.findByIdAndUpdate(req.body.id, {$set: {approveComment: req.body.approveComment}})
        
        if(!comment){
            return res.status(400).send('Not found')
        }

        res.status(200).send(comment);
    

    } catch (error) {
        res.status(500).send({error})
    }
})










module.exports = router;