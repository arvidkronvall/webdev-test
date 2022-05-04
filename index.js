
//fetches cats from Go Web Server
function getCatFromGoServer(){
  const url = "/cats"
  fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(jsonResponse) {
    sessionStorage.setItem('Cats', JSON.stringify(jsonResponse.cats));
  });
}

function verifyFileFormat(url) {
  //Splits filename at seperator '.' to know if jpg or png
  var splittedString = url.split('.'[0])
  var req = new XMLHttpRequest();

  req.open('GET', url, false);
  req.send();

  //Tries to open filename, if status not OK then filename doesn't exist
  //and we change to png and return whole reformed string. Else return string as it came
  if (req.status!=200){
    console.log("file format is wrong")
    return splittedString[0] + ".png";
  }
  else return url;
}

function displayCat(cat) {
  var _li = document.createElement("li");
  var _img = document.createElement('img')
  var info_div = document.createElement("div");

  // Checks that image format is correct, and makes it correct if not
  _img.src = verifyFileFormat('images/' + cat.image)
  _li.appendChild(_img);

  info_div.innerHTML = cat.name + '<br/>' + 'Cuteness: '
  + cat.cutenessLevel + '<br/>'

  //Generating Lives Left as visual Hearts
  for (let i=0; i<cat.livesLeft; i++){
    var lives = document.createElement('h4')
    lives.innerHTML = '&hearts;'
    info_div.appendChild(lives)
  }

  //Paints out a transparant heart if the cat's suitable for allergy sufferers
  if (cat.allergyInducingFur == false){
    var heart = document.createElement('p')
    heart.innerHTML = '&hearts;'
    _li.appendChild(heart)
  }

  _li.appendChild(info_div);
  document.getElementById("cat-list").appendChild(_li);
}

function generateCats(cats){
  document.getElementById('cat-list').innerHTML = "";
  for (let i=0; i < cats.length; i++){
    displayCat(cats[i])
  }
}

//Bubble-Sorting (low->high) Cats and Create a new sorted version as Session Item
function sortCatsInSessionStorage() {
  let cats = JSON.parse(sessionStorage.getItem('Cats'))
  
	for (let i = 0; i < cats.length; i++) {
		for (let j = 0; j < cats.length-1; j++) {
			if (cats[j].cutenessLevel > cats[j + 1].cutenessLevel) {
				let temp = cats[j];
				cats[j] = cats[j + 1];
				cats[j + 1] = temp;
			}
		}
	}
  sessionStorage.setItem('Sorted', JSON.stringify(cats))
}

//Loads Cats From Go Web Server To Local Storage
// create array from local storage
getCatFromGoServer()
let cats = JSON.parse(sessionStorage.getItem('Cats'))
generateCats(cats)

sortCatsInSessionStorage()
let sorted_cats = JSON.parse(sessionStorage.getItem('Sorted'))

//Listener for "Not Cute"-button
document.getElementById("ascend").addEventListener("click", function() {
  document.getElementById('cat-list').innerHTML = "";

  //loop from high index to low
  for (let i = 0; i < sorted_cats.length; i++){
    displayCat(sorted_cats[i]);
  }

}, true);

//listener for "Much Cute - Button"
document.getElementById("descend").addEventListener("click", function() {
  document.getElementById('cat-list').innerHTML = "";
  
  //loop from low index to high
  for (let i = sorted_cats.length-1; i >= 0; i--){
    displayCat(sorted_cats[i]);
  }

}, true);


//Listener for None-Button
document.getElementById("unsorted").addEventListener("click", function() {
  document.getElementById('cat-list').innerHTML = "";
  generateCats(cats)
}, true);




