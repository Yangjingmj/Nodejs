/**
 * Created by dell on 2016/10/23.
 */
var mongoose = require('mongoose');
var usersShema =require('../schemas/users');

module.exports = mongoose.model('user',usersShema);