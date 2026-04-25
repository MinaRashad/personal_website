class Rat{
    constructor(name){
        this.name = name;
        this.position = [15, 15];
        this.finished = false;
        this.goal = null; // goal location is unknown

        this.open_list = [this.position];
        this.closed_list = [];
        this.path = [];


        // this will be used for the floodfill algorithm
        this.seen_maze = []; // what the rat has seen of the maze so far
        for(let y=0; y<16; y++){
            let row = [];
            for(let x=0; x<16; x++){
                let cell = new MazeCell(x, y);
                cell.g = 0; // distance to goal
                row.push(cell);
            }
            this.seen_maze.push(row);
        }

        // connect all cells in seen_maze
        for(let y=0; y<16; y++){
            for(let x=0; x<16; x++){
                let cell = this.seen_maze[y][x];
                if(y > 0) cell.connections.north = {x: x, y: y-1};
                if(y < 15) cell.connections.south = {x: x, y: y+1};
                if(x < 15) cell.connections.east = {x: x+1, y: y};
                if(x > 0) cell.connections.west = {x: x-1, y: y};
            }
        }
    }

    // sensors
    get_available_moves(maze){
        let moves = [];
        let connections = maze[this.position[1]][this.position[0]].connections;
        let current_g = maze[this.position[1]][this.position[0]].g;
        
        for(const direction of Object.keys(connections)){

            if(connections[direction]){
                console.log(`Can move ${direction}, g=${current_g}`);
                moves.push([connections[direction].x, connections[direction].y]); // x, y             
            }
        }
        return moves;
    }

    // actuators
    move(direction){
        maze[this.position[1]][this.position[0]].state = 'seen';

        if(direction === 'north'){
            this.position[1] -= 1;
        }
        else if(direction === 'south'){
            this.position[1] += 1;
        }
        else if(direction === 'east'){
            this.position[0] += 1;
        }
        else if(direction === 'west'){
            this.position[0] -= 1;
        }

        maze[this.position[1]][this.position[0]].state = 'rat';
    }

    go_to(position, new_state='seen'){
        // make sure the position is seen and valid
        if(position[0] < 0 || position[0] >= maze[0].length || position[1] < 0 || position[1] >= maze.length){
            document.getElementById('status').innerText = `ERR: INVALID_MOVE_TO [${position[0]}, ${position[1]}]`;
            return;
        }
        
        if(maze[position[1]][position[0]].state !== 'empty'){
            this.position = position;
            document.getElementById('status').innerText = `POSITION_SYNC: [${this.position[0]}, ${this.position[1]}]`;
        }
        else{
            console.log('trying to move to an unseen position');
            console.log(maze[position[1]][position[0]]);
            document.getElementById('status').innerText = `ERR: SECTOR_UNMAPPED [${position[0]}, ${position[1]}]`;
        }
    }

    heuristic(position){
        // we dont know where the goal is yet but
        // it is likely to be near the center of the maze
        let center = [Math.floor(maze[0].length/2), Math.floor(maze.length/2)];
        return Math.abs(position[0] - center[0]) + Math.abs(position[1] - center[1]);
    }


    // algorithm
    step_A_star(maze){
        if(this.finished) return;
        
        let current_cell = maze[this.position[1]][this.position[0]];
        if(current_cell.state === 'end'){
            this.finished = true;
            return;
        }
        debugger
        current_cell.state = 'rat';
        if(current_cell.g === null){
            current_cell.g = 0; // starting point
        }
        renderMaze();

        let current_h = this.heuristic(this.position);
        let current_g = current_cell.g;
        
        // add new moves to open list
        let available_moves = this.get_available_moves(maze);
        for(const move of available_moves){
            let cell = maze[move[1]][move[0]];
            if(!this.closed_list.some(pos => pos[0] === move[0] && pos[1] === move[1]) &&
               !this.open_list.some(pos => pos[0] === move[0] && pos[1] === move[1]))
               {
                    this.open_list.push(move);
                    if(cell.g === null || cell.g > current_g + 1){
                        cell.g = current_g + 1;
                        cell.best_parent = [this.position[0], this.position[1]];
                    }
                    if(cell.state === 'empty') cell.state = 'next';
               }
        }
        if(this.open_list.length === 0){
            document.getElementById('status').innerText = `ERR: NO_PATH_FOUND. UNIT_STALL [${this.position[0]}, ${this.position[1]}]`;
            this.finished = true;
            return;
        }
        // move to the best option in open list
        let best_move = null;
        let best_f = Infinity;
        for(const move of this.open_list){
            let cell = maze[move[1]][move[0]];
            let g = cell.g === null ? Infinity : cell.g;
            let h = this.heuristic(move);
            let f = g + h;
            if(f < best_f){
                best_f = f;
                best_move = move;
            }
        }

        if(best_move){

            current_cell.state = 'seen';
            this.go_to(best_move);
            // update lists
            this.closed_list.push(this.position);
            this.open_list = this.open_list.filter(pos => !(pos[0] === this.position[0] && pos[1] === this.position[1]));
            let new_cell = maze[this.position[1]][this.position[0]];
            
            //
            if(new_cell.state === 'end'){
                this.finished = true;
                return;
            }
            else{
                new_cell.state = 'rat';
            }
        }

        
    }
    

    step_floodfill(maze){
        if(this.finished) return;

        // update the maze using sensors
        let current_cell = maze[this.position[1]][this.position[0]]; // this is the real maze, here we "read" the sensors input


        let seen_cell = this.seen_maze[this.position[1]][this.position[0]];
        let direction_map = {
                    'north': [0, -1],
                    'south': [0, 1],
                    'east': [1, 0],
                    'west': [-1, 0]
                };
        let directions_opposite = {
                    'north': 'south',
                    'south': 'north',
                    'east': 'west',
                    'west': 'east'
                };
        
        // loop through available moves and disconnect cells in seen_maze that are not available
        let directions = ['north', 'south', 'east', 'west'];
        for(const direction of directions){
            if(!current_cell.connections[direction]){
                seen_cell.connections[direction] = false;

                // also disconnect the opposite direction in the neighbor cell
                let neighbor_pos = [seen_cell.x + direction_map[direction][0], seen_cell.y + direction_map[direction][1]];
                if(neighbor_pos[0] >= 0 && neighbor_pos[0] < 16 && neighbor_pos[1] >= 0 && neighbor_pos[1] < 16){
                    let opposite_direction = directions_opposite[direction];
                    let neighbor_cell = this.seen_maze[neighbor_pos[1]][neighbor_pos[0]];
                    neighbor_cell.connections[opposite_direction] = false;
                }
            }
        }

        // flood fill
        let flood_queue = [[8,8]]; // start floodfill from the center
        let visited = new Set();

        while(flood_queue.length > 0){
            let pos = flood_queue.shift();
            let key = `${pos[0]},${pos[1]}`;
            visited.add(key);

            let cell = this.seen_maze[pos[1]][pos[0]];

            // now we loop through the connections of this cell and update g values
            for(const direction of Object.keys(cell.connections)){
                let neighbor_cell = cell.connections[direction];
               
                // if the neighbor cell is not connected, skip it
                if (neighbor_cell) {
                    
                    let neighbor_pos = [cell.x + direction_map[direction][0], cell.y + direction_map[direction][1]];
                    let neighbor_key = `${neighbor_pos[0]},${neighbor_pos[1]}`;
                    if (!visited.has(neighbor_key)) {
                        // update g value
                        let neighbor_cell = this.seen_maze[neighbor_pos[1]][neighbor_pos[0]];
                        neighbor_cell.g = cell.g + 1;
                        flood_queue.push(neighbor_pos);
                        visited.add(neighbor_key);

                        maze[neighbor_pos[1]][neighbor_pos[0]].g = neighbor_cell.g; // also update the real maze for visualization
                    }
                }
                
            }
        }
        

        // now move to the neighbor with the lowest g value
        let min_g = Infinity;
        let best_direction = null;
        debugger
        for(const direction of Object.keys(seen_cell.connections)){
            let neighbor_cell_position = seen_cell.connections[direction];
            if(!neighbor_cell_position) continue;
            let neighbor_cell = this.seen_maze[neighbor_cell_position?.y][neighbor_cell_position?.x] || null;
            if(neighbor_cell !== null && neighbor_cell.g !== null && neighbor_cell.g < min_g){
                min_g = neighbor_cell.g;
                best_direction = direction;
            }
            // if equal, choose randomly (to avoid oscillation)
            else if(neighbor_cell !== null && neighbor_cell.g !== null && neighbor_cell.g === min_g){
                if(Math.random() < 0.5){
                    best_direction = direction;
                }
            }

        }
        

        if(best_direction){
            this.move(best_direction);
            document.getElementById('status').innerText = `POSITION_SYNC: [${this.position[0]}, ${this.position[1]}]`;
        }

        // for visualization, show the current path of least resistance
        // first clear all previous path states
        for(let y=0; y<16; y++){
            for(let x=0; x<16; x++){
                let cell = maze[y][x];
                if(cell.state === 'path'){
                    cell.state = 'empty';
                }  
            }
        }
        let end = [8, 8];
        let path_pos = this.position;
        let seen = new Set();
        while(!(path_pos[0] === end[0] && path_pos[1] === end[1])){
            let path_cell = maze[path_pos[1]][path_pos[0]];
            if(path_cell.state === 'empty')  path_cell.state = 'path';
            // find the neighbor with the lowest g value
            let min_g = Infinity;
            let next_pos = null;
            for(const direction of Object.keys(path_cell.connections)){
                let neighbor_cell_position = path_cell.connections[direction];
                if(!neighbor_cell_position) continue;
                let neighbor_cell = maze[neighbor_cell_position.y][neighbor_cell_position.x];
                if(neighbor_cell.g !== null && neighbor_cell.g < min_g){
                    min_g = neighbor_cell.g;
                    next_pos = [neighbor_cell.x, neighbor_cell.y];
                }
                else if(neighbor_cell.g !== null && neighbor_cell.g === min_g){
                    if(Math.random() < 0.5){
                        next_pos = [neighbor_cell.x, neighbor_cell.y];
                    }
                }
            }
            if(next_pos === null) break; // no where to go
            path_pos = next_pos;
            let key = `${path_pos[0]},${path_pos[1]}`;
            if(seen.has(key)) break; // avoid infinite loop
            seen.add(key);
        }


        renderMaze();

        if(this.position[0] === 8 && this.position[1] === 8){
            this.finished = true;
            document.getElementById('status').innerText = `TARGET_REACHED: [${this.position[0]}, ${this.position[1]}]`;
            return;
        }
    }
}
