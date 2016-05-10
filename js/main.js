var collection = [];
var id = 0;
var current_id;

$('#create').click(function () {
  var el = {
    "id":                ++id,
  	"category":          $('#category').val(),
  	"duration":          $('#timerM').val()*60 + $('#timerS').val()*1,
  	"number_of_players": $('#number_of_players').val(),
  	"theme":             $('#theme_title').val(),
  	"impro_type":        $('#impro_type').val()
  }
  collection.push(el);
  printElement(el);
});
$('#change').click(function () {
  var el = {
    "id":                current_id,
    "category":          $('#category').val(),
    "duration":          $('#timerM').val()*60 + $('#timerS').val()*1,
    "number_of_players": $('#number_of_players').val(),
    "theme":             $('#theme_title').val(),
    "impro_type":        $('#impro_type').val()
  }
  for (var i = 0; i < collection.length; i++)
    if (collection[i].id == current_id) break;
  collection[i] = el;
  refreshCollection();
});
$('#delete').click(function () {
  for (var i = 0; i < collection.length; i++)
    if (collection[i].theme == $('#theme_title').val()) break;
  collection.splice(i,1);
  refreshCollection();
});

$('#import').change( function (event) {
  var tmppath = URL.createObjectURL(event.target.files[0]);

  $.getJSON(tmppath, function(data) {
      collection = data;
      id+=collection.length;
      refreshCollection();
  });
});

$('#export').change(); // TODO export to a pdf or image file (or whatever) to have printable cards for user
$('#save').change(); // TODO save into a .json file

function refreshCollection () {
  $('#tableContent').html('');
  for (var i = 0; i < collection.length; i++) {
    printElement(collection[i]);
  }
}

/**
 * Print a element in the table
 * @param  object  el
 * {
 * 	"category": "huit clos",
 * 	"duration": "330",
 * 	"number_of_players": "3 joueurs",
 * 	"theme": "la canne à sel",
 * 	"impro_type": "comparée"
 * }
 */
function printElement (el) {
  $('#tableContent').append(
                            "<tr id="+el.id+" onclick=\"getElement('"+el.id+"')\"><td>"+el.id+"</td><td>"
                            +el.theme+"</td><td>"
                            +el.category+"</td><td>"
                            +el.number_of_players+"</td><td>"
                            +el.impro_type+"</td><td>"
                            +(el.duration-el.duration%60)/60+":"+el.duration%60+"</td></tr>"
                            );
}

/**
 * Remove an element from the table with its theme
 * @param  string theme
 */
function getElement (anId) {
  for (var i = 0; i < collection.length; i++) {
    if (collection[i].id == anId){
      break;
    }
  }
  current_id = anId;
  $('#number_of_players').val( collection[i].number_of_players );
  $('#theme_title').val( collection[i].theme );
  $('#category').val( collection[i].category );
  $('#impro_type').val( collection[i].impro_type );
}
