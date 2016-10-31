var tabItems;
var allItemsUl;

function addItem(name, desc, url) {
	var itemName = name;
	var itemDescription = desc;
	var itemUrl = url;

	// Check that there's some code there.
	if (!itemName || !itemUrl) {
		alert('Error: Empty name or url');
		return false;
	}

	var newItem = {'name' : itemName, 'desc' : itemDescription, 'url' : itemUrl};
	if(tabItems == undefined){
		tabItems = [newItem];
	}else{
		tabItems.push(newItem);
		addItemLi(newItem);
	}

	// Save it using the Chrome extension storage API.
	chrome.storage.sync.set({'items': tabItems }, function() {
		console.log('saved data', newItem);
    });
	return true;
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
		for(i=0; i<tabItems.length; i++){
			addItemLi(tabItems[i]);
		}
	}
}

function addItemLi(tabItem){
	var text = tabItem.name + (tabItem.desc != null && tabItem.desc != '' ? '<br />' + tabItem.desc : '');
	allItemsUl.append('<li class="col-md-3 bg-warning"><div class="itemBox"><span><a href="' + tabItem.url + '">' + text + '</a></span></div></li>');
}

$(document).ready(function() {
	//initialize global variables
	allItemsUl = $('#allItems');
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
	  if(addItem(name, desc, url)){
			$(this).prev().click();
		}
	});

	$( "#allItems" ).sortable();
  $( "#allItems" ).disableSelection();
});
