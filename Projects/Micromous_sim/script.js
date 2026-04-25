let config_maze = document.getElementById('configSelect')

// on load, get saved mazes and populate the select dropdown
window.onload = function() {
    renderMaze();
    for(let i=0; i< Object.keys(saved_mazes).length; i++) {
        let option = document.createElement('option');
        option.value = Object.keys(saved_mazes)[i];
        option.text = Object.keys(saved_mazes)[i];
        config_maze.appendChild(option);
    }
    config_maze.onchange = function() {
        if(config_maze.value == 'custom') return;
        maze = JSON.parse(saved_mazes[config_maze.value]);
        renderMaze();
    }
}

function start(){
    const rat = new Rat('CYBER_RODENT_v01');
    document.getElementById('status').innerText = `NODE_POSITION: [${rat.position[0]}, ${rat.position[1]}]`;
    renderMaze();

    const algorithmSelect = document.getElementById('algorithmSelect');
    let algorithm = algorithmSelect.value;
    console.log(`Selected algorithm: ${algorithm}`);
    if(algorithm === 'A_star'){
        let interval = setInterval(()=>{
            rat.step_A_star(maze);
            if(rat.finished){
                clearInterval(interval);
                displayPath(rat);
            }
        }, 100)
    }
    else if(algorithm === 'floodfill'){
        let interval = setInterval(()=>{
            rat.step_floodfill(maze);
            if(rat.finished){
                clearInterval(interval);
                //displayPath(rat);
            }
        }, 200)
    }
}

function displayPath(rat){
    let interval = setInterval(()=>{
        let current_position = rat.position;
        let current_cell = maze[current_position[1]][current_position[0]];
        current_cell.state = 'path';
        let next_move = maze[current_position[1]][current_position[0]].best_parent;
        console.log(maze[current_position[1]][current_position[0]]);
        if(next_move === null){
            clearInterval(interval);
            return;
        }
        rat.go_to(next_move);
        next_cell = maze[next_move[1]][next_move[0]];
        next_cell.state = 'rat';
        renderMaze();

    }, 100);    
}
