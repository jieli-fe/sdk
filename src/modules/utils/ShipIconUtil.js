 L.Icon.Canvas = L.Icon.extend({
     options: {
         iconSize: [32, 32], // 默认值，必须有
         iconAnchor: [16, 16],
         shadowSize: [0, 0],
         className: 'leaflet-canvas-icon',
         isFleetIcon: true
     },
     /****可将canvas替换成html图标，参考leaflet源代码****/
     createIcon: function () {
         var e = document.createElement('canvas');
         this._setIconStyles(e, 'icon');
         var s = this.options.iconSize;
         var customOption = this.options;
         e.width = 30;
         e.height = 30;
         this.drawShips(e.getContext('2d'), s.x, s.y, customOption);
         return e;
     },
     createShadow: function () {
         return null;
     },
     /**
      *ctx canvas画布对象,customoptions 用户传的值
      *customoptions:各种参数，经纬度，heading等等值用来画船舶图标
      *
      */
     drawShips: function (ctx, w, h, customoptions) {
         /***
          * 08b012     ea1600     00d28e    eab21a    2cd9dc    2255d1    d021c5     c3e41b     f10e64      fd711d
          *從左到有依次对应不同的颜色，船舶分组的图标
          **/
         var isFleetIcon = customoptions.isFleetIcon;
         if (isFleetIcon) {
             var colorInt = this.colorvalue[customoptions.color];
             var basevalue = 0;
             var statuvalue = 0;
             var _globlaImage = document.getElementById("shipiconimage");;
             if (colorInt) basevalue = 30 * colorInt;
             if (customoptions.stop) statuvalue = 30;
             ctx.save();
             ctx.drawImage(_globlaImage, basevalue, statuvalue, 30, 30, 0, 0, 30, 30);
             ctx.restore();
         } else {
             var _globlaImage = document.getElementById("shipsearchicononair");
             if (customoptions.stop) _globlaImage = document.getElementById("shipsearchiconstop");;
             ctx.save();
             ctx.drawImage(_globlaImage, 0, 0, 30, 30, 0, 0, 30, 30);
             ctx.restore();
         }

     },
     colorvalue: {
         "08b012": 0,
         "ea1600": 1,
         "00d28e": 2,
         "eab21a": 3,
         "2cd9dc": 4,
         "2255d1": 5,
         "d021c5": 6,
         "c3e41b": 7,
         "f10e64": 8,
         "fd711d": 9
     }
 });

 export var shipIcon = function (options) {
     return new L.Icon.Canvas(options);
 }