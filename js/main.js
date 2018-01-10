let collection = []
let categories
let id = 0
let current_id

$('#create').click(function () {
	const el = {
		'id': ++id,
		'category': $('#category').val(),
		'duration': $('#timerM').val() * 60 + $('#timerS').val() * 1,
		'number_of_players': $('#number_of_players').val(),
		'theme': $('#theme_title').val(),
		'impro_type': $('#impro_type').val(),
	}
	collection.push(el);
  refreshCollection();
});

$('#change').click(function () {
  for (var i = 0; i < collection.length; i++)
    if (collection[i].id == current_id) break;

  console.log(collection[i].id);
  console.log(current_id);
  collection[i] = {
    "id":                current_id,
    "category":          $('#category').val(),
    "duration":          $('#timerM').val()*60 + $('#timerS').val()*1,
    "number_of_players": $('#number_of_players').val(),
    "theme":             $('#theme_title').val(),
    "impro_type":        $('#impro_type').val()
  }
  refreshCollection();
});

$('#delete').click(function () {
  for (var i = 0; i < collection.length; i++)
    if (collection[i].theme == $('#theme_title').val()) break;
  collection.splice(i,1);
  refreshCollection();
});

$('#import').change( function (event) {
	const tmppath = URL.createObjectURL(event.target.files[0])

	$.getJSON(tmppath, function(data) {
      collection = data;
      id+=collection.length;
      refreshCollection();
  });
});

$('#category').change(function (event) {
  const [category] = categories.filter(({name}) => name === event.target.value);
  $('#category_description').text(
    (category === undefined || category.description === undefined) ? '' : category.description
  )
});

/*********************** Insert categories in html ***********************/

$.getJSON('categories.json', function (data) {
  categories = data
  $("#category_list").append(categories.map(({name, description}) =>
	  `<option value="${name}">${
		  description !== undefined ? description.slice(0, 50) + '...' : ''}</option>`
  ))
})

/**************************** Table functions ****************************/
function refreshCollection () {
  $('#tableContent').html('');
  for (let i = 0; i < collection.length; i++) {
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
                              "<td>"+convertTime(el.duration,false)+"</td>"+
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
  $('#timerM').val(Math.floor(collection[i].duration/60));
  $('#timerS').val(collection[i].duration%60);
}

/***************************  Saving functions ***************************/
function writeCollection () {
	const str = JSON.stringify(collection)
	const file = new File([str], 'collection.json')
	const url = URL.createObjectURL(file)
	$('#save').attr('href',url);
}

function exportCollection () {
	const str = collectionToCsv()
	const file = new File([str], 'collection.csv')
	const url = URL.createObjectURL(file)
	$('#export').attr('href',url);
}
/****************************  CSV conversion  ***************************/

/**
 * take one or more json impro and convert it to csv
 * @param  object * impro json
 * @return string   csv formatted value
 * type;;joueurs;
 * ;theme;;
 * ;;categorie;
 */
function toCsv () {
	let str = ''
	for (var el = 0; el < arguments.length; el++) {
    str+= arguments[el].impro_type+";;\""+arguments[el].number_of_players+"\";";
    str+=";;";
  }
  str+="\n";
  for (var el = 0; el < arguments.length; el++) {
    str+= ";\""+arguments[el].theme+"\";;";
    str+=";;";
  }
  str+="\n";
  for (var el = 0; el < arguments.length; el++) {
    str+= convertTime(arguments[el].duration,false)+
          ";;\""+arguments[el].category+"\";";
    str+=";;";
  }
  str+="\n";
  return str;
}

/**
 * All the collection to csv
 * @return str csv file
 */
function collectionToCsv () {
	let str = ''
	for (let i = 0; i < collection.length; i++) {
    if (typeof(collection[i+1]) != 'undefined' && typeof(collection[i]) != 'undefined'){
      str+= toCsv(collection[i],collection[++i]);
    } else {
      str+=toCsv(collection[i]);
    }
    str+="\n\n";
  }
  return str;
}

/********************************* Timer *********************************/
/**
 * Convert seconds time to human readable time
 * @param  number time       time in seconds
 * @param  bool show_zeros   default value true, show unecessary zeros
 * @return string            format mm:ss
 */
function convertTime(time, showZeros) {
	const zeros = (typeof(showZeros) === 'boolean') ? showZeros : true
	const hours = Math.floor(time / 3600)
	let minutes = Math.floor(time / 60) - 60 * hours
	let seconds = time % 60
	if (minutes < 10 && (zeros || hours)) {
      minutes = "0" + minutes;
  }
  if (seconds < 10 && (zeros || minutes || hours )) {
      seconds = "0" + seconds;
  }
  if (hours) {
    return hours + ':' + minutes + ':' + seconds;
  }
  if (zeros || minutes) {
    return minutes + ':' + seconds;
  }
  return seconds;
}
