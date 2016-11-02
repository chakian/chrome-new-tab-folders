function quickSort(items, lo, hi){
	var pivot;
	if(lo < hi){
		pivot = sortPartition(items, lo, hi);
		quickSort(items, lo, pivot);
		quickSort(items, pivot + 1, hi);
	}
}

function sortPartition(items, lo, hi){
	var pivot = items[lo].order;
	var i = lo - 1;
	var j = hi + 1;

	while(true){
		do{
			i = i + 1;
		} while(items[i].order < pivot);

		do{
			j = j - 1;
		} while(items[j].order > pivot);

		if(i >= j){
			return j;
		}

		//swap items
		var temp = items[i];
		items[i] = items[j];
		items[j] = temp;
	}
}
