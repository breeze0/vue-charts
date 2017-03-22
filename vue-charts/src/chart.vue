<template>
  <div id="chart">
    <canvas id="myCanvas" width="600" height="400" style="border:1px solid #000;"
      v-on:mousemove="pointHover">
    </canvas>
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
      this.pointWidth = this.xLength/(this.dataArray[0].length + 1);//x轴每点间距
      this.getCoordinate(this.dataArray[0]);
      this.getBrokenLine(this.dataArray[1]);
      this.getBrokenLine(this.dataArray[0]);
    },
    data() {
      return {
        dataArray:[ [{x:"周一",y:"33"},
                  {x:"周二",y:"43"},
                  {x:"周三",y:"32"},
                  {x:"周四",y:"62"},
                  {x:"周五",y:"52"},
                  {x:"周六",y:"25"},
                  {x:"周日",y:"32"}],
              [{x:"周一",y:"13"},
                  {x:"周二",y:"23"},
                  {x:"周三",y:"12"},
                  {x:"周四",y:"22"},
                  {x:"周五",y:"12"},
                  {x:"周六",y:"15"},
                  {x:"周日",y:"22"}]
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
        minNum:0,
        ycount: 0,
        Pixel: 0,
        space:0

      }
    },

    methods:{
      getCoordinate: function(array) {
        //this.color = color;
        this.maxNum = this.getMaxdataNum(array);
        this.minNum = this.getMindataNum();
        this.space = this.round((this.maxNum-this.minNum)/5,-1);
        this.ycount = this.dataProcess().ycount;
        this.Pixel = this.dataProcess().pixel;
        this.canvasInstance.beginPath();
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
        this.getBglineX(array);
        //绘制X轴数据
        this.getXaxis(array);
        this.x0 = this.padding;//重置x0
        //绘制Y轴数据
        this.getYaxis();
        this.y0 = this.cv.height - this.padding;//重置y0
      },
      getBrokenLine: function(array,color) {
        //绘制broken line
        this.canvasInstance.beginPath();
        for (var i = 0;i < array.length; i++ ) {
          var pointX = this.padding + (i + 1)*this.pointWidth;
          var pointY = this.getCoordY(this.Pixel,array[i].y);
          this.canvasInstance.lineTo(pointX,pointY);
        }
        this.canvasInstance.strokeStyle= "red";
        this.canvasInstance.stroke();
        this.getArc(array);//描点
      },
      getMaxdataNum: function(array) {
        for (var i = 0;i < array.length;i++) {
          this.dataNum.push(array[i].y);
        }
        return Math.max.apply(null,this.dataNum);
      },
      getMindataNum: function() {
        return Math.min.apply(null,this.dataNum);
      },
      getXaxis: function(array) {
        for (var i = 0;i < array.length ;i++) {
          this.canvasInstance.textAlign = "center";
          this.canvasInstance.fillStyle = "#000";
          this.canvasInstance.fillText(array[i].x,this.x0 +  this.pointWidth*(i+1),this.y0 + 15);
        }
      },
      getYaxis: function() {
        for (var i = 0;i < this.ycount/this.space; i++) {
          //this.canvasInstance.textAlign = "right";//内容靠右
          this.canvasInstance.textBaseline = "middle";//调整文字中心线
          this.canvasInstance.fillStyle = "#000";
          this.canvasInstance.fillText(i * this.space ,this.padding-10,this.padding + this.arrowWidth + (this.ycount/this.space - i)*this.space*this.Pixel);
        }
      },
      getCoordY: function(ypixel,value) {
        var y = ypixel * value;
        return this.y0 -y
      },//相应数据点的y坐标
      getArc: function(array) {
        for (var i = 0;i < array.length;i++) {
          var x = this.padding + (i + 1)*this.pointWidth;
          var y = this.getCoordY(this.Pixel,array[i].y);
          this.canvasInstance.beginPath();
          this.canvasInstance.fillStyle="red";
          this.canvasInstance.strokeStyle="#e8e8e8"
          this.canvasInstance.arc(x,y,5,0,Math.PI*2);
          this.canvasInstance.stroke();
          this.canvasInstance.fill();
        }
      },
      getBglineY: function() {
        this.canvasInstance.lineWidth = 1;
        this.canvasInstance.strokeStyle = "#e8e8e8";
        for (var i=1;i<this.ycount/this.space;i++) {
          var y =this.padding + this.arrowWidth +  (this.ycount/this.space-i)*this.space*this.Pixel;
          this.canvasInstance.moveTo(this.x0,y);
          this.canvasInstance.lineTo(this.xArrow_x,y);
          this.canvasInstance.stroke();
        }
      },
      getBglineX: function(array) {
        this.canvasInstance.lineWidth = 1;
        this.canvasInstance.strokeStyle = "#e8e8e8";
        for (var i=1;i<array.length+1;i++) {
          var x = this.padding + this.pointWidth * i;
          this.canvasInstance.moveTo(x,this.y0);
          this.canvasInstance.lineTo(x,this.yArrow_y);
          this.canvasInstance.stroke();
        }
      },
      pointHover: function(event) {
        var mousePos = this.getMousePos(event);
        var pagex = mousePos.x;
        var pagey = mousePos.y;
        for(var j = 0;j<this.dataArray.length;j++) {
          for(var i=0;i<this.dataArray[j].length;i++) {
            var x = this.padding + (i + 1)*this.pointWidth;
            var y = this.getCoordY(this.Pixel,this.dataArray[j][i].y);
            if(pagex > x-5 && pagex <x+5 && pagey >y-5 && pagey <y+5) {
              this.canvasInstance.beginPath();
              this.canvasInstance.textAlign = "center";
              this.canvasInstance.fillStyle = "#000"
              this.canvasInstance.font = "italic small-caps bold 12px arial";
              this.canvasInstance.fillText(this.dataArray[1][i].y,x,y-15);
              this.canvasInstance.beginPath();
              this.canvasInstance.fillStyle="#000";
              this.canvasInstance.strokeStyle="#e8e8e8"
              this.canvasInstance.arc(x,y,5,0,Math.PI*2);
              this.canvasInstance.stroke();
              this.canvasInstance.fill();
              return;
            } else {
              this.canvasInstance.clearRect(0,0,this.cv.width,this.cv.height);
              this.cv.width = this.cv.width;//重置画布宽度，防止偏移
              this.getCoordinate(this.dataArray[0]);
              this.getBrokenLine(this.dataArray[1]);
              this.getBrokenLine(this.dataArray[0]);
            }
          }
        }
      },
      getMousePos: function(event) {
        var rect = this.cv.getBoundingClientRect();
        return {
              x: event.clientX - rect.left * (this.cv.width / rect.width),
              y: event.clientY - rect.top * (this.cv.height / rect.height)
          }
      },
      dataProcess: function() {
        var ymax = (Math.ceil(this.maxNum/this.space))*this.space + this.space;
        return {pixel:this.yLength/ymax,ycount:ymax};
      },//单位像素和y轴最大值
      round: function(v,e) {
        var t=1;
        for(;e<0;t/=10,e++);
        return Math.round(v*t)/t;
      }//对指定位四舍五入
    }
  }
</script>
