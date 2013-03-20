var init = function() {
  var card = document.getElementById('card');
  
  document.getElementById('signup').addEventListener( 'click', function(evt){
    card.toggleClassName('flipped');
    evt.preventDefault();
  }, false);
  document.getElementById('signin').addEventListener( 'click', function(evt){
    card.toggleClassName('flipped');
    evt.preventDefault();
  }, false);

};

window.addEventListener('DOMContentLoaded', init, false);