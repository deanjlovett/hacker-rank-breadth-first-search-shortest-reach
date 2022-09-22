'use strict';

const { ChildProcess } = require('child_process');
const fs = require('fs');
const { getSystemErrorMap } = require('util');

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
 *  1. INTEGER n        nodes
 *  2. INTEGER m        edges
 *  3. 2D_INTEGER_ARRAY edges
 *  4. INTEGER s        starting node
 * 
 *  returns array of length to reach node from starting node.
 *  every edge counts as 6 (six)
 */

const dline = '========================';
const sline = '------------------------';

const isConLog = true;
const isDebugLog = false;

function clog(...args){
    if(isConLog)
        console.log(...args);
}
function dlog(...args){
    if(isDebugLog && isConLog)
        console.log(...args);
}

function clogdline(){
    clog(dline);
}
function clogsline(){
    clog(sline);
}
function dlogdline(){
    dlog(dline);
}
function dlogsline(){
    dlog(sline);
}

function bfs(n, m, edges, s) {
    // Write your code here

    let myMap = new Map(); // collection of nodes
    let myNodeSet = new Set(); // list of node keys, to be worked
    edges.forEach((e,i,arr)=>{
        let k = e[0];
        let v = e[1];
        myNodeSet.add(k);
        myNodeSet.add(v);
    });
    if( ! myNodeSet.has(s) ){ // is the starting node in the node list
        return new Array(n-1).fill(-1);
    }

    edges.forEach((e,i,arr)=>{
        let k = e[0];
        let v = e[1];
        for(let j=0;j<2;++j) {
            if( myMap.has(k) ){
                let it = myMap.get(k);
                it.childs.add(v);
            }else{
                let tset = new Set();
                tset.add(v);
                let myObj = 
                {
                    key: k,
                    childs: tset,
                    dist:-1,
                    chain: [],
                    chainset: new Set(),
                    isTop: false
                };
                myMap.set(k,myObj);
            }
            let tmp = k;
            k = v;
            v = tmp;
        }
    });

    let ret = [];
    let wq = [];

    let start = myMap.get(s);
    start.isTop = true;
    start.dist = 0;

    myMap.set(s,start);
    wq.push( start );

    while(wq.length >0 ){
        let w = wq.shift();// pop from front
        if( myNodeSet.has(w.key) ) {
            myNodeSet.delete(w.key);
        }

        let wl = [... w.childs]; //.sort((a,b)=>a-b); //<= may not need to sort
        wl.forEach((e,i,arr)=>{
            let echild = myMap.get(e);
            if( echild.chainset.has(w.key)) return;
            echild.chain.push( w.key );
            echild.chainset.add( w.key );
            if( echild.dist == -1 ) echild.dist = w.dist + 1;
            if( !myNodeSet.has(e) ) return;
            wq.push(echild);
        });
    }
    for(let i=1; i<=n; ++i){
        if( i === s) {
            continue;
        }
        if( myNodeSet.has(i) ){
            ret.push(-1);
            continue;
        } 
        ret.push( 
            !(myMap.has(i)) ? 
            -1 : 
            6 *  myMap.get(i).dist 
        );
    }
    return ret;
}

function bfs_with_debug(n, m, edges, s) {
    // Write your code here
    clogdline();
    clog(`function bfs(nodes:${n}, edges:${m}, edges, start${s}) {`);
    clogsline();

    clog('array of edges:');
    clog('[');
    edges.forEach(e=>{
        clog('  [',e[0],',',e[1],']');
    });
    clog(']');
    
    let myMap = new Map();
    let myNodeSet = new Set();

    edges.forEach((e,i,arr)=>{
        let k = e[0];
        let v = e[1];
        myNodeSet.add(k);
        myNodeSet.add(v);
    });
    if( ! myNodeSet.has(s) ){
        return new Array(n-1).fill(-1);
    }

    // edges.forEach((e,i,arr)=>{
    for( let i=0; i<edges.length; ++i){
        let e = edges[i];
        dlog(`  e:`, e)
        // let up = e[0];
        let k = e[0];
        let v = e[1];
        dlog(`  i:${i}`)
        dlog(`    k:${k}, v:${v}`)
        // dlog(`    myMap:`,myMap)
        myNodeSet.add(k);
        myNodeSet.add(v);
        for(let j=0;j<2;++j) {
            if( myMap.has(k) ){
                dlog(`    myMap.has(k:${k}) == true`);
                let it = myMap.get(k);
                dlog(`    it:`);
                dlog(it);
                it.childs.add(v);
                dlog(`    it.childs.add(v:${v})`);
            }else{
                dlog(`    myMap.has(k:${k}) == false`);
                dlog(`    myMap.set(k:${k}, ...`);
                let tset = new Set();
                tset.add(v);
                let myObj = 
                {
                    key: k,
                    childs: tset,
                    dist:-1,
                    chain: [],
                    chainset: new Set(),
                    isTop: false
                };
                dlog(`       ${JSON.stringify(myObj)}  )`);
                myMap.set(k,myObj);
            }
            let tmp = k;
            k = v;
            v = tmp;
        }
    }
    // });

    let ret = [];
    let wq = [];
    clog(`looking for start:${s} in myMap`)
    clog(`myMap.has(s) === ${myMap.has(s)}`)
    if( ! myMap.has(s) ){
        clog(`*** s:${s} not in myMap **`);
        return new Array(n-1).fill(-1);
    }
    let start = myMap.get(s);
    start.isTop = true;
    start.dist = 0;
    // since start obj changed put it back in the map
    // may not be needed
    myMap.set(s,start);
    wq.push( start );
    dlog(`start obj:`, JSON.stringify(start));

    dlog(`object s added to work queue`);
/*
            {
                key:e[0],
                childs: new set(),
                dist: 0,
                chain: [],
                isTop: false;
            });
 */
    while(wq.length >0 ){
        dlog(`inside while(wq.length:${wq.length} > 0)`)
        let w = wq.shift();// pop from front
        dlog(`  work: `, JSON.stringify(w));
        if(w.dist === -1 ) dlog(`  error: work.dist == -1 *******`);
        if( !myNodeSet.has(w.key) ) {
            dlog('  error: myNodeSet doesnt have: ', w.key);
        }else{
            myNodeSet.delete(w.key);
        }

        let wl = [... w.childs]; //.sort((a,b)=>a-b); //<= may not need to sort
        dlog(`  wl:`,wl);
        dlog(`  entering wl.forEach(...), wl.length:`,wl.length);
        wl.forEach((e,i,arr)=>{
            dlog(`    wl: i`,i)
            let echild = myMap.get(e);
            if( echild.chainset.has(w.key)) return;
            echild.chain.push( w.key );
            echild.chainset.add( w.key );
            if( echild.dist == -1 ) echild.dist = w.dist + 1;
            if( !myNodeSet.has(e) ) return;
            wq.push(echild);
        });
    }
    dlog(`myNodeSet.length:`,myNodeSet.length);
    dlog(`looping through nodes. node count:`,n);
    for(let i=1; i<=n; ++i){
        dlog('  loop, i:',i)
        if( i === s) {
            dlog(`    i:${i} == s:${s}, skip, continue`);
            continue;
        }
        if( myNodeSet.has(i) ){
            dlog(`    i:${i} not in set ${myNodeSet}, push(-1), continue`);

            ret.push(-1);
            continue;
        } 
        // ret.push( !myMap.has(i) ? -1 : 6 *  myMap.get(i).dist );

        if( myMap.has(i)){
            let node = myMap.get(i);
            dlog(`node:`, node)
            ret.push(6 * node.dist)
        }else{
            dlog(`no node with key:`, i);
            dlog(`myMap`, myMap)
            ret.push(-1)
        }
    }
    dlog('------------------------');
    dlog(ret);
    dlog('========================');
    return ret;
}

function main() {
    let output_path = process.env.OUTPUT_PATH
    if( output_path === undefined ){
        output_path = 'output.txt'
        output_path = 'output.txt'
    }
    const ws = fs.createWriteStream(output_path);

    // const ws = process.env.OUTPUT_PATH === undefined ? 
    //     process.stdout.fd :
    //     fs.createWriteStream(process.env.OUTPUT_PATH);

    // original
    // const ws = fs.createWriteStream(process.env.OUTPUT_PATH); 

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

        // const result = bfs_with_debug(n, m, edges, s);
        const result = bfs(n, m, edges, s);

        ws.write(result.join(' ') + '\n');

        if( output_path === 'output.txt'){
            clog('result:');
            clog(result);
            clog();
            
        }
    }
    ws.end();
}
