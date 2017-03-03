var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');

//ͳһ���ظ�ʽ
var responseData;

router.use( function(req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }

    next();
} );

/*
 * �û�ע��
 *   ע���߼�
 *
 *   1.�û�������Ϊ��
 *   2.���벻��Ϊ��
 *   3.���������������һ��
 *
 *   1.�û��Ƿ��Ѿ���ע����
 *       ���ݿ��ѯ
 *
 * */
router.post('/user/register', function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    //�û��Ƿ�Ϊ��
    if ( username == '' ) {
        responseData.code = 1;
        responseData.message = '�û�������Ϊ��';
        res.json(responseData);
        return;
    }
    //���벻��Ϊ��
    if (password == '') {
        responseData.code = 2;
        responseData.message = '���벻��Ϊ��';
        res.json(responseData);
        return;
    }
    //����������������һ��
    if (password != repassword) {
        responseData.code = 3;
        responseData.message = '������������벻һ��';
        res.json(responseData);
        return;
    }

    //�û����Ƿ��Ѿ���ע���ˣ�������ݿ����Ѿ����ں�����Ҫע����û���ͬ�������ݣ���ʾ���û����Ѿ���ע����
    User.findOne({
        username: username
    }).then(function( userInfo ) {
        if ( userInfo ) {
            //��ʾ���ݿ����иü�¼
            responseData.code = 4;
            responseData.message = '�û����Ѿ���ע����';
            res.json(responseData);
            return;
        }
        //�����û�ע�����Ϣ�����ݿ���
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newUserInfo) {
        responseData.message = 'ע��ɹ�';
        res.json(responseData);
    });
});

/*
 * ��¼
 * */
router.post('/user/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if ( username == '' || password == '' ) {
        responseData.code = 1;
        responseData.message = '�û��������벻��Ϊ��';
        res.json(responseData);
        return;
    }

    //��ѯ���ݿ�����ͬ�û���������ļ�¼�Ƿ���ڣ�����������¼�ɹ�
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo) {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = '�û������������';
            res.json(responseData);
            return;
        }
        //�û�������������ȷ��
        responseData.message = '��¼�ɹ�';
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        }
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);
        return;
    })

});

/*
 * �˳�
 * */
router.get('/user/logout', function(req, res) {
    req.cookies.set('userInfo', null);
    res.json(responseData);
});

/*
 * ��ȡָ�����µ���������
 * */
router.get('/comment', function(req, res) {
    var contentId = req.query.contentid || '';

    Content.findOne({
        _id: contentId
    }).then(function(content) {
        responseData.data = content.comments;
        res.json(responseData);
    })
});

/*
 * �����ύ
 * */
router.post('/comment/post', function(req, res) {
    //���ݵ�id
    var contentId = req.body.contentid || '';
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    };

    //��ѯ��ǰ��ƪ���ݵ���Ϣ
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent) {
        responseData.message = '���۳ɹ�';
        responseData.data = newContent;
        res.json(responseData);
    });
});

module.exports = router;