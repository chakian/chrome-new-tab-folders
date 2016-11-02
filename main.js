var tabItems;
var allItemsDiv;

var lastItemId, lastItemOrderId;

function findLatestIdAndOrder(){
	lastItemId = -1;
	lastItemOrderId = -1;
	if(tabItems != undefined){
		for(var i = 0; i<tabItems.length; i++){
			if(tabItems[i].id > lastItemId){
				lastItemId = tabItems[i].id;
			}
			if(tabItems[i].order > lastItemOrderId){
				lastItemOrderId = tabItems[i].order;
			}
		}
	}
}

function addItem(name, desc, url) {
	var itemName = name;
	var itemDescription = desc;
	var itemUrl = url;

	findLatestIdAndOrder();
	var itemId = lastItemId + 1;
	var itemOrder = lastItemOrderId + 1;

	// Check that there's some code there.
	if (!itemName || !itemUrl) {
		alert('Error: Empty name or url');
		return false;
	}

	if(!itemUrl.startsWith('http')){
		itemUrl = 'http://' + itemUrl;
	}

	var newItem = {'name' : itemName, 'desc' : itemDescription, 'url' : itemUrl, 'id' : itemId, 'order' : itemOrder};
	if(tabItems == undefined){
		tabItems = [newItem];
	}else{
		tabItems.push(newItem);
	}
	addItemDiv(newItem);

	updateChromeStorage();
	return true;
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
	chrome.storage.sync.get('items', function(data) {
		tabItems = data.items;
		orderItems();
		fillPage();
	});
}

function fillPage(){
	if(tabItems != undefined && tabItems != null && tabItems.length > 0){
		console.log(tabItems[0].name);
		for(i=0; i<tabItems.length; i++){
			addItemDiv(tabItems[i]);
		}
	}
}

function addItemDiv(tabItem){
	var text = tabItem.name + (tabItem.desc != null && tabItem.desc != '' ? '<br />' + tabItem.desc : '');
	var itemHtml = '';
	itemHtml += '<div class="col-md-2 bg-warning itemDiv" id="itemX_'+ tabItem.id +'">';
	itemHtml += '	<input type="hidden" name="itemId" value="' + tabItem.id + '">';
	itemHtml += '	<input type="hidden" name="itemOrder" value="' + tabItem.order + '">';
	itemHtml += '	<a href="' + tabItem.url + '">';
	itemHtml += '		<div class="itemBox">';
	itemHtml += '			<span>' + text + '</span>';
	itemHtml += '		</div>';
	itemHtml += '	</a>';
	itemHtml += '	<a href="#" class="close">X</a>';
	itemHtml += '</div>';
	allItemsDiv.append(itemHtml);
	$('#itemX_' + tabItem.id + '').click(function(){
		deleteItem(tabItem.id);
	});
}

function updateChromeStorage(){
	chrome.storage.sync.set({'items': tabItems }, function() {
		console.log('updated data');
  });
}

$(document).ready(function() {
	//for test purposes
	//chrome.storage.sync.clear();


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
	  if(addItem(name, desc, url)){
			$(this).prev().click();
			$("#itemName").val('');
			$("#itemDesc").val('');
			$("#itemUrl").val('');
		}
	});

	Sortable.create(allItems, {
		animation: 150,
		onEnd: function (evt) {
			var orderIndex = 0;
			$(".itemDiv").each(function(i) {
				var currentId = this.children.namedItem('itemId').value;
				this.children.namedItem('itemOrder').value = orderIndex;
				changeOrderOfItem(currentId, orderIndex);
				orderIndex++;
			});
			updateChromeStorage();
		}
	});

});
