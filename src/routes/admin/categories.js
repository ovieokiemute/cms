const express = require('express');
const Categories = require('../../models/Categories');
const router = new express.Router();


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';

    next();
})

router.get('/admin/categories',async (req, res) => {
    try {
        const category = await Categories.find({});
        res.render('admin/categories/index', { category });  
    } catch (error) {
        res.status(400).send({error})
    }
  
});


router.post('/admin/categories/create', async (req, res) => {
    const category = new Categories(req.body);

    try {
        await category.save();
        res.redirect('/admin/categories');
        console.log(category)
    } catch (error) {
        res.status(400).send({Error})
    }
});

router.get('/admin/categories/edit/:id', async (req, res) => {
    try {
        const category = await Categories.findOne({_id: req.params.id});

        res.render('admin/categories/edit', { category })
    } catch (error) {
        res.status(400).send({error})
    }
});

router.put('/admin/categories/edit/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdate = ['name'];
    const isValid = updates.every(update => allowedUpdate.includes(update));

    if(!isValid){
        return res.send({Error: 'Invalid. Try again'})
    }
    try {
        const category = await Categories.findOne({_id: req.params.id});

        updates.forEach(update => category[update] = req.body[update])

        await category.save()

        if(!category){
            return res.send('Category not found')
        }

        res.redirect('/admin/categories');
        
    } catch (error) {
        res.send({error})
    }
});

router.delete('/admin/categories/:id', async (req, res) => {
    try {
        const category = await Categories.findOne({_id: req.params.id});

        if(!category){
            res.status(400).send('Could not find the category');
        }

        await category.remove();

        res.redirect('/admin/categories')
    } catch (error) {
        res.send({error})
    }
})






module.exports = router