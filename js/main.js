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
  refreshCollection();
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

function refreshCollection () {
  $('#tableContent').html('');
  for (var i = 0; i < collection.length; i++) {
    printElement(collection[i]);
  }
  writeCollection();
  exportCollection();
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
                            "<tr id="+el.id+" onclick=\"getElement('"+el.id+"')\">"+
                              "<td hidden>"+el.id+"</td>"+
                              "<td>"+el.theme+"</td>"+
                              "<td>"+el.category+"</td>"+
                              "<td>"+el.number_of_players+"</td>"+
                              "<td>"+el.impro_type+"</td>"+
                              "<td>"+(el.duration-el.duration%60)/60+":"+el.duration%60+"</td>"+
                            "</tr>"
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

function writeCollection () {
  var str=JSON.stringify(collection);
  var file=new File([str],"collection.json");
  var url=URL.createObjectURL(file);
  $('#save').attr('href',url);
}

function exportCollection () {
  var str=collectionToCsv();
  var file=new File([str],"collection.csv");
  var url=URL.createObjectURL(file);
  $('#export').attr('href',url);
}
/****************************  CSV conversion  ***************************/

/**
 * take a json impro and convert it to csv
 * @param  object el impro json
 * @return string    csv formatted value
 * type;;joueurs;
 * ;theme;;
 * ;;categorie;
 */
function toCsv (el) {
  var str = "";
  str+= el.impro_type+";;"+el.number_of_players+";\n"
  str+= ";"+el.theme+";;\n";
  str+= ";;"+el.category+";\n";
  return str;
}

/**
 * take two json impro and convert it to csv
 * @param  object el1 impro json
 * @param  object el2 impro json
 * @return string     csv formatted value
 * type;;joueurs;;;type;;joueurs;
 * ;theme;;;;;theme;;
 * ;;categorie;;;;;categorie;
 */
function toCsv (el1,el2) {
  var str = "";
  str+= el1.impro_type+";;"+el1.number_of_players+";;;"+el2.impro_type+";;"+el2.number_of_players+";\n"
  str+= ";"+el1.theme+";;;;"+";"+el2.theme+";;\n";
  str+= ";;"+el1.category+";;;"+";;"+el2.category+";\n";
  return str;
}

/**
 * All the collection to csv
 * @return str csv file
 */
function collectionToCsv () {
  var str = "";
  for (var i = 0; i < collection.length; i++) {
    if (typeof(collection[i+1]) != 'undefined'){
      str+= toCsv(collection[i],collection[i++]);
    } else {
      str+=toCsv(collection[i]);
    }
    str+="\n\n";
  }
  return str;
}
