$(document).ready(function(){   

var playFactory = {

    token : null,
    list : null, 
    playlist: null,


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

        var card = document.getElementById('card');
  
        document.getElementById('signup').addEventListener( 'click', function(evt){
          card.toggleClassName('flipped');
          evt.preventDefault();
        }, false);

        document.getElementById('signin').addEventListener( 'click', function(evt){
          card.toggleClassName('flipped');
          evt.preventDefault();
        }, false);


    },

    createUser : function (user, pass) {
    	$.ajax({
            url: 'http://audio.apphb.com/User/CreateUser',
            data: { userName: user, userPassword: pass },
            dataType: 'jsonp',
            success: function (data) {
                // console.log(data);
                $.ambiance({message: "Registration was successful!",type: "success"});
            }
        })
    },

    login : function (user, pass) {
    	$.ajax({
            url: 'http://audio.apphb.com/User/Login',
            data: { userName: user, userPassword: pass },
            dataType: 'jsonp',
            success: function (data) {
                // console.log(data);
                playFactory.token = data.token;
                if(data.result){
                    $('body #page').load(('music.html'+'?_=' + (new Date()).getTime()+' #wrapper'), function() {
                        $.getScript("jplayer/js/jquery.jplayer.min.js", function() {
                            $.getScript("jplayer/js/jplayer.playlist.min.js", function() {
                                playFactory.getAudioList();
                                playFactory.initAlbomStyle();
                            });
                        }); 
                    });
                }else{
                    $.ambiance({message: "Invalid login or password!", type: "error"});
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
                playFactory.playAlbom(0);
                playFactory.viewAlboms('box');
              },
              error: function(jqXHR) {
                    console.log(jqXHR)
              }
          });
    },

    playAlbom: function (n) {
        playFactory.initPlayer(playFactory.list.Albums[n].Audio);
        $('#nowplay img').attr("src", playFactory.list.Albums[n].Img);
        $('#play .jp-artist').text(playFactory.list.Albums[n].Artist);
    },

    initPlayer: function (myplaylist) {
        
        // console.log(myplaylist);
        
        if(playFactory.playlist){
            playFactory.playlist.remove();
            $("#jquery_jplayer_1").jPlayer("destroy");
        };

        var cssSelector = { 
            jPlayer: "#jquery_jplayer_1", 
            cssSelectorAncestor: "#jp_container_1" 
        };

        var options = { 
            playlistOptions: {
                autoPlay: true
            },
            swfPath: "jplayer/js", 
            supplied: "mp3", 
            wmode: "window"
        };

        playFactory.playlist = new jPlayerPlaylist(cssSelector, myplaylist, options);

    },

    viewAlboms: function (type) {

        _.templateSettings.variable = "rc";
 
        // Grab the HTML out of our template tag and pre-compile it.
        var template = _.template(
            $( "script."+type).html()
        );

  
        $( "#songs" ).html(
            template(playFactory.list.Albums)
        );

        

        playFactory.initAlbomEvent();
 
    },

    viewSortAlboms: function () {        

        playFactory.groupSongs();

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

        function drawViewActiv (t) {
            $("#options").children().each(function(){
                if(t == this){
                    $(this).addClass("noactive");
                }else{
                    $(this).removeClass("noactive");
                }
            });
        }

        $("#viewcontrol .list_img").click(function (evt) {
            drawActivButton(this);
            playFactory.viewAlboms('list');
            evt.preventDefault();
        })

        $("#viewcontrol .blocks").click(function (evt) {
            drawActivButton(this);
            playFactory.viewAlboms('box');
            evt.preventDefault();
        })

        $("#options .viewalbom").click(function (evt) {
            drawViewActiv(this);
            playFactory.viewAlboms('box');
            evt.preventDefault();
        })

        $("#options .viewganre").click(function (evt) {
            drawViewActiv(this);
            playFactory.viewSortAlboms();
            evt.preventDefault();
        })



    },

    initAlbomEvent: function () {
       
       $('#songs').find('.song').each(function(i){
            $(this).click(function(evt){
                var j = i;
                // console.log(playFactory.list.Albums[j].Audio);
                if(playFactory.list.Albums[j].Audio.length > 0){
                    playFactory.playAlbom(j);
                }else{
                    $.ambiance({message: "Songs not found!"});
                }
                evt.preventDefault();
            });
        });
            
    },


    groupSongs: function () {
        var data = playFactory.list.Albums;


        $("#songs").html('');

        var groupData = _.groupBy(data, function(obj) {
          return obj.Genre;
        });

        var optGroups = [];

        for (var key in groupData) {
          if (groupData.hasOwnProperty(key)) {
                // console.log(key);
                var gd = groupData[key];
                gd.title = key;
                optGroups.push(gd);
          }
        }


            for(var i = 0; i < optGroups.length; i++) {
                console.log(optGroups[i]);

                        _.templateSettings.variable = "rc";

                        var template = _.template(
                            $( "script.box").html()
                        );

                        var gr = $('<div>').attr("class","gn").append('<div>'+optGroups[i].title+'</div>').append(template(optGroups[i]));

                        $( "#songs").append(gr);
            }

    }

}

playFactory.init();

 });