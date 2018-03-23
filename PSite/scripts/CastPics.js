window.onload = function() {
    var container = document.getElementById('container');
    var list = document.getElementById('list');
    var buttons = document.getElementById('buttons').getElementsByTagName('span');
    var prev = document.getElementById('prev');
    var next = document.getElementById('next');
    var index = 1;
    var timer;
    var width=window.screen.width;

    function animate(offset) {

        var newLeft = parseInt(list.style.left) + offset;
        list.style.left = newLeft + 'px';

        if (newLeft > (-1)*width) {
            list.style.left =(-5)*width + 'px';
        }
        if (newLeft < (-5)*width) {
            list.style.left = (-1)*width + 'px';
        }
    }

    function play() {
        //重复执行的定时器
        timer = setInterval(function() {
            next.onclick();
        }, 2000)
    }

    function stop() {
        clearInterval(timer);
    }

    function buttonsShow() {
        //将之前的小圆点的样式清除
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].className == "on") {
                buttons[i].className = "";
            }
        }
        //数组从0开始，故index需要-1
        buttons[index - 1].className = "on";
    }

    prev.onclick = function() {
        index -= 1;
        if (index < 1) {
            index = 5
        }
        buttonsShow();
        animate(width);
    };

    next.onclick = function() {
        //由于上边定时器的作用，index会一直递增下去，我们只有5个小圆点，所以需要做出判断
        index += 1;
        if (index > 5) {
            index = 1
        }
        animate((-1)*width);
        buttonsShow();
    };

    for (var i = 0; i < buttons.length; i++) {
        (function(i) {
            buttons[i].onclick = function() {
                var clickIndex = parseInt(this.getAttribute('index'));
                var offset = width* (index - clickIndex); //这个index是当前图片停留时的index
                animate(offset);
                index = clickIndex;
                buttonsShow();
            }
        })(i)
    }

    container.onmouseover = stop;
    container.onmouseout = play;
    play();

}