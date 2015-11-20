var Generator = require('./Gruntfile');

var manager = new Generator();
/*manager.getTenants('./../../src',function(error,response){
    console.log(response);
});*/

/*var files = [];
manager.getFiles('./../../src',files);
console.log(files);*/

//manager.test('src');
//console.log(manager.test('src'));
//console.log(manager.getTenants('src/tenants'));
console.log(manager.getModuleFiles('app','services','src/'));