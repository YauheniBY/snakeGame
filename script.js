const fildsNet = {
    width: 15,
    height: 15
};
const elementSize = 30;

const fild = document.getElementById('fild');
const $score = document.getElementById('score');

fild.style.width = `${fildsNet.width * elementSize}px`;
fild.style.height = `${fildsNet.height * elementSize}px`;

// заполняем поле элементами

let amountElems = 0;

while (amountElems < (fildsNet.width * fildsNet.height)) {

    let newElem = renderNewElem ();
    fild.appendChild(newElem);
    amountElems++;    
}

// собираем все элементы поля

let allElems = document.querySelectorAll('div.game__item');

for ( let i = 1; i <= allElems.length; i++) {

    let xPosition = (i % fildsNet.width) ? (i % fildsNet.width) : fildsNet.width;

    allElems[ i - 1 ].dataset.xPosition = `${ xPosition - 1 }`;
    allElems[ i - 1 ].dataset.yPosition = `${ (i - xPosition) / fildsNet.width }`;

}

// устанавливаем стартовую позицию

let currentPosition = randomPosition(fildsNet.width, fildsNet.height);

let bodySnake = [];

let score = 0;


// добавляем в тело нашей змейки

bodySnake.push(currentPosition);

// отрисовываем

drowSnake(bodySnake);

// рисуем еду

let food = appearFood (bodySnake);

// задаём управление

let movingDirection = '';

document.addEventListener('keydown', (e) => {
    if(e.keyCode == '38' && movingDirection != 'down') {
        movingDirection = 'top';
    } else  if(e.keyCode == '40' && movingDirection != 'top') {
        movingDirection = 'down';
    } else  if(e.keyCode == '39' && movingDirection != 'left') {
        movingDirection = 'right';
    } else  if(e.keyCode == '37' && movingDirection != 'right') {
        movingDirection = 'left';
    };
});

// задаём рандомное направление для старта

movingDirection = startMoving (bodySnake);

// запускаем движение

startGame ();


function startGame () {

    let gamePlay = setInterval( moveSnake, 200);




//движение змейки 

    function moveSnake() {
        let restart = false;

        let nextPosition = createNextPosition ();

        memorizeBodySnake (nextPosition);

        makeSnakesBody ();

        if (score > 2){
            for ( let i = 0; i < bodySnake.length - 1; i++){

                if (bodySnake[i].x === bodySnake[score].x && bodySnake[i].y === bodySnake[score].y) {
                    clearInterval(gamePlay);
                    restart = true;
                }
            }
           
        } 

        if( !restart ) {
            drowSnake(bodySnake);
        } else {

            if(confirm ('хотите сыграть еще раз?')) {
                currentPosition = randomPosition(fildsNet.width, fildsNet.height);
                bodySnake = [];
                score = 0;
                $score.innerText = `Score: ${score}`;
                bodySnake.push(currentPosition); 
                food = appearFood (bodySnake);
                drowSnake(bodySnake);
                startGame ();
            } else alert('Game over');
        }    
        
    }
}






//  создаём новую позицию
 function createNextPosition () {

    let nextPosition = {x: bodySnake[bodySnake.length - 1].x, y: bodySnake[bodySnake.length - 1].y };

    switch (movingDirection) {
        case 'top':

            if(nextPosition.y > 0){
                nextPosition.y = nextPosition.y - 1;
            } else {
                nextPosition.y = fildsNet.height - 1; 
            };
            break;
        case 'down':
            if(nextPosition.y < fildsNet.height - 1) {
                nextPosition.y = nextPosition.y + 1;
            } else {
                nextPosition.y = 0;
            }
            
            break;
        case 'left':
            if(nextPosition.x > 0) {
                nextPosition.x = nextPosition.x - 1;
            } else {
                nextPosition.x = fildsNet.width - 1;
            }
            
            break;
        case 'right':
            if(nextPosition.x < fildsNet.width - 1) {
                nextPosition.x = nextPosition.x + 1;
            } else {
                nextPosition.x = 0;
            }
            
            break;
        default:
            console.log('Ошибка создания новой позиции');
    }
    return nextPosition;
 }

// чистим память и стили активного элемента

function clearAll () {

    for (let elem of allElems) {
        elem.classList.remove('game__item_active'); 
    }
    
    while (bodySnake.length > 0) {
        bodySnake.pop();
    }

    return true;
}


// формируем тело змейки

function makeSnakesBody () {
    while (score < bodySnake.length - 1) {
        bodySnake.shift();
    }
}

// генерим коотдинаты стартовой точки

function randomPosition (lengthX, lengthY) { 
    return {
        x: Math.floor(Math.random() * lengthX), 
        y: Math.floor(Math.random() * lengthY)
    };    
}



// функция рандомного направлениястарта движения

function startMoving (bodySnake) {

    let direction = ['top', 'left', 'down', 'right'];

    return direction[(Math.floor( Math.random() * direction.length ))];
}


// 


function  drowSnake ( bodySnake) {


    for (let elem of allElems) {
        elem.classList.remove('game__item_active');
        elem.classList.remove('game__item_active-head');


        if ( ( +(elem.dataset.xPosition )) === bodySnake[score].x &&  (+(elem.dataset.yPosition )) === bodySnake[score].y ) {

            elem.classList.add('game__item_active-head');
            
            if (elem.classList.contains('game__item_food')) {
                elem.classList.remove('game__item_food');
                food = appearFood (bodySnake);
            }

        } else{

            for( let el in bodySnake) {
                if(bodySnake[el].x === ( +(elem.dataset.xPosition )) && bodySnake[el].y === ( +(elem.dataset.yPosition ))){
                    elem.classList.add('game__item_active');
                } 
            }             
        }
    }
}

// создаём еду для змеи 
function appearFood (bodySnake){

   
    let finish = false;
    let food = {};

    do {

        food = randomPosition(fildsNet.width, fildsNet.height);

        for (let elem of bodySnake) {

            if(bodySnake.includes(food)) {
                finish = false;
            } else {
                finish = true;
            }
        }

    } while (!finish);


    for( let el of allElems) {

        el.classList.remove('game__item_food');

        if  ( (+(el.dataset.xPosition )) === food.x &&  (+(el.dataset.yPosition )) === food.y ) {

            el.classList.add('game__item_food');

        }
    }
 return food;    
}

// запоминаем ходы в массив bodySnake

function memorizeBodySnake (nextPosition) {

    bodySnake.push(nextPosition);

    if (bodySnake[bodySnake.length - 1].x === food.x && bodySnake[bodySnake.length - 1].y === food.y ){
        score++;
        $score.innerText = `Score: ${score}`;
    }

};

// функция создаёт flex-элементы с нужными размерами

function renderNewElem () {

    let newElem = document.createElement('div');

    newElem.classList.add('game__item');
    fild.appendChild(newElem);

    // const rightWidth = 100 / Number(fildsNet.width);
          newElem.style.width = `${elementSize - 10}px`;

    // const rightHeight = 100 / Number(fildsNet.height);
          newElem.style.height = `${elementSize - 10}px`;

    return newElem;

}