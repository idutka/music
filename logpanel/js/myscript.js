$(document).ready(function(){   

var playFactory = {
    init: function () {
        
    },

    createUser : function (user, pass) {
    	$.ajax({
            url: 'http://audio.apphb.com/User/CreateUser',
            data: { userName: user, userPassword: pass },
            dataType: 'jsonp',
            success: function (data) {
                console.log(data);
                $("body").append(data.result);
            }
        })
    },

    login : function (user, pass) {
    	$.ajax({
            url: 'http://audio.apphb.com/User/Login',
            data: { userName: user, userPassword: pass },
            dataType: 'jsonp',
            success: function (data) {
                console.log(data);
                if(data.result){
                    $('body').load('music.html', function() {
                        alert('Load was performed.');
                        $.getScript("jplayer/js/jquery.jplayer.min.js");
                        $.getScript("jplayer/js/jplayer.playlist.min.js");
                        $.getScript("js/myscript.js");
                    });
                }else{
                    alert('ERROR!!!');
                }
            }
        })
    }

}


$("#formsignin").validationEngine('attach', {
  onValidationComplete: function(form, status){
    if(status){
    	var c = form.context;
    	playFactory.login(c.login.value,c.pass.value);
    }
  }
});

$("#formsignup").validationEngine('attach', {
  onValidationComplete: function(form, status){
    if(status){
    	var c = form.context;
    	playFactory.createUser(c.login.value,c.pass.value);
    }
  }
});


 });