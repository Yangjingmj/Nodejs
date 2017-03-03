/**
 * Created by dell on 2016/10/25.
 */
    $(function(){
        var $register = $('#registerBox');
        var $loginBox = $('#loginBox');
        var $userInfo = $('#userInfo');
           $loginBox.find('a').on('click',function(){
               $register.show();
               $loginBox.hide();
           });
        $register.find('a').on('click',function(){
            $loginBox.show();
            $register.hide();
        });

        $register.find('button').on('click',function(){
            $.ajax({
                type:'post',
                url:'/api/user/register',
                data:{
                    username:$register.find('[name="Username"]').val(),
                    password:$register.find('[name="Password"]').val(),
                    repassword:$register.find('[name="repassword"]').val(),
                },
                dataType:'json',
                success:function(result){
                    $register.find('.colWarning').html(result.message);
                    if(!result.code){
                        setTimeout(function(){
                            $loginBox.show();
                            $register.hide();
                        },1000);

                    }
                }
            });
        });
        $loginBox.find('button').on('click',function(){
            $.ajax({
                type:'post',
                url:'/api/user/login',
                data:{
                    username:$loginBox.find('[name="Username"]').val(),
                    password:$loginBox.find('[name="Password"]').val(),
                },
                dataType:'json',
                success:function(result) {
                    $loginBox.find('.colWarning').html(result.message);
                    if(!result.code){
                        //µÇÂ¼³É¹¦

           window.location.reload();
                    }
                }
            });
        });
        //ÍË³ö
        $('.logout').on('click', function() {
            $.ajax({
                url: '/api/user/logout',
                success: function(result) {
                    if (!result.code) {
                        window.location.reload();
                    }
                }
            });
        })
    });


