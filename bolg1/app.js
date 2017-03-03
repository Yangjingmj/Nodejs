/*应用程序入口*/
//加载express模块
var express = require('express');
//加载模板处理模板
var swig = require('swig');
//创建app文件=>NodeJS Http.createServer();
var mongoose = require('mongoose');
//加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser');
//加载cookies模块
var cookie = require('cookies');
var app = express();
var  User = require('./models/User');
//设置静态文件的托管
//当用户访问的url以/public开始，那么直接返回对应的__dirname+'public'下的文件
app.use('/public',express.static( __dirname+'/public'));
//配置应用模板
//第一个参数定义当前应用所使用的模板引擎的名字，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine('html',swig.renderFile);
//设置模板文件存放的目录，第一个必须是views，第二个是目录
app.set('views','./views');
//注册所使用的模板引擎，第一个参数必须是view engine,第二个参数和这个方法定义的模板引擎名称是一致的，
app.set('view engine','html');
//开发过程中，需要仇晓模板缓存
swig.setDefaults({cache:false});
//bodyParser设置
app.use(bodyParser.urlencoded({extended:true}));
//设置cookie
app.use(function(req,res,next){
    req.cookies=new cookie(req,res);
    //解析登录用户的cookies 信息
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //验证是否是管理员用户
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
 *根据不同的功能划分不同的模块
 *  */

app.use('/admin',require('./routes/admin'));
app.use('/api',require('./routes/api'));
app.use('/',require('./routes/main'));
/*
 * 首页
 * req request 对象
 * res response对象
 * next 函数
 * */
/*app.get('/',function(req,res,next){
 // res.send('<h1>huansuhd</h1>');//这里相当于前后端混合编写
 /*
 * 读取views目录下的指定文件，解析并返回给客户端
 *第一个参数：表示模板文件，相对于views目录 views/index.html;
 *第二个参数：传递给模板使用的数据
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


//监听http请求