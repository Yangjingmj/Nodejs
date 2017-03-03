/**
 * Created by dell on 2016/10/23.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Category = require('../models/Category');
var Content = require('../models/Content');
router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        //如果当前用户是否是管理员
        res.send('sorry you are not guanli');
        return;
    }
    next();
})
/*
* 首页
* */
router.get('/',function (req,res,next) {
    res.render('admin/index',{
        userInfo:req.userInfo
    });

});
/*
* 用户管理
* */
router.get('/user',function(req,res){
    /*
    * 读取数据库中所有用户的数据
    *
    * Limit(Number):限制读取的数据条数
    *
    * skip()忽略数据的条数
    *
    * 每页显示两条
    * 1：1-2 skip:0 ->(当前页-1)*limit
    * 2
    * */
    var page = Number(req.query.page || 1);
    var limit =4;

    var pages = 0;
    User.count().then(function(count){
        //计算总页数
        pages =Math.ceil(count/limit);
        //取值不能超过pages
        page =Math.min(page,pages);
        //取值不能小于一
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                url:'/admin/User',
                count:count,
                pages:pages,
                limit:limit,
                page:page
            });
        });
    })
})
/*
* 分类首页
*
* */
router.get('/category',function(req,res){
    var page = Number(req.query.page || 1);
    var limit =2;

    var pages = 0;
    Category.count().then(function(count){
        //计算总页数
        pages =Math.ceil(count / limit);
        //取值不能超过pages
        page =Math.min(page,pages);
        //取值不能小于一
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        /*
        * 1:代表升序
        * -1：代表降序
        * */
       Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                categories:categories,
                url:'/admin/category',
                count:count,
                pages:pages,
                limit:limit,
                page:page
            });
        });
    })
})
/*
* 添加分类
* */
router.get('/category/add', function (req,res){
    res.render('admin/category_add',{
        userInfo:req.userInfo
    });
})
/*
* 分类的保存
* */
router.post('/category/add', function(req, res) {

    // console.log(req.body);
    var name = req.body.name || '';

    if(name == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'mc bunebg wei full'
        });
        return;
    }
       //数据库中是否存在同名分类
    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            //数据库中已经存在
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'fl yj cz'
            })
            return Promise.reject();
        }else{
            //数据库中不尊在
            return new Category({
                name:name
            }).save();
        }
    }).then(function(newCategory){
          res.render('admin/success',{
              userInfo:req.userInfo,
              message:'fl success',
              url:'/admin/category'
          });
    })
});
/*
* 分类的修改
* */
router.get('/category/edit',function(req,res){
    //获取要修改的分类信息，并且用表格的形式展现出来
    var id = req.query.id || '';
    //获取要修改的分类信息
    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'fl bcz',
            });

        }else{
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category:category
            });

        }
    })

});
/*
* 分类的修改保存
* */
router.post('/category/edit',function(req,res){
    //获取要修改的分类信息，并且用表格的形式展现出来
    var id = req.query.id || '';
    //获取Post提交过来的数据
    var name = req.body.name || '';
  //要获取的修改分类信息
    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'fl bcz',
            });
            return Promise.reject();
        }else{
           //要修改的分类名称是否已经在数据库中存在
            if(name == category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'xg cg',
                    url:'/admin/category'
                });
                return Promise.reject();
            }else{
                //要修改的分类名称是否已经在数据库中存在
                Category.findOne({
                    _id:{$ne:id},
                    name:name,
                })
            }
        }
    }).then(function(sameCategory){
   if(sameCategory){
       res.render('admin/error',{
           userInfo:req.userInfo,
           message:'sjkzyjcz',
       });
       return Promise.reject();
   }else{
      return Category.update({
           _id:id
       },{
           name:name
       })
   }
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'xg cg',
            url:'/admin/category'
        });
    })
})
/*
* 分类的删除
* */
router.get('/category/delete',function(req,res){
    //获取要删除的分类Id
    var id = req.query.id || '';
     Category.remove({
         _id:id
     }).then(function(){
         res.render('admin/success',{
             userInfo:req.userInfo,
             message:'sc cg',
             url:'/admin/category'
         });
     })
});
/*
*
* 内容首页
* */
router.get('/content', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Content.count().then(function(count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        Content.find().limit(limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        }).then(function(contents) {
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});
/*
 *
 * 内容添加
 * */
router.get('/content/add',function(req,res){

    Category.find().sort({_id:-1}).then(function(categories){
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories
    })

    })
});
/*
* 内容保存
* */
router.post('/content/add',function(req,res){
    //console.log(req.body);
    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'nr bnwkong'
        })
        return;
    }
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'nrbt bnwkong'
        })
        return;
    }
    //保存数据到数据库
    new Content({
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id.toString(),
        description:req.body.description,
        content:req.body.content
    }).save().then(function(rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'nrbt bcckong',
                url:'/admin/content'
            })
        });

});
/*
 * 修改内容
 * */
router.get('/content/edit', function(req, res) {

    var id = req.query.id || '';

    var categories = [];

    Category.find().sort({_id: 1}).then(function(rs) {

        categories = rs;

        return Content.findOne({
            _id: id
        }).populate('category');
    }).then(function(content) {

        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '指定内容不存在'
            });
            return Promise.reject();
        } else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                categories: categories,
                content: content
            })
        }
    });

});

/*
 * 保存修改内容
 * */
router.post('/content/edit', function(req, res) {
    var id = req.query.id || '';

    if ( req.body.category == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }

    if ( req.body.title == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }

    Content.update({
        _id: id
    }, {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content/edit?id=' + id
        })
    });

});

/*
 * 内容删除
 * */
router.get('/content/delete', function(req, res) {
    var id = req.query.id || '';

    Content.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        });
    });
});

module.exports = router;