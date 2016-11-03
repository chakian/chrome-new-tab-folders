var tabItems;
var lastItemId, lastItemOrderId;

function findLatestIdAndOrder(){
	lastItemId = -1;
	lastItemOrderId = -1;
	if(tabItems != undefined){
		for(var i = 0; i<tabItems.length; i++){
			if(tabItems[i].id > lastItemId) lastItemId = tabItems[i].id;
			if(tabItems[i].order > lastItemOrderId) lastItemOrderId = tabItems[i].order;
		}
	}
}

function updateChromeStorage(){
	chrome.storage.sync.set({'items': tabItems }, function() {
		console.log('updated data');
  });
}
function getItemsFromStorage(){
	chrome.storage.sync.get('items', function(data) {
		tabItems = data.items;

    if(tabItems == undefined){
      tabItems = [];
      console.log('answer is empty');
    }else{
      //log... or something
      console.log(tabItems.length);
    }

    fillPage();
	});
}

function fillPage(){
  orderItems();

	if(tabItems != undefined && tabItems != null && tabItems.length > 0){
		console.log(tabItems[0].name);
		for(i=0; i<tabItems.length; i++){
			addItemDiv(tabItems[i]);
		}
	}
}

function addItem(name, desc, url, type) {
	findLatestIdAndOrder();
	var itemId = lastItemId + 1;
	var itemOrder = lastItemOrderId + 1;

	// Check that there's some code there.
	if (!name || !url) {
		alert('Error: Empty name or url');
		return false;
	}

	if(!url.startsWith('http')){
		url = 'http://' + url;
	}

	var newItem = {'name' : name, 'desc' : desc, 'url' : url, 'id' : itemId, 'order' : itemOrder, 'type' : type};
	if(tabItems == undefined){
		tabItems = [newItem];
	}else{
		tabItems.push(newItem);
	}
	addItemDiv(newItem);

	updateChromeStorage();
	return true;
}

function addLinkItem(name, desc, url){
  return addItem(name, desc, url, 'link');
}

function deleteItem(deleteId){
	var itemToDelete;
	for(var i=0;i<tabItems.length; i++){
		if(tabItems[i].id == deleteId){
			itemToDelete = tabItems[i];
			break;
		}
	}
	var indexOfItemToDelete = tabItems.indexOf(itemToDelete);
	tabItems.splice(indexOfItemToDelete, 1);

	updateChromeStorage();

	$('#itemX_'+ deleteId +'').remove();
}

function changeOrderOfItem(itemId, orderValue){
	for(var i=0;i<tabItems.length; i++){
		if(tabItems[i].id == itemId){
			itemToUpdate = tabItems[i].order = orderValue;
			break;
		}
	}
}

function orderItems(){
	if(tabItems != undefined && tabItems.length > 1){
		quickSort(tabItems, 0, tabItems.length - 1);
	}
}

function getItems(){
	tabItems = getItemsFromStorage();
}
