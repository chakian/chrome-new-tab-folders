var tabItems = [];
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
	tabItems.push(newItem);
	
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
	if(tabItems != null && tabItems.length > 0){
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
	//var text
	allItemsDiv.children('.itemRow' + rowIndex + '').append('<div class="item col-md-3 bg-warning"><span>' + '' + '</span></div>');
}
/*<div class="row">
	<div class="item col-md-3 bg-warning"><span>Test 1</span></div>
	<div class="item col-md-3 bg-warning"><span>Test 2</span></div>
	<div class="item col-md-3 bg-warning"><span>Test 3</span></div>
	<div class="item col-md-3 bg-warning"><span>Test 4</span></div>
</div>*/

$(document).ready(function() {
	allItemsDiv = $('#allItems');
	
    getItems();
	console.log(tabItems.length);
});
