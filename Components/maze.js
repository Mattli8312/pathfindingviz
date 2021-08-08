/**
 * This file contains all functions for rendering the maze using different approaches
 */

/**Used to set up all the walls for every individual cell */
function InitializeAllWalls(){
    for(let i = 0; i < height*2+1; i++){
        for(let j = 0; j < width*2+1; j++){
            if(i%2 && j%2){
                continue;
            }
            else{
                $('#'+i+'a'+j).attr('type','wall');
            }
        }
    }
}

/**Maze generator utility functions */

function validDivIndx(i,j){
    return i > -1 && j > -1 && i < 2*height+1 && j < 2*width+1;
}

function RenderEightWalls(i,j){
    let dx = [-1,0,1,1,1,0,-1,-1];
    let dy = [-1,-1,-1,0,1,1,1,0];
    for(let a = 0; a < 8; a++){
        $('#'+(i+dy[a])+'a'+(j+dx[a])).attr('type','wall');
    }
}

/** Maze Generation using Depth-First Search (iterative approach) */
async function GenerateMaze_DFS(){
    //InitializeAllWalls();
    let x = 1, y = 1;
    let stack = [];
    let delx = [-2,0,2,0];
    let dely = [0,2,0,-2];
    stack.push([y,x]);
    while(stack.length > 0){
        /**Initialize current div to be visited and initialize all eight walls*/
        let curr = stack[stack.length-1];
        if($('#'+(curr[0])+'a'+(curr[1])).attr('type') != 'visited'){
            RenderEightWalls(curr[0],curr[1]);
        }
        $('#'+(curr[0])+'a'+(curr[1])).attr('type','visited');
        /**We need to carve out the walls */
        switch(curr[2]){
            case 0: $('#'+(curr[0])+'a'+(curr[1]+1)).attr('type','visited'); break;
            case 2: $('#'+(curr[0])+'a'+(curr[1]-1)).attr('type','visited'); break;
            case 1: $('#'+(curr[0]-1)+'a'+(curr[1])).attr('type','visited'); break;
            default: $('#'+(curr[0]+1)+'a'+(curr[1])).attr('type','visited');break;
        }
        let options = [];
        for(let i = 0; i < 4; i++){
            let curr_div = $('#'+(curr[0]+dely[i])+'a'+(curr[1]+delx[i]))
            if(validDivIndx(curr[0]+dely[i],curr[1]+delx[i]) && curr_div.attr('type') != 'visited'){
                options.push([curr[0]+dely[i],curr[1]+delx[i],i])
            }
        }
        if(!options.length) stack.pop();
        else{
            let indx = Math.floor(Math.random()*options.length);
            let next = options[indx];
            
            stack.push(next); 
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    $('[type=visited]').attr('type','tile');
}

async function GenerateMaze_Prims(){
    let x = Math.floor(Math.random() * width)*2+1;
    let y = Math.floor(Math.random() * height)*2+1;
    let dx = [-2,0,2,0], dy = [0,2,0,-2];
    let set = [[y,x]];
    while(set.length > 0){
        let indx = Math.floor(Math.random()*set.length)
        let curr = set[indx]; //pick random element in the set
        set.splice(indx,1);
        if($('#'+curr[0]+'a'+curr[1]).attr('type')!='visited'){
            RenderEightWalls(curr[0],curr[1]);
        }
        else{
            continue;
        }
        $('#'+curr[0]+'a'+curr[1]).attr('type','visited');
        //Carve out the walls
        switch(curr[2]){
            case 0: $('#'+(curr[0])+'a'+(curr[1]+1)).attr('type','visited'); break;
            case 2: $('#'+(curr[0])+'a'+(curr[1]-1)).attr('type','visited'); break;
            case 1: $('#'+(curr[0]-1)+'a'+(curr[1])).attr('type','visited'); break;
            default: $('#'+(curr[0]+1)+'a'+(curr[1])).attr('type','visited');break;
        }
        //analyze options
        for(let i = 0; i < 4; i++){
            let curr_div = $('#'+(curr[0]+dy[i])+'a'+(curr[1]+dx[i]))
            if(validDivIndx(curr[0]+dy[i],curr[1]+dx[i]) && curr_div.attr('type') != 'visited'){
                set.push([curr[0]+dy[i],curr[1]+dx[i],i]);
            }
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

//await new Promise(resolve => setTimeout(resolve, 50));