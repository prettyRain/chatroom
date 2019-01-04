/**
 * Created by prettyRain on 2019/1/4.
 */
//express
var express = require('express');
var app = express();

//创建io公式
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set("view engine","ejs");
app.use(express.static("./public"));
//session
var session = require("express-session");
app.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 800000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true
}));

var userarr = [];
//显示登录页面
app.get("/",function(req,res){
    //判断有没有登录
    if(!!req.session.username){
        res.redirect("/chat");
    }else{
        res.render("login");
    }
})
//登录
app.get("/dologin",function(req,res){
    var username = req.query.username;
    if(userarr.indexOf(username) != -1){
        //已经被占用
        res.send("-1");
    }else{
        req.session.login = 1;
        req.session.username = username;
        userarr.push(username);
        res.send("1");
    }
})
//聊天室
app.get("/chat",function(req,res){
    if(!req.session.username){
        res.render("login");
        return;
    }
    res.render("chat",{username:req.session.username});
});
io.on('connection',function(socket){
    console.log("创建了一个连接");
    socket.on("shuru",function(msg){
        console.log(msg);
        io.emit("shuchu","<h6>"+msg.username+"</h6><p>"+msg.content+"</p>");
    })
})
//监听  注意不要写错
server.listen(3000);
