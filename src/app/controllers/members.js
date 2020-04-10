const Intl = require("intl");
const { age, date } = require('../../lib/utils');
const Member = require("../models/Member");

module.exports = {
    index(req, res){
        let { filter, page, limit } = req.query;

        page       = page || 1;
        limit      = limit || 2;
        let offset = limit * (page - 1);

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(members) {

                const pagination = {
                    total: Math.ceil(members[0].total / limit),
                    page
                }

                return res.render("members/index", { members, pagination, filter });
            }
        };

        Member.paginate(params);
    },

    create(req, res){
        Member.instructorSelectOptions(function(options) {
            return res.render('members/create', { instructorOptions: options });
        });
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
            req.body.height,
            req.body.instructor
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

            Member.instructorSelectOptions(function(options) {
                return res.render('members/edit', { member, instructorOptions: options });
            });
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
            req.body.instructor,
            req.body.id            
        ];

        console.log(values);

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