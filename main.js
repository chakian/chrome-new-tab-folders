var tabItems;
var allItemsDiv;

function addItem(name, desc, url) {
	var itemName = name;
	var itemDescription = desc;
	var itemUrl = url;

	// Check that there's some code there.
	if (!itemName && !itemUrl) {
		//message('Error: Empty name or url'); //message function doesn't work. skip for now
		return;
	}

	var newItem = {'name' : itemName, 'desc' : itemDescription, 'url' : itemUrl};
	if(tabItems == undefined){
		tabItems = [newItem];
	}else{
		tabItems.push(newItem);
	}

	// Save it using the Chrome extension storage API.
	chrome.storage.sync.set({'items': tabItems }, function() {
		console.log('saved data', newItem);
    });
}

function getItems(){
	chrome.storage.sync.get('items', function(data) {
		tabItems = data.items;
		fillPage();
	});
}

function fillPage(){
	if(tabItems != undefined && tabItems != null && tabItems.length > 0){
		console.log(tabItems[0].name);
		var rowIndex = 0;
		for(i=0; i<tabItems.length; i++){
			if(i%4 == 0){
				rowIndex = Math.floor(i/4);
				addRow(rowIndex);
			}
			addItemDiv(rowIndex, tabItems[i]);
		}
	}
}
function addRow(rowIndex){
	allItemsDiv.append('<div class="row itemRow' + rowIndex + '"></div>');
}
function addItemDiv(rowIndex, tabItem){
	var text = tabItem.name + (tabItem.desc != null && tabItem.desc != '' ? '<br />' + tabItem.desc : '');
	allItemsDiv.children('.itemRow' + rowIndex + '').append('<a href="' + tabItem.url + '"><div class="item col-md-3 bg-warning"><span>' + text + '</span></div></a>');
}

$(document).ready(function() {
	//initialize global variables
	allItemsDiv = $('#allItems');
	tabItems = [];
	//call initializing functions
  getItems();
	//log... or something
	console.log(tabItems.length);

	//set modal window actions
	$("#addItemButton").on("click", function(e){
	  e.preventDefault();
	  var name = $("#itemName").val();
		var desc = $("#itemDesc").val();
		var url = $("#itemUrl").val();
	  addItem(name, desc, url);
	  $(this).prev().click();
	});
});
