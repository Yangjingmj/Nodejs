/**
 * Created by dell on 2016/12/30.
 */
var mongoose = require('mongoose');


//���ݱ�ṹ
module.exports = new mongoose.Schema({

   //�����ֶ�-���ݷ����id
   category:{
       //����
       type:mongoose.Schema.Types.ObjectId,
       //����
       ref:'Category'
   },
    //���ݱ���
    title:String,
    //�����ֶ�-�û�id
    user:{
        //����
        type:mongoose.Schema.Types.ObjectId,
        //����
        ref:'user'
    },
    //���ʱ��
    addTime:{
        type:Date,
        default:new Date()
    },
    //��ӵ����
    views:{
        type:Number,
        default:0
    },
    //���
    description:{
        type:String,
        default:''
    },
    content:{
        type:String,
        default:''
    },
    //����
    comments:{
        type:Array,
        default:[]
    }
});