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
        //�����ǰ�û��Ƿ��ǹ���Ա
        res.send('sorry you are not guanli');
        return;
    }
    next();
})
/*
* ��ҳ
* */
router.get('/',function (req,res,next) {
    res.render('admin/index',{
        userInfo:req.userInfo
    });

});
/*
* �û�����
* */
router.get('/user',function(req,res){
    /*
    * ��ȡ���ݿ��������û�������
    *
    * Limit(Number):���ƶ�ȡ����������
    *
    * skip()�������ݵ�����
    *
    * ÿҳ��ʾ����
    * 1��1-2 skip:0 ->(��ǰҳ-1)*limit
    * 2
    * */
    var page = Number(req.query.page || 1);
    var limit =4;

    var pages = 0;
    User.count().then(function(count){
        //������ҳ��
        pages =Math.ceil(count/limit);
        //ȡֵ���ܳ���pages
        page =Math.min(page,pages);
        //ȡֵ����С��һ
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
* ������ҳ
*
* */
router.get('/category',function(req,res){
    var page = Number(req.query.page || 1);
    var limit =2;

    var pages = 0;
    Category.count().then(function(count){
        //������ҳ��
        pages =Math.ceil(count / limit);
        //ȡֵ���ܳ���pages
        page =Math.min(page,pages);
        //ȡֵ����С��һ
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        /*
        * 1:��������
        * -1��������
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
* ��ӷ���
* */
router.get('/category/add', function (req,res){
    res.render('admin/category_add',{
        userInfo:req.userInfo
    });
})
/*
* ����ı���
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
       //���ݿ����Ƿ����ͬ������
    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            //���ݿ����Ѿ�����
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'fl yj cz'
            })
            return Promise.reject();
        }else{
            //���ݿ��в�����
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
* ������޸�
* */
router.get('/category/edit',function(req,res){
    //��ȡҪ�޸ĵķ�����Ϣ�������ñ�����ʽչ�ֳ���
    var id = req.query.id || '';
    //��ȡҪ�޸ĵķ�����Ϣ
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
* ������޸ı���
* */
router.post('/category/edit',function(req,res){
    //��ȡҪ�޸ĵķ�����Ϣ�������ñ�����ʽչ�ֳ���
    var id = req.query.id || '';
    //��ȡPost�ύ����������
    var name = req.body.name || '';
  //Ҫ��ȡ���޸ķ�����Ϣ
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
           //Ҫ�޸ĵķ��������Ƿ��Ѿ������ݿ��д���
            if(name == category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'xg cg',
                    url:'/admin/category'
                });
                return Promise.reject();
            }else{
                //Ҫ�޸ĵķ��������Ƿ��Ѿ������ݿ��д���
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
* �����ɾ��
* */
router.get('/category/delete',function(req,res){
    //��ȡҪɾ���ķ���Id
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
* ������ҳ
* */
router.get('/content', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Content.count().then(function(count) {

        //������ҳ��
        pages = Math.ceil(count / limit);
        //ȡֵ���ܳ���pages
        page = Math.min( page, pages );
        //ȡֵ����С��1
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
 * �������
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
* ���ݱ���
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
    //�������ݵ����ݿ�
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
 * �޸�����
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
                message: 'ָ�����ݲ�����'
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
 * �����޸�����
 * */
router.post('/content/edit', function(req, res) {
    var id = req.query.id || '';

    if ( req.body.category == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '���ݷ��಻��Ϊ��'
        })
        return;
    }

    if ( req.body.title == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '���ݱ��ⲻ��Ϊ��'
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
            message: '���ݱ���ɹ�',
            url: '/admin/content/edit?id=' + id
        })
    });

});

/*
 * ����ɾ��
 * */
router.get('/content/delete', function(req, res) {
    var id = req.query.id || '';

    Content.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'ɾ���ɹ�',
            url: '/admin/content'
        });
    });
});

module.exports = router;