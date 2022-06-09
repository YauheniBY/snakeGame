const GAME_STATUS_STARTED = 'started';
const GAME_STATUS_PAUSED = 'paused';
const GAME_STATUS_STOPED = 'stoped';

const SNAKE_DIRECTION_UP = 'up';
const SNAKE_DIRECTION_DOWN = 'down';
const SNAKE_DIRECTION_LEFT = 'left';
const SNAKE_DIRECTION_RIGHT = 'right';

const config = {

    size: 30,

    snakeLenghtOnStart: 3,

    fildsNet: {
        width: 15,
        height: 15
    }
    

};

const score = {
    value: 0,

    getElement () {
        return document.getElementById('score');
    },
    setValue () {
        this.value = snake.body.length - config.snakeLenghtOnStart;
    },
    setScoreStatus(status) {
        const element = score.getElement();
        element.classList.remove(GAME_STATUS_PAUSED, GAME_STATUS_STARTED, GAME_STATUS_STOPED);
        element.classList.add(status);
    },
    render() {
        this.getElement().innerText = `Score: ${this.value}`;
    }
}

const game = {

    timer: {
        gamesTimer: null,
        interval: 300
    },

    getElement () {

        return document.getElementById('game');
    },

    start () {


        if(game.getGameStatus() != GAME_STATUS_STARTED ){

            

            if(game.getGameStatus() != GAME_STATUS_PAUSED ){
                
            board.render();
            snake.generateDirection();
            snake.generateBody();
            snake.render();
            food.generateItem ();
            food.render();
            score.render();

            } 
            
            game.setGameStatus(GAME_STATUS_STARTED);
            score.setScoreStatus(GAME_STATUS_STARTED);
            


            game.timer.gamesTimer = setInterval( ()=>{   

            

                game.renderNextPicture ();
                
            if( game.getGameStatus() != GAME_STATUS_STOPED){
                score.render();
            }

            } , game.timer.interval);   

        }
             
        
    },

    pause () {

        if(game.getGameStatus() != GAME_STATUS_STOPED ){
            game.setGameStatus(GAME_STATUS_PAUSED);
            clearInterval(game.timer.gamesTimer);
            
            score.setScoreStatus(GAME_STATUS_PAUSED);
        }
        
    },

    stop () {  
        game.setGameStatus(GAME_STATUS_STOPED);
        clearInterval(game.timer.gamesTimer);
        food.clearItems();
        score.value = 0;
        score.setScoreStatus(GAME_STATUS_STOPED);
    },

    move (event)  {

        let direction = '';
            if(event.keyCode == '38' && snake.direction != SNAKE_DIRECTION_DOWN) {
                direction = SNAKE_DIRECTION_UP;
            } else  if(event.keyCode == '40' && snake.direction != SNAKE_DIRECTION_UP) {
                direction = 'down';
            } else  if(event.keyCode == '39' && snake.direction != SNAKE_DIRECTION_LEFT) {
                direction = SNAKE_DIRECTION_RIGHT;
            } else  if(event.keyCode == '37' && snake.direction != SNAKE_DIRECTION_RIGHT) {
                direction = SNAKE_DIRECTION_LEFT;
            } else direction = snake.direction;

            const potentialPosition = snake.getNextPosition(direction);
            if(!(potentialPosition.top === snake.body[snake.body.length - 2].top &&
                potentialPosition.left === snake.body[snake.body.length - 2].left)) {                   
                    snake.setDirection( direction );

            }

            

        

    },

    renderNextPicture (){

        const nextPosition = snake.getNextPosition();

            const foundFood = food.foundPosition(nextPosition);

            if (foundFood !== -1 ) {
                snake.setPosition ( nextPosition, false);
                food.removeItem ( foundFood );
                food.generateItem ();
                food.render();

            } else {
                snake.setPosition ( nextPosition );
            }

            snake.render(); 

    },

    setGameStatus(status) {
        const element = game.getElement();
        element.classList.remove(GAME_STATUS_PAUSED, GAME_STATUS_STARTED, GAME_STATUS_STOPED);
        element.classList.add(status);
    },

    getGameStatus () {

        const arrOfStatus = [GAME_STATUS_PAUSED, GAME_STATUS_STARTED, GAME_STATUS_STOPED];
        for(let status of arrOfStatus) {
            if (game.getElement().classList.contains(status)) {
                return status;
            }
        };

        return false;
    }

}


const board = {

    getElement () {
        return document.getElementById('board');
    },

    render () {
        const board = this.getElement();

        board.style.width = `${config.fildsNet.width * config.size}px`;
        board.style.height = `${config.fildsNet.height * config.size}px`;

     // заполняем поле элементами

     if(cells.getElements().length === 0){

        let amountElems = 0;

        while (amountElems < (config.fildsNet.width * config.fildsNet.height)) {

            let newElem = document.createElement('div');
            newElem.classList.add('cell');        
            newElem.style.width = `${config.size - 10}px`;
            newElem.style.height = `${config.size - 10}px`;
            board.appendChild(newElem);
            amountElems++;    
        }
        
        cells.addCooordinates();

     }

        

    }

}


const cells = {

    getElements () {
        return document.querySelectorAll('.cell');
    },
    addCooordinates () {

        // собираем все элементы поля

        let allElems = this. getElements();

        for ( let i = 1; i <= allElems.length; i++) {

            let left = (i % config.fildsNet.width) ? (i % config.fildsNet.width) : config.fildsNet.width;

            allElems[ i - 1 ].dataset.left = `${ left - 1 }`;
            allElems[ i - 1 ].dataset.top = `${ (i - left) / config.fildsNet.width }`;

        }

    },

    renderItems (coordinates, classForItem) {

        // собираем все элементы поля

        let allElems = this. getElements();

        // удаляем нужные классы

        allElems.forEach( (elem) => {
            elem.classList.remove(classForItem);            
        });

        // добавляем нужные классы в соответствующие элементу координаты

        for( let coordinate of coordinates) {
                const cell = document.querySelector(`.cell[data-top="${coordinate.top}"][data-left="${coordinate.left}"]`);
            cell.classList.add(classForItem);
        }

    }
};

const snake = {

    direction: SNAKE_DIRECTION_RIGHT,

    body: [],

    generateDirection () {
        const directions = [SNAKE_DIRECTION_RIGHT, SNAKE_DIRECTION_LEFT, SNAKE_DIRECTION_UP, SNAKE_DIRECTION_DOWN];
        snake.direction = directions[ getRandomNumber (0, directions.length - 1) ];
    },
    generateBody () {

        snake.body = [{top: getRandomNumber (0, config.fildsNet.height - 1), left: getRandomNumber (0, config.fildsNet.width - 1)}];    

        while( snake.body.length < config.snakeLenghtOnStart){

            snake.setPosition(snake.getNextPosition(), false);
        }
        
        
    },

    foundPosition ( inspectingElement ) {
        const compareFunction = function (item) {
            return item.top === inspectingElement.top && item.left === inspectingElement.left;
        };
        return snake.body.findIndex(compareFunction);
    },

    setDirection (direction) { 

        this.direction = direction;
    },

    getNextPosition (direction = this.direction) {

        let nextPosition = { ...this.body[ this.body.length - 1 ] };

        switch (direction) {
            case SNAKE_DIRECTION_UP:

                if(nextPosition.top > 0){
                    nextPosition.top -= 1;
                } else {
                    nextPosition.top = config.fildsNet.height - 1; 
                };
                break;
            case SNAKE_DIRECTION_DOWN:
                if(nextPosition.top < config.fildsNet.height - 1) {
                    nextPosition.top += + 1;
                } else {
                    nextPosition.top = 0;
                }
                
                break;
            case SNAKE_DIRECTION_LEFT:
                if(nextPosition.left > 0) {
                    nextPosition.left -= 1;
                } else {
                    nextPosition.left = config.fildsNet.width - 1;
                }
                
                break;
            case SNAKE_DIRECTION_RIGHT:
                if(nextPosition.left < config.fildsNet.width - 1) {
                    nextPosition.left += 1;
                } else {
                    nextPosition.left = 0;
                }
                
                break;
            default:
                console.log('Ошибка создания новой позиции');
        }
        return nextPosition;

    },

    setPosition (position, shift = true) {

        if(shift) {
            this.body.shift();            
        }

        if(snake.foundPosition(position) != -1) {
            game.stop();
        }

        this.body.push(position);

    },
    render () {
        cells.renderItems( snake.body, 'snake' );
        const snakeHead = [snake.body[snake.body.length - 1]]
        cells.renderItems( snakeHead, 'snake_head' );
    }
};

const food = {
    items: [],

    foundPosition (snakePosition) {
        const compareFunction = function (item) {
            return item.top === snakePosition.top && item.left === snakePosition.left;
        };
        return food.items.findIndex(compareFunction);
    },

    removeItem (foundFood) {
        this.items.shift();
        score.setValue();       
    },

    clearItems() {
        this.items = [];
    },

    generateItem () {

        let newItem = {};

        do{
            newItem = {
                top: getRandomNumber(0, config.fildsNet.height - 1),
                left: getRandomNumber(0, config.fildsNet.width - 1)
            }   

        } while(snake.foundPosition(newItem) != -1);             

        this.items.push(newItem);
    },

    render() {
        cells.renderItems( food.items, 'food')
    }
};


function init () {
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const stopButton = document.getElementById('stop');

    startButton.addEventListener('click', game.start);
    pauseButton.addEventListener('click', game.pause);
    stopButton.addEventListener('click', game.stop);

    window.addEventListener('keydown', game.move)
}

function getRandomNumber (min, max) {
    return (Math.ceil(Math.random()*(max - min)) + min );
}


window.addEventListener('load', init);