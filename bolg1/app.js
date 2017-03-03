/*Ӧ�ó������*/
//����expressģ��
var express = require('express');
//����ģ�崦��ģ��
var swig = require('swig');
//����app�ļ�=>NodeJS Http.createServer();
var mongoose = require('mongoose');
//����body-parser,��������post�ύ����������
var bodyParser = require('body-parser');
//����cookiesģ��
var cookie = require('cookies');
var app = express();
var  User = require('./models/User');
//���þ�̬�ļ����й�
//���û����ʵ�url��/public��ʼ����ôֱ�ӷ��ض�Ӧ��__dirname+'public'�µ��ļ�
app.use('/public',express.static( __dirname+'/public'));
//����Ӧ��ģ��
//��һ���������嵱ǰӦ����ʹ�õ�ģ����������֣�ͬʱҲ��ģ���ļ��ĺ�׺���ڶ���������ʾ���ڽ�������ģ�����ݵķ���
app.engine('html',swig.renderFile);
//����ģ���ļ���ŵ�Ŀ¼����һ��������views���ڶ�����Ŀ¼
app.set('views','./views');
//ע����ʹ�õ�ģ�����棬��һ������������view engine,�ڶ���������������������ģ������������һ�µģ�
app.set('view engine','html');
//���������У���Ҫ����ģ�建��
swig.setDefaults({cache:false});
//bodyParser����
app.use(bodyParser.urlencoded({extended:true}));
//����cookie
app.use(function(req,res,next){
    req.cookies=new cookie(req,res);
    //������¼�û���cookies ��Ϣ
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //��֤�Ƿ��ǹ���Ա�û�
            User.findById(req.userInfo._id).then(function(userInfo){
              req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }
        catch(e){next();}
    }
    else{
        next();}

});
/*
 *���ݲ�ͬ�Ĺ��ܻ��ֲ�ͬ��ģ��
 *  */

app.use('/admin',require('./routes/admin'));
app.use('/api',require('./routes/api'));
app.use('/',require('./routes/main'));
/*
 * ��ҳ
 * req request ����
 * res response����
 * next ����
 * */
/*app.get('/',function(req,res,next){
 // res.send('<h1>huansuhd</h1>');//�����൱��ǰ��˻�ϱ�д
 /*
 * ��ȡviewsĿ¼�µ�ָ���ļ������������ظ��ͻ���
 *��һ����������ʾģ���ļ��������viewsĿ¼ views/index.html;
 *�ڶ������������ݸ�ģ��ʹ�õ�����
 *
 res.render('index');
 });*/
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27018/blog',function (err) {
    if(err)
    {
        console.log("shujuku is eorro")
    }
    else
    {
        console.log('shujuku is success')
        app.listen(8081);
    }
});


//����http����