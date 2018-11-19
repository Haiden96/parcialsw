
var io = io();

io.on('new user', function(newUser) {
	alert(newUser.message);
});

window.onload = function() {
   	var width = screen.availWidth - 250;
	var height = $(window).height()-100;

	if(width < 400)  width = width+250;
	if(width > 1000) width = 600;

    var app = new Application( { id: 'umldiagram', width: width, height: height } );

    $("#umldiagram").click(function() {
		var xml = app.getXMLString();
		io.emit('new xml', xml);
	});

	io.on('xml reenviado', function(xmlReenviado){
		console.log(xmlReenviado)
		var i;
		for (i = 0; i < 100; i++) {
    app._delDiagram();
		}

		app.setXMLString(xmlReenviado);
	});

	(function (d, io) {
		'use strict';

		var	chatForm = d.querySelector('#formulario'),
			messageText = d.querySelector('#mensaje'),
			chat = d.querySelector('#lista');

		function getParameterByName(name) {
	    	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    	results = regex.exec(location.search);
	    	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}

	  	var id = getParameterByName('id');

		chatForm.onsubmit = function (e) {
			e.preventDefault();

			var usuario = '';
			$.ajax({
         		url : ruta + 'getUsuario',
        		type: 'POST',
       			dataType : 'json',
       			data : {usuario_id : id},
         	}).done(function(respuesta){
         		usuario = respuesta.nombre;
         		io.emit('new message',{
         			mensaje : messageText.value,
         			usuario : usuario
         		} );
				messageText.value = null;
				return false;
         	})

		}

		io.on('user says', function (userSays) {
			var hoy = new Date();
			var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
			chat.insertAdjacentHTML('beforeend', '<li><div><strong>' + userSays.usuario + '</strong> <small>' + hora + '</small></div><p>'+ userSays.mensaje + '</p></li>');
		});

		//'<li class="left clearfix"><div class="chat-body clearfix"><div class="header"><strong class="primary-font">' + userSays.usuario + '</strong> <small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>12 mins ago</small></div><p>'+ userSays.mensaje + '</p></div></li>'
		//'<div  class="row message-bubble"><p class="text-muted">Matt Townsen</p><span>' + userSays + '</span></div>'
	})(document, io);
}
