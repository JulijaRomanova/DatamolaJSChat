function allCellsTable(){
    const all = document.querySelectorAll('th');
    const allId = [];
    all.forEach((cell) => allId.push(cell.id));
    return allId;
}
let freeCells = allCellsTable();

function startAgain(){
    freeCells = allCellsTable();
    const allCells = document.querySelectorAll('th');
    allCells.forEach((cell) => cell.textContent = '');
    const line = document.querySelector('#line');
    line.classList = 'line animated';
    line.style.backgroundColor = '#febb02';
    document.querySelector('#btn').style.visibility = 'hidden';
}
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
    const line = document.querySelector('#line');
    if(t(allTh[0]) !== '' && (t(allTh[0]) === t(allTh[1]) && t(allTh[0])  === t(allTh[2]))) {
        line.classList.add('row-one');
        line.style.backgroundColor = 'green';
        return true;
    }
    if(t(allTh[3]) !== '' && (t(allTh[3]) === t(allTh[4]) && t(allTh[3]) === t(allTh[5]))) {
        line.classList.add('row-two');
        line.style.backgroundColor = 'green';
        return true;
    }
    if(t(allTh[6]) !== '' && (t(allTh[6]) === t(allTh[7]) && t(allTh[6]) === t(allTh[8]))) {
        line.classList.add('row-three');
        line.style.backgroundColor = 'green';
        return true;
    }
    if(t(allTh[0]) !== '' && (t(allTh[0]) === t(allTh[3]) && t(allTh[0]) === t(allTh[6]))) {
        line.classList.add('line-vertical');
        line.classList.add('column-one');
        line.style.backgroundColor = 'green';
        return true;
    }
    if(t(allTh[1]) !== '' && (t(allTh[1]) === t(allTh[4]) && t(allTh[1]) === t(allTh[7]))) {
        line.classList.add('line-vertical');
        line.style.backgroundColor = 'green';
        return true;
    }
    if(t(allTh[2]) !== '' && (t(allTh[2]) === t(allTh[5]) && t(allTh[2]) === t(allTh[8]))) {
        line.classList.add('line-vertical');
        line.classList.add('column-three');
        line.style.backgroundColor = 'green';
        return true;
    }
    if(t(allTh[0]) !== '' && (t(allTh[0]) === t(allTh[4]) && t(allTh[0]) === t(allTh[8]))) {
        line.classList.add('diagonal-line-left');
        line.style.backgroundColor = 'green';
        return true;
    }
    if (t(allTh[2]) !== '' && (t(allTh[2]) === t(allTh[4]) && t(allTh[2])  === t(allTh[6]))) {
        line.classList.add('diagonal-line-right');
        line.style.backgroundColor = 'green';
        return true;
    }
    return false;
}
function makeMove(event){
    if(isMakeMove(event)){
        alert('This cell is full! Find clear cell')
    } else {
        const btn = document.querySelector('#btn');
        event.target.append(cross());
        if(check()){
            btn.style.visibility = 'visible';
            alert('Congratulations, you have won!');
            return;
        }
        freeCells = freeCells.filter((id) => id !== event.target.id);
        if(freeCells.length !== 0) {
            document.getElementById(freeCells.shift()).append(zero());
        }
        if(check()){
            btn.style.visibility = 'visible';
            alert('Sorry, the computer has won');
            return;
        }
        if(freeCells.length === 0) {
            btn.style.visibility = 'visible';
            alert('Drawn game');
        }
    }

}

document.querySelector('#cross-zero').addEventListener('click', makeMove);

