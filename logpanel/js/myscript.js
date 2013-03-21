$(document).ready(function(){   

var playFactory = {

    token : null,
    list : null, 

    init: function () {
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
                //console.log(data);
                playFactory.token = data.token;
                if(data.result){
                    $('body').load('music.html #wrapper', function() {
                        $.getScript("jplayer/js/jquery.jplayer.min.js", function() {
                            $.getScript("jplayer/js/jplayer.playlist.min.js", function() {
                                playFactory.getAudioList();
                                playFactory.initAlbomStyle();
                            });
                        }); 
                    });
                }else{
                    alert('ERROR!!!');
                }
            }
        })
    },

    getAudioList: function () {

         $.ajax({
              dataType: "json",
              url: "GetAudioList.json",
  
              success: function(data) {
                playFactory.list = data;

                playFactory.initPlayer(playFactory.list.Albums[11].Audio);
                playFactory.viewAlboms('box');
              },
              error: function(jqXHR) {
                    console.log(jqXHR)
              }
          });
    },

    initPlayer: function (playlist) {
        // $("#jquery_jplayer_1").jPlayer("destroy");

        $("#jquery_jplayer_1").jPlayer();

        new jPlayerPlaylist({
            jPlayer: "#jquery_jplayer_1",
            cssSelectorAncestor: "#jp_container_1"
        }, 
        playlist , 
        {
            swfPath: "js",
            supplied: "mp3",
            wmode: "window"
        });

    },

    viewAlboms: function (type) {
        // order to render their markup.
        _.templateSettings.variable = "rc";
 
        // Grab the HTML out of our template tag and pre-compile it.
        var template = _.template(
            $( "script."+type).html()
        );

  
        $( "#songs" ).html(
            template(playFactory.list)
        );

        playFactory.initAlbomEvent();
 
    },

    initAlbomStyle: function () {
        function drawActivButton (t) {
            $("#viewcontrol").children().each(function(){
                if(t == this){
                    $(this).addClass("active");
                }else{
                    $(this).removeClass("active");
                }
            });
        }

        $("#viewcontrol .list_img").click(function () {
            drawActivButton(this);
            playFactory.viewAlboms('list');
        })

        $("#viewcontrol .blocks").click(function () {
            drawActivButton(this);
            playFactory.viewAlboms('box');
        })
    },

    initAlbomEvent: function () {
       
       $('#songs').children().each(function(i){
            $(this).click(function(){
                var j = i;
                // console.log(playFactory.list.Albums[j].Audio);
                // playFactory.initPlayer(playFactory.list.Albums[j].Audio);
                $('#nowplay img').attr("src", playFactory.list.Albums[j].Img);
            });
        });
            
    }

}

playFactory.init();

 });