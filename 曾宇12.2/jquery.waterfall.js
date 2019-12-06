(function($){
	$.fn.waterfall = function(){
		var container = this;//this就是调用插件的那个jquery实例对象
		var column = 5;
		var items = container.children();//所有的瀑布流容器内的元素
		var totalWidth = container.width();//总宽度
		var width = items.width();//每一个元素的宽度
		var space = (totalWidth-width*column)/(column-1);//水平间隙
		//需要与一个数组记录列高
		var heightArr = [];
		items.each(function(index,item){
			//item是DOM元素
			if(index<column){
				//定位第一行元素
				$(item).css({top:0,left:index*(width+space)})
				heightArr[index]=$(item).height();
				// console.log(heightArr)
			}else{
				//从索引为column开始的item都需要定位在最短的那一列的下面
				var minIndex = 0;
				var min = heightArr[minIndex];
				// for(var i=0;i<heightArr.length;i++){
				// 	if(heightArr[i]<min){
				// 		min = heightArr[i];
				// 		minIndex = i
				// 	}
				// }
				$.each(heightArr,function(index,value){
					if(value<min){
						min = value;
						minIndex = index;
					}
				})
				//定位当前元素
				$(item).css({left:minIndex*(width+space),top:min+10})
				//更新当前列的列高
				heightArr[minIndex] = heightArr[minIndex] + 10 + $(item).height()
			}
		});


		//该container一个高度
		var max = Math.max.apply(null,heightArr);
		container.height(max);
	}
})(jQuery)