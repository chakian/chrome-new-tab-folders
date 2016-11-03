var allItemsDiv;

function addItemDiv(tabItem){
	var text = tabItem.name + (tabItem.desc != null && tabItem.desc != '' ? '<br />' + tabItem.desc : '');
	var itemHtml = '';
	itemHtml += '<div class="col-md-2 itemDiv" id="itemX_'+ tabItem.id +'">';
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
	$('#itemX_' + tabItem.id + ' .close').click(function(){
		deleteItem(tabItem.id);
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
