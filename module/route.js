const url = require('url')
const fs = require('fs')
const path = require('path')

// 根据后缀名获取文件类型
function getFileMime(extname){
    let data = fs.readFileSync('./data/mime.json');
    let mimeObj = JSON.parse(data.toString());
    return mimeObj[extname]
}

// 静态web服务的方法
function initStatic(req,res,staticPath){
    let pathname = url.parse(req.url).pathname;
    pathname = pathname == '/' ? '/index.html' : pathname;
    let extname = path.extname(pathname).slice(1);

    try{
        let data = fs.readFileSync('./'+staticPath + pathname);
        console.log(data)
        if(data){
            console.log(extname)
            let mime = getFileMime(extname);
            res.writeHead(200,{'content-Type':''+mime+';charset="utf-8"'})
            res.end(data);
        }
    }catch(err){

    }
}

let server = () => {
    // 把 get 和 post 分开
    let G = {
        _get : {},
        _post : {},
        staticPath : 'static'   // 静态web目录
    }
    

    let app = function(req,res){
        // 配置静态web目录
        initStatic(req,res,G.staticPath)

        let pathname = url.parse(req.url).pathname;
        let method = req.method.toLowerCase();
        if(G['_'+method][pathname]){
            if(method == 'get'){
                G._get[pathname](req,res)
            }else if(method == 'post'){
                // 获取post数据，把他绑定到req.body
                let postData = '';
                req.on('data',(chunk)=>{
                    postData+=chunk;
                })
                req.on('end',()=>{
                    req.body = postData;
                    G._post[pathname](req,res);
                })
            }
            
        }else{
            res.writeHead(404, {'Content-Type': 'text/html;charset="utf-8"'});
            res.end('页面不存在');
        }
    }

    app.get = function(str,cb){
        G._get[str] = cb
    }

    app.post = function(str,cb){
        G._post[str] = cb
    }

    // 静态web服务
    app.static = function(staticPath){
        G.staticPath = staticPath;
    }

    return app
}

module.exports = server()