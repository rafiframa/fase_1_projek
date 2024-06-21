let User = require(`../models`).User
let Post = require(`../models`).Post
let PostTag = require(`../models`).PostTag
let Profile = require(`../models`).Profile
let Tag = require(`../models`).Tag
var bcrypt = require('bcryptjs');
const formatDate = require('../Helpers/format');
const commmaIntoArray = require('../Helpers/commaIntoArray')

class Controller {
    static async showLandingPage(req, res) {
        try {
            res.render("LandingPage")
        } catch (err) {
            res.send(err)
        }
    }

    static async showRegister(req, res) {
        try {
            let error = req.query.error
            res.render("Register", { error })
        } catch (err) {
            res.send(err)
        }
    }

    static async showLogin(req, res) {
        try {
            let error = req.query.error
            res.render("Login", { error })
        } catch (err) {
            res.send(err)
        }
    }

    static async postRegister(req, res) {
        try {
            let { username, email, password, role } = req.body
            let create = await User.create(req.body)
            // console.log(create.id, "<=======================")
            let createProfile = await Profile.create({
                name: "",
                bio: "",
                UsersId: create.id
            }
            )
            res.redirect(`/login`)
        } catch (err) {
            if (err.name === "SequelizeValidationError") {
                res.redirect(`/register?error=${err.message}"`)
            } else {
                res.send(err)
            }

        }
    }

    static async postLogin(req, res) {
        try {
            let userInstance = await User.getUserInstance(req.body.username)
            if (userInstance) {
                if (bcrypt.compareSync(req.body.password, userInstance.password)) {

                    req.session.user = {
                        id: userInstance.id,
                        username: userInstance.username,
                        email: userInstance.email,
                        role: userInstance.role
                    };
                    res.redirect('/home');
                } else {
                    res.redirect(`/login?error=Wrong+Username+or+Password`);
                }
            } else {
                res.redirect(`/login?error=Wrong+Username+or+Password`);
            }
        } catch (err) {
            res.send(err);
        }
    }


    static async showHome(req, res) {
        try {

            let options = {
                include: [
                    {
                        model: User,
                    },
                    {
                        model: PostTag,
                        include: [
                            {
                                model: Tag,
                            },
                        ],
                    },
                ],
                order: [['createdAt', 'DESC']]
            }
            if (req.query.search) {
                const { Op } = require("sequelize");
                options.include[0].where = {
                    username: {
                        [Op.iLike]: `%${req.query.search}%`
                    }
                }
            }

            const posts = await Post.findAll(options)
            res.render("Home", { posts, formatDate })

        } catch (err) {
            res.send(err)
        }
    }

    static async addTweet(req, res) {
        try {
            if (!req.session.user) {
                res.redirect(`/`)
            }
            else{
            res.render("AddTweet")}
        } catch (err) {
            res.send(err)
        }
    }

    static async postTweet(req, res) {
        try {
            let UsersId = req.session.user.id
            let content = req.body.content
            let tags = commmaIntoArray(req.body.tags)
            let image;
            if (req.file) {
                image = `${req.file.filename}`;
            } else {
                image = null;
            }

            let create = await Post.create({ UsersId, content, image })

            for (const tag of tags) {
                let foundTag = await Tag.findOne({
                    where: { name: tag }
                });
        
                console.log("FOUNDTAG OK \n");
                console.log(foundTag, "<=================FoundTag")
        
                let createTag;
                if (!foundTag) {
                    createTag = await Tag.create({ name: tag });
                    console.log("CREATETAG OK \n");
                } else {
                    createTag = foundTag;
                }
        
                let createPostTag = await PostTag.create({
                    TagId: createTag.id,
                    PostId: create.id
                });
        
                console.log("CREATEPOSTTAG OK \n");
            }
            res.redirect(`home`)
        } catch (err) {
            res.send(err)
        }
    }
    

    static async showProfile(req, res) {
        try {
            console.log(req.session.user, "user<=====")
            if(req.session.user){
                let id = req.params.id
                let user = await User.findOne({
                    where: { id: id },
                    include: {
                        model: Profile
                    }
                });
    
                if(req.session.user.id == id){
                    res.render("ShowOwnProfile", { user })
                }
                else{
                    res.render("ShowProfile", { user })
                }
            }else{
                let id = req.params.id
                let user = await User.findOne({
                    where: { id: id },
                    include: {
                        model: Profile
                    }
                });
                res.render("ShowProfile", { user })
            }
            
        } catch (err) {
            res.send(err)
        }
    }

    static async showTag(req, res) {
        try {
            let id = req.params.id
            let tag = await Tag.findOne({
                where: { id: id },
                include: [
                    {
                        model: PostTag,
                        include: [
                            {
                                model: Post,
                                include:{model:User}
                            },
                        ],
                    },
                ]
            });
            res.render("ShowTag", { tag, formatDate })
        } catch (err) {
            res.send(err)
        }
    }

    static async postEditBio(req, res) {
        try {
            console.log(req.body, "<============BODY")
            console.log(req.session.user.id, "<============user")
            let update = Profile.update(
                { name: req.body.name,
                    bio: req.body.bio
                 },
                {
                  where: {
                    UsersId: req.session.user.id,
                  },
                })
            res.redirect("/Home")
        } catch (err) {
            res.send(err)
        }
    }
}
module.exports = Controller