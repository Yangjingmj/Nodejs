/**
 * Created by dell on 2016/12/20.
 */
var mongoose = require('mongoose');
var categoriesShema =require('../schemas/categories');

module.exports = mongoose.model('Category',categoriesShema);