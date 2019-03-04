var arr= []
console.time("time1")
function radom (){
    return Math.floor(Math.random()*100)
}
for (var i = 0; i<1000; i++){
    arr.push(random())
}
console.timeEnd("time1")