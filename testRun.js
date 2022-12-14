var spawn = require('child_process').spawn;
var cp = spawn(process.env.comspec, ['/c', 'py', 'test.py']);

var count=0;
let gonderilecekler = ["zafer\n","duran\n"];

cp.stdout.on("data", function(data) {
    console.log(data.toString());
	if(count == 0)	{cp.stdin.write(gonderilecekler[0]); count++;}
	else cp.stdin.write(gonderilecekler[1]);
});

cp.stderr.on("data", function(data) {
    console.error(data.toString());
});