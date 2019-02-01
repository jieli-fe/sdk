/**
 *
 * 基于jquery 的弹窗驱动程序
 *
 * @param {*} dragBar
 * @param {*} moveWindow
 */
function PoupWindowMove(dragBar, moveWindow) {
    var isMove = false;
    dragBar.unbind().mousedown(
        function (event) {
            var isMove = true;
            var abs_x = event.pageX - moveWindow.offset().left;
            var abs_y = event.pageY - moveWindow.offset().top;
            $(document).mousemove(function (event) {
                if (isMove) {
                    var obj = moveWindow;
                    var topValue = (event.pageY - abs_y);
                    if (parseInt(topValue) < 80) topValue = 80;
                    obj.css({
                        'left': event.pageX - abs_x,
                        'top': topValue
                    });
                }
            }).mouseup(function () {
                isMove = false;
            });
        }).mouseup(function () {
        isMove = false;
    });
}
export {
    PoupWindowMove
}