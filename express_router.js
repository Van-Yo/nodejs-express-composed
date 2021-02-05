const http = require('http');
const app = require('./module/route');
const ejs = require('ejs')

/**
 * 原先http-server是这么写的
 * 也就是每次使用服务都会执行里面的function方法
*/
// http.createServer(function (request, response) {
// 	response.writeHead(200, {'Content-Type': 'text/plain'});
// 	response.end('Hello World');
// }).listen(8081);

/**
 * 对上面的function进行改造，改成我们想要执行的东西
 * 注册web服务
 * 以后每次使用服务都会执行app方法
*/
http.createServer(app).listen(8088);
console.log('Server running at http://127.0.0.1:8088/');

// 静态web服务
app.static('public')

// 配置路由
app.get('/',(req,res)=>{
	res.writeHead(200, {'Content-Type': 'text/html;charset="utf-8"'});
	res.end('home');
})

// 配置路由
app.get('/login',(req,res)=>{
	ejs.renderFile('./views/login.ejs', {name:'提交'}, function(err, str){
		res.writeHead(200, {'Content-Type': 'text/html;charset="utf-8"'});
		res.end(str);
	});
	
})

// 配置路由
app.post('/doLogin',(req,res)=>{
	console.log(req.body)
	res.writeHead(200, {'Content-Type': 'text/html;charset="utf-8"'});
	res.end(JSON.stringify(req.body));
})