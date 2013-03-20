$(document).ready(function(){   

var playFactory = {
    makeCar: function (features) {
    },

    createUser : function (user, pass) {
    	$.ajax({
            url: 'http://audio.apphb.com/User/CreateUser',
            data: { userName: user, userPassword: pass },
            dataType: 'jsonp',
            success: function (data) {
                console.log(data);
                alert(data.result);
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
                alert(data.result);
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