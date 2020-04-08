const Intl = require("intl");
const { age, date } = require('../../lib/utils');
const Member = require("../models/Member");

module.exports = {
    index(req, res){
        Member.all(function(members) {
            return res.render("members/index", { members });
        });
    },

    create(req, res){
        return res.render('members/create');
    },

    post(req, res){
        const keys = Object.keys(req.body);

        for(key of keys) {
            if(req.body[key] == "") {
                return res.send('Please, fill all fields"');
            }      
        }

        const values = [
            req.body.name,
            req.body.avatar_url,
            req.body.email,
            req.body.gender,            
            date(req.body.birth).iso,
            req.body.blood,
            req.body.weight,
            req.body.height
        ];

        Member.create(values, function(member) {
            return res.redirect(`/members/${ member.id }`);
        });
    },

    show(req, res){
        Member.find(req.params.id, function(member) {
            if(!member) return res.sed("Member not found!");

            member.birth = date(member.birth).birthDay;

            return res.render("members/show" , { member });
        });
    },

    edit(req, res){
        Member.find(req.params.id, function(member) {
            if(!member) return res.sed("Member not found!");

            member.birth = date(member.birth).iso;

            return res.render("members/edit" , { member });
        });
    },

    put(req, res){
        const keys = Object.keys(req.body);

        for(key of keys) {
            if(req.body[key] == "") {
                return res.send('Please, fill all fields"');
            }      
        }

        const values = [
            req.body.avatar_url,
            req.body.name,
            date(req.body.birth).iso,
            req.body.gender,
            req.body.email,
            req.body.blood,
            req.body.weight,
            req.body.height,
            req.body.id
        ];

        Member.update(values, function(){
            return res.redirect(`/members/${ req.body.id }`);
        });

        return;
    },

    delete(req, res){
        Member.delete(req.body.id, function(){
            return res.redirect("/members");
        });
    }
}