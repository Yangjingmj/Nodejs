/**
 * Created by dell on 2016/12/30.
 */
var mongoose = require('mongoose');


//内容表结构
module.exports = new mongoose.Schema({

   //关联字段-内容分类的id
   category:{
       //类型
       type:mongoose.Schema.Types.ObjectId,
       //引用
       ref:'Category'
   },
    //内容标题
    title:String,
    //关联字段-用户id
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'user'
    },
    //添加时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //添加点击量
    views:{
        type:Number,
        default:0
    },
    //简介
    description:{
        type:String,
        default:''
    },
    content:{
        type:String,
        default:''
    },
    //评论
    comments:{
        type:Array,
        default:[]
    }
});