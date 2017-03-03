/**
 * Created by dell on 2016/10/23.
 */
var mongoose = require('mongoose');


//用户表结构
module.exports = new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});