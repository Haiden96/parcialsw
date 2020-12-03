'use strict';
//SERVIDOR NUEVO
const express = require('express'),
	app = express(),
	http = require('http').createServer(app),
	io = require('socket.io')(http),
	port = process.env.PORT || 3000,
	publicDir = express.static(`${__dirname}/editor`);
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

var mysql = require('mysql');
var connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'bdsegundopsw',
   port: 3306
});

connection.connect(function(error){
   if(error){
      throw error;
   }else{
      console.log('Conexion correcta.');
   }
});

app
	.use(publicDir)
	.get( '/', (req, res) => res.sendFile(`${publicDir}/index.html`));

app.post('/ingresar/',(req,res) =>{

    var query = connection.query("SELECT * FROM `usuario` WHERE email='"+req.body.email+"' and password = '"+req.body.password+"'",
    function(error,result){
        if(error){
        console.log("error");
        }else {
          if(result.length > 0)
            res.status(200).send({access : true, datos : result});
          else
            res.status(200).send({access: false});
        }
    });

});

app.post('/getUsuario', (req, res) => {
      var query = connection.query("SELECT * FROM usuario WHERE id = " + req.body.usuario_id,
    function(error,result){
      if(result.length > 0)
        res.status(200).send({access: true, nombre : result[0].nombre});
        else
        res.status(200).send({access: false});
    });
});

app.post('/registrar',(req,res)=>{
  var query = connection.query("INSERT INTO `usuario`(`id`, `nombre`, `email`, `password`) VALUES (NULL,'"+req.body.nombre+"','"+req.body.email+"','"+req.body.password+"')",
  function(error,result){
      if(error)
      throw error;
      else {
          res.status(200).send({operation:true});
      }
  });
});

http.listen( port, () => console.log('Iniciando en localhost:%d', port));

io.on("connection", (socket) => {
	socket.broadcast.emit('new user', {message : 'Ha entrado un usuario'});

	socket.on('new xml', message =>{
		socket.broadcast.emit('xml reenviado', message);
	});

	socket.on('new message', message =>{
      io.emit('user says', message);
  } );
})
