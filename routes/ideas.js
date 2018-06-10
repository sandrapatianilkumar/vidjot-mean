const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { ensureAuthenticated } = require('../helpers/auth');

//load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Add Ideas form route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
})

//Edit Ideas form route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {

            if (idea.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                    idea: idea
                });
            }
        })

})

//Process form
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Please enter title' })
    }
    if (!req.body.details) {
        errors.push({ text: 'Please enter details' })
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        //res.send('Passed')
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }

        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            })
            .catch(err => err);
    }

});

//idea index page
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find() //{ user: res.user.id }
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

//idea edit put
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    res.redirect('/ideas');
                })
        })
});

//delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Video idea removed successfully..');
            res.redirect('/ideas');
        })
});

module.exports = router;