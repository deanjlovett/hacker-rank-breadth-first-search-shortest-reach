'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}

/*
 * Complete the 'bfs' function below.
 *
 * The function is expected to return an INTEGER_ARRAY.
 * The function accepts following parameters:
 *  1. INTEGER n
 *  2. INTEGER m
 *  3. 2D_INTEGER_ARRAY edges
 *  4. INTEGER s
 */

function bfs(n, m, edges, s) {
    // Write your code here
    console.log('========================');

    console.log('.   nodes, n:',n);
    console.log('.   edges, m:',m);
    console.log('arr of edges:');
    console.log(edges);
    console.log('start, s:',s);
    
    let myMap = {};
    let mySet = new Set();
    edges.forEach((e,i,arr)=>{
        myMap[''+e[1]] = ''+e[0];
        mySet.add(e[0]);
        mySet.add(e[1]);
    })
    let myList = [...mySet].sort((a,b)=>a-b);
    console.log('myList:');
    console.log(myList);
    console.log('myMap:');
    console.log(myMap);

    let ret = [];
    for(let i=1; i<=n; ++i){
        console.log('loop, i:',i)
        if( i === s) {
            console.log(`  i:${i} == s:${s}`);
            continue;
        }
        if( ! mySet.has(i) ){
            console.log(`  i:${i} not in set ${myList}`);

            ret.push(-1);
            continue;
        } 
        let c = 0;
        let t = ''+i;
        console.log(`  starting while(t:${t} != s:${s}`);
        while(t!=''+s){
        console.log(`    inside while(t:${t} != s:${s}`);

            if( ! myMap.hasOwnProperty(t) ){
                console.log(`      myMap doesn't have key: ${t} ... will give up`);
                break;
            }
            c += 6;
            t = myMap[t];
        }
        if(t == ''+s){
            console.log(`    t:${t} == s:${s}, ret.push(${t})`);
            ret.push(c);
        }else{
            console.log(`    t:${t} != s:${s}, ret.push(-1)`);
            ret.push(-1)
        }
    }
    console.log('========================');
    return ret;
}

function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const q = parseInt(readLine().trim(), 10);

    for (let qItr = 0; qItr < q; qItr++) {
        const firstMultipleInput = readLine().replace(/\s+$/g, '').split(' ');

        const n = parseInt(firstMultipleInput[0], 10);

        const m = parseInt(firstMultipleInput[1], 10);

        let edges = Array(m);

        for (let i = 0; i < m; i++) {
            edges[i] = readLine().replace(/\s+$/g, '').split(' ').map(edgesTemp => parseInt(edgesTemp, 10));
        }

        const s = parseInt(readLine().trim(), 10);

        const result = bfs(n, m, edges, s);

        ws.write(result.join(' ') + '\n');
    }

    ws.end();
}
