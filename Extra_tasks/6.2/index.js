function allCells(){
    const allCells = document.querySelectorAll('th');
    const allId = [];
    allCells.forEach((cell) => allId.push(cell.id));
    return allId;
}
let freeCells = allCells();

function zero(){
    const tmpEl = document.getElementById('zero');
    return tmpEl.content.cloneNode(true);
}
function cross(){
    const tmpEl = document.getElementById('cross');
    return tmpEl.content.cloneNode(true);
}

function isMakeMove(event){
    return (event.target.children.length !== 0 || !event.target.id);
}
function t(el){
    return el.textContent;
}
function check(){
    const allTh = document.querySelectorAll('th');
    if(t(allTh[0]) !== '' && (t(allTh[0]) === t(allTh[1]) && t(allTh[0])  === t(allTh[2]))) {
        console.log(t(allTh[0]) === t(allTh[1]) === t(allTh[2]));
        return true;
    }
    if(t(allTh[3]) !== '' && (t(allTh[3]) === t(allTh[4]) && t(allTh[3]) === t(allTh[5]))) {
        console.log(t(allTh[0]) === t(allTh[1]) === t(allTh[2]));
        return true;
    }
    if(t(allTh[6]) !== '' && (t(allTh[6]) === t(allTh[7]) && t(allTh[6]) === t(allTh[8]))) return true;
    if(t(allTh[0]) !== '' && (t(allTh[0]) === t(allTh[3]) && t(allTh[0]) === t(allTh[6]))) return true;
    if(t(allTh[1]) !== '' && (t(allTh[1]) === t(allTh[4]) && t(allTh[1]) === t(allTh[7]))) return true;
    if(t(allTh[2]) !== '' && (t(allTh[2]) === t(allTh[5]) && t(allTh[2]) === t(allTh[8]))) return true;
    if(t(allTh[0]) !== '' && (t(allTh[0]) === t(allTh[4]) && t(allTh[0]) === t(allTh[8]))) return true;
    return (t(allTh[2]) !== '' && (t(allTh[2]) === t(allTh[4]) && t(allTh[2])  === t(allTh[6])));
}
function makeMove(event){
    if(isMakeMove(event)){
        alert('This cell is full! Find clear cell')
    } else {
        event.target.append(cross());
        freeCells = freeCells.filter((id) => id !== event.target.id);
        if(freeCells.length !== 0) {
            document.getElementById(freeCells.shift()).append(zero());
            if(check()){
                alert('Win');
            }
        } else {
            alert('Game over!')
        }
    }

}


document.querySelector('#cross-zero').addEventListener('click', makeMove);
