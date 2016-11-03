var allItemsDiv;

function getCommonDivHtml(tabItem){
	var itemHtml = '';
	var text = tabItem.name + (tabItem.desc != null && tabItem.desc != '' ? '<br />' + tabItem.desc : '');

	itemHtml += '<div class="col-md-2 ___ITEMDIVCLASS___" id="itemX_'+ tabItem.id +'">';
	itemHtml += '	<input type="hidden" name="itemId" value="' + tabItem.id + '">';
	itemHtml += '	<input type="hidden" name="itemOrder" value="' + tabItem.order + '">';
	itemHtml += '___MAIN_ANCHOR___';
	itemHtml += '		<div class="itemBox">';
	itemHtml += '			<span>' + text + '</span>';
	itemHtml += '		</div>';
	itemHtml += '	</a>';
	itemHtml += '	<a href="#" class="close">X</a>';
	itemHtml += '</div>';
	itemHtml += '___SUB_ITEMS___';

	return itemHtml;
}
function getLinkDivHtml(tabItem){
	var itemHtml = getCommonDivHtml(tabItem);
	itemHtml = itemHtml.replace('___MAIN_ANCHOR___', '<a href="' + tabItem.url + '">');
	itemHtml = itemHtml.replace('___SUB_ITEMS___', '');
	itemHtml = itemHtml.replace('___ITEMDIVCLASS___', 'itemDiv');
	return itemHtml;
}
function getSubLinkDivHtml(tabItem){
	var itemHtml = getCommonDivHtml(tabItem);
	itemHtml = itemHtml.replace('___MAIN_ANCHOR___', '<a href="' + tabItem.url + '">');
	itemHtml = itemHtml.replace('___SUB_ITEMS___', '');
	itemHtml = itemHtml.replace('___ITEMDIVCLASS___', 'subItemDiv');
	return itemHtml;
}
function getFolderDivHtml(tabItem){
	var itemHtml = getCommonDivHtml(tabItem);
	itemHtml = itemHtml.replace('___MAIN_ANCHOR___', '<a href="#" data-toggle="modal" data-target="#subItemsX_'+ tabItem.id +'">');
	itemHtml = itemHtml.replace('___ITEMDIVCLASS___', 'itemDiv');

	var subItemsHtml = '';
	subItemsHtml += '<div id="subItemsX_'+ tabItem.id +'" class="modal" tabindex="-1" role="dialog" aria-labelledby="subItemsLabel'+ tabItem.id +'">';
	subItemsHtml += '<div class="modal-dialog modal-lg" role="document">';
	subItemsHtml += '	<div class="modal-content">';
	subItemsHtml += '		<div class="modal-header">';
	subItemsHtml += '			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	subItemsHtml += '			<h4 class="modal-title" id="subItemsLabel'+ tabItem.id +'">Folder :: ' + tabItem.name + '</h4>';
	subItemsHtml += '		</div>';
	subItemsHtml += '		<div class="modal-body">';
	subItemsHtml += '			<div class="row">';

	if(tabItem.subItems != undefined){
		for(var i = 0; i<tabItem.subItems.length; i++){
			subItemsHtml += getSubLinkDivHtml(tabItem.subItems[i]);
		}
	}

	subItemsHtml += getSubLinkDivHtml(tabItem);
	subItemsHtml += getSubLinkDivHtml(tabItem);

	subItemsHtml += '			</div>';
	subItemsHtml += '		</div>';
	subItemsHtml += '		<div class="modal-footer">';
	subItemsHtml += '			<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
	subItemsHtml += '		</div>';
	subItemsHtml += '	</div>';
	subItemsHtml += '</div>';

	itemHtml = itemHtml.replace('___SUB_ITEMS___', subItemsHtml);

	return itemHtml;
}
function getDivHtml(tabItem){
	if(tabItem.type == 'folder'){
		return getFolderDivHtml(tabItem);
	} else {
		return getLinkDivHtml(tabItem);
	}
}

function addItemDiv(tabItem){
	var itemHtml = getDivHtml(tabItem);

	allItemsDiv.append(itemHtml);

	$('#itemX_' + tabItem.id + ' .close').click(function(){
		if(tabItem.type == 'link') {
			deleteItem(tabItem.id);
		} else {
			//TODO: Handle the deletion operation of folder here
		}
	});
	$('#subItemX_' + tabItem.id + ' .close').click(function(){
		if(tabItem.type == 'link') {
			deleteItem(tabItem.id);
		} else {
			//TODO: Handle the deletion operation of folder here
		}
	});
}

$(document).ready(function() {
	//initialize global variables
	allItemsDiv = $('#allItems');

	//set modal window actions
	$("#addItemButton").on("click", function(e){
	  e.preventDefault();
	  var name = $("#itemName").val();
		var desc = $("#itemDesc").val();
		var url = $("#itemUrl").val();
	  if(addLinkItem(name, desc, url)){
			$(this).prev().click();
			$("#itemName").val('');
			$("#itemDesc").val('');
			$("#itemUrl").val('');
		}
	});
	//set modal window actions
	$("#addFolderButton").on("click", function(e){
	  e.preventDefault();
	  var name = $("#folderName").val();
		var desc = $("#folderDesc").val();
	  if(addFolderItem(name, desc)){
			$(this).prev().click();
			$("#itemName").val('');
			$("#itemDesc").val('');
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

	//call initializing function
	console.log('calling getItems()');
  getItems();

});
