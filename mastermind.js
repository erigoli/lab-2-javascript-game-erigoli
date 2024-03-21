'use strict'
const linecount = 8;
const colorlist = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];
function start() {
    for (let i = 1; i <= linecount; i++) {
        document.getElementById('line-generator').innerHTML += '<div class="line" id="line' + i + '">\n' +
            '                <span class="hole hole1"></span>\n' +
            '                <span class="hole hole2"></span>\n' +
            '                <span class="hole hole3"></span>\n' +
            '                <span class="hole hole4"></span>\n' +
            '                <div class="checker" id="checker' + i + '">\n' +
            '                    <span class="little-hole little-hole1"></span>\n' +
            '                    <span class="little-hole little-hole2"></span>\n' +
            '                    <span class="little-hole little-hole3"></span>\n' +
            '                    <span class="little-hole little-hole4"></span>\n' +
            '                </div>\n' +
            '            </div>'
    }
    const secretholes = [...document.querySelectorAll('#secret-line .hole')];
    const colorbuttons = [...document.getElementsByClassName('cb')];
    const undobuttons = document.getElementById('undoButton');
    let secretcode = [];
    for (let i = 0; i < 4; i++) {
        let randomcolor = colorlist[Math.floor(Math.random() * colorlist.length)];
        secretcode.push(randomcolor);
    }
    function dotandcheckwin(indexLine) {
        let usercolors = [];
        [...document.getElementById('line' + indexLine).getElementsByClassName('color')].forEach((c) => {
            usercolors.push([...c.classList][1]); 
        });
        let tempsecretcode = [...secretcode];
        let dotindex = 1;
        for (let i = 0; i < 4; i++) {
            if (usercolors[i] === tempsecretcode[i]) {
                document.querySelector('#line' + indexLine + ' .little-hole' + dotindex).innerHTML = '<span class="red-dot"></span>';
                tempsecretcode[i] = '';
                usercolors[i] = '';
                dotindex++;
            }
        }
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (i !== j) {             
                    if (usercolors[i] === tempsecretcode[j] && usercolors[i] !== '') {
                        document.querySelector('#line' + indexLine + ' .little-hole' + dotindex).innerHTML = '<span class="white-dot"></span>';
                        usercolors[i] = '';
                        tempsecretcode[j] = '';
                        dotindex++;

                    }
                }
            }
        }
        dotindex = 1;
        const checkholes = [...document.querySelectorAll('#checker' + lineindex + ' .little-hole span')];
        if (checkholes.length === 4) {
            for (let i = 0; i < 4; i++) {
                if (checkholes[i].className !== 'red-dot') {
                    return false;
                }
            }
        } else {
            return false;
        }
        return true;
    }
    function reveal() {
        for (let i = 0; i < 4; i++) {
            secretholes[i].innerHTML = '<div class="color ' + secretcode[i] + '">';
        }
        setTimeout(() => {
            document.location.href = './index.html';
        }, 5000);
    }
    let lineindex = 1;
    let holeindex = 1;
    document.querySelector('#line1 .hole1').classList.add('active-hole');
    function clickColorButton(c) {
        let color = c.target.id.split('-')[1];
        let hole = document.querySelector('#line' + lineindex + ' .hole' + holeindex);
        hole.classList.remove('active-hole')
        hole.innerHTML = '<div class="color ' + color + '"></div>';
        holeindex++;
        if (holeindex > 4) {
            if (lineindex !== linecount) {
                document.querySelector('#line' + (lineindex + 1) + ' .hole1').classList.add('active-hole');
            }
            let iswin = dotandcheckwin(lineindex);
            holeindex = 1;
            lineindex++;
            if (lineindex > linecount && iswin === false) {
                setTimeout(() => {
                    document.getElementById("rules").style.display = 'none';
                    document.getElementById("color-pallet").style.display = 'none';
                    document.getElementById('line-generator').innerHTML = '<h3 class="loose">You lost</h3>';
                    reveal();
                }, 1000);
            } else if (iswin === true) {
                setTimeout(() => {
                    document.getElementById("rules").style.display = 'none';
                    document.getElementById("color-pallet").style.display = 'none';
                    document.getElementById('line-generator').innerHTML = '<h3 class="win">You won</h3>';
                    reveal();
                }, 500);
            }
        } else {
            document.querySelector('#line' + lineindex + ' .hole' + holeindex).classList.add("active-hole")
        }
    }
    function undo() {
        if (holeindex !== 1) {
            let lasthole = document.querySelector('#line' + lineindex + ' .hole' + (holeindex - 1));
            lasthole.innerHTML = '';
            document.querySelector('#line' + lineindex + ' .hole' + holeindex).classList.remove('active-hole');
            holeindex--;
            document.querySelector('#line' + lineindex + ' .hole' + holeindex).classList.add('active-hole');
        }
    }
    colorbuttons.forEach((c) => {
        c.addEventListener('click', clickColorButton);
    })
    undobuttons.addEventListener('click', undo);
}
start();
