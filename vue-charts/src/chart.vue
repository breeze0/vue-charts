<template>
	<div id="chart">
		<canvas id="myCanvas" width="600" height="400" style="border:1px solid #000;">
		</canvas>
		<button @click="getBrokenLine(dataArray)">绘制折线图</button>
	</div>
</template>

<script type="text/javascript">
	export default {
		mounted() {
			this.cv = document.getElementById('myCanvas');
			this.canvasInstance = this.cv.getContext('2d');
			this.x0 = this.padding;//原点x坐标
			this.y0 = this.cv.height - this.padding;//原点y坐标
			this.yArrow_x = this.padding;//y箭头X坐标
			this.yArrow_y = this.padding;//y箭头y坐标
			this.xArrow_x = this.cv.width - this.padding;//x箭头x坐标
			this.xArrow_y = this.cv.height - this.padding;//x箭头y坐标
			this.xLength = this.cv.width - 2*this.padding - this.arrowWidth;//x轴length
			this.yLength = this.cv.height - 2*this.padding - this.arrowWidth;//y轴length
			this.pointWidth = this.xLength/(this.dataArray.length + 1);//x轴每点间距
			this.maxNum = this.getMaxdataNum(this.dataArray);
			this.ycount = this.getYPixel(this.maxNum,this.yLength).ycount;
			this.Pixel = this.getYPixel(this.maxNum,this.yLength).pixel;
		},

		data() {
			return {
				dataArray:[	{x:"周一",y:"3"},
							{x:"周二",y:"12"},
							{x:"周三",y:"70"},
							{x:"周四",y:"80"},
							{x:"周五",y:"40"},
							{x:"周六",y:"20"},
							{x:"周日",y:"50"},
							{x:"周末",y:"30"}
						],
				cv:null,
				canvasInstance:null,
				padding: 20,
				x0: 0,
				y0: 0,
				yArrow_x: 0,
				yArrow_y: 10,
				xArrow_x: 0,
				xArrow_y: 0,
				arrowWidth: 10,
				xLength: 0,
				yLength: 0,
				pointWidth: 0,
				dataNum:[],
				maxNum: 0,
				ycount: 0,
				Pixel: 0

			}
		},

		methods:{
			getBrokenLine: function(dataArray) {
				//x-axis
				this.canvasInstance.moveTo(this.x0,this.y0);
				this.canvasInstance.lineTo(this.xArrow_x,this.xArrow_y);
				this.canvasInstance.moveTo(this.xArrow_x,this.xArrow_y);
				this.canvasInstance.lineTo(this.xArrow_x - this.arrowWidth,this.xArrow_y - this.arrowWidth);
				this.canvasInstance.moveTo(this.xArrow_x,this.xArrow_y);
				this.canvasInstance.lineTo(this.xArrow_x - this.arrowWidth,this.xArrow_y + this.arrowWidth);
				//y-axis
				this.canvasInstance.moveTo(this.x0,this.y0);
				this.canvasInstance.lineTo(this.yArrow_x,this.yArrow_y);
				this.canvasInstance.moveTo(this.yArrow_x,this.yArrow_y);
				this.canvasInstance.lineTo(this.yArrow_x - this.arrowWidth,this.yArrow_y + this.arrowWidth);
				this.canvasInstance.moveTo(this.yArrow_x,this.yArrow_y);		
				this.canvasInstance.lineTo(this.yArrow_x + this.arrowWidth,this.yArrow_y + this.arrowWidth);
				this.canvasInstance.strokeStyle = "#000";
				this.canvasInstance.stroke();
				this.canvasInstance.beginPath();
				this.getBglineY();
				this.canvasInstance.beginPath();
				this.getBglineX();
				//绘制X轴数据
				this.getXaxis();
				this.x0 = this.padding;//重置x0
				//绘制Y轴数据
				this.getYaxis();
				this.y0 = this.cv.height - this.padding;//重置y0
				this.getArc();//描点
				//绘制broken line
				this.canvasInstance.beginPath();//中断坐标轴和折线的连接
				for (var i = 0;i < this.dataArray.length; i++ ) {
					var pointX = this.padding + (i + 1)*this.pointWidth;
					var pointY = this.getCoordY(this.Pixel,this.dataArray[i].y)
					this.canvasInstance.lineTo(pointX,pointY); 
				}
				this.canvasInstance.strokeStyle='red';
				this.canvasInstance.stroke();
				this.canvasInstance.beginPath();
			},
			getMaxdataNum: function(dataArray) {
				for (var i = 0;i < this.dataArray.length;i++) {
					this.dataNum.push(this.dataArray[i].y);
				}
				return Math.max.apply(null,this.dataNum);
			},
			getXaxis: function() {
				for (var i = 0;i < this.dataArray.length ;i++) {
					this.canvasInstance.textAlign = "center";
					this.canvasInstance.fillText(this.dataArray[i].x,this.x0 +  this.pointWidth,this.y0 + this.padding);
					this.x0 = this.x0 + this.pointWidth;
				}
			},
			getYaxis: function() { 
				for (var i = 0;i < this.ycount/10; i++) {
					this.canvasInstance.textAlign = "right";//内容靠右
					this.canvasInstance.textBaseline = "middle";//调整文字中心线
					this.canvasInstance.fillText(i * 10 ,this.padding,this.padding + this.arrowWidth + (this.ycount/10 - i)*10*this.Pixel);
				}
			},
			getYPixel: function(maxNum,yLength) {
				var ycount = (parseInt(maxNum/10) + 1)*10 + 10;
				return {pixel:yLength/ycount,ycount:ycount};
			},//y轴的单位长度
			getCoordY: function(yPixel,value) {
				var y = yPixel * value;
				return this.y0 -y
			},//相应数据点的y坐标
			getArc: function() {
				for (var i = 0;i < this.dataArray.length;i++) {
					var x = this.padding + (i + 1)*this.pointWidth;
					var y = this.getCoordY(this.Pixel,this.dataArray[i].y);
					this.canvasInstance.moveTo(x,y);
					this.canvasInstance.arc(x,y,3,0,Math.PI*2);
					this.canvasInstance.fill();
				}
			},
			getBglineY: function() {
				this.canvasInstance.lineWidth = 1;
				this.canvasInstance.strokeStyle = "#e8e8e8";
				for (var i=1;i<this.ycount/10;i++) {
					var y =this.padding + this.arrowWidth +  (this.ycount/10-i)*10*this.Pixel;
					this.canvasInstance.moveTo(this.x0,y);
					this.canvasInstance.lineTo(this.xArrow_x,y);
					this.canvasInstance.stroke();
				}
			},
			getBglineX: function() {
				this.canvasInstance.lineWidth = 1;
				this.canvasInstance.strokeStyle = "#e8e8e8";
				for (var i=1;i<this.dataArray.length+1;i++) {
					var x = this.padding + this.pointWidth * i;
					this.canvasInstance.moveTo(x,this.y0);
					this.canvasInstance.lineTo(x,this.yArrow_y);
					this.canvasInstance.stroke();
				}
			}
	 	}
	}
</script>