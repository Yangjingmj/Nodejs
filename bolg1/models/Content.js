/**
 * Created by dell on 2016/12/20.
 */
var mongoose = require('mongoose');
var contentsShema =require('../schemas/contents');

module.exports = mongoose.model('Content',contentsShema);
