/*
 * Copyright (C) 2015 Rafael Ramírez
 *
 *   Chasqui es software libre; puede redistribuirlo y/o modificarlo bajo 
 *   los términos de la Licencia Pública General GNU tal como se publica por 
 *   la Free Software Foundation; ya sea la versión 3 de la Licencia, o 
 *   (a su elección) cualquier versión posterior.
 *
 *   Chaqui se distribuye con la esperanza de que le sea útil, pero SIN 
 *   NINGUNA GARANTÍA; sin incluso la garantía implícita de MERCANTILIDAD o 
 *   IDONEIDAD PARA UN PROPÓSITO PARTICULAR. Vea la Licencia Pública 
 *   General GNU para más detalles.
 *
 *   Debería haber recibido una copia de la Licencia Pública General GNU
 *   junto con Chasqui; de lo contrario escriba a la Free Software Foundation, Inc.,
 *   51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, EE. UU.
 *   También puede encontrar la licencia en la siguiente dirección 
 *   http://www.gnu.org/licenses/gpl.html
 */

var express = require('express');
var fs = require('fs');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var models = require('./models/base');
var app = express();

nunjucks.configure(__dirname + '/public/views',{
	express:app
});

app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static(__dirname + '/public'));

app.use(cookieParser());

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

if(ipaddress == undefined){
	ipaddress = "127.0.0.1";
}

app.get('/',function(req,res){
	var user = req.cookies.usuario;
	if(user == null){
			res.render("login.html");
	}else{
			models.User.findOne({username:user},function(err,usuario){
				if(!err){
					if(usuario.admin){
						res.render("admin.html",{
							username: user,
							option: "none"
						});
					}else{
						res.render("user.html",{
							username: user,
							option: "none"
						});
					}
				}
			});
	}
});

app.get('/user',function(req,res){
	var user = req.cookies.usuario;
	if(user == null){
		res.render("login.html");
	}else{
		models.User.findOne({username: user}, function(err,usuario){
			if(!err){
				if(usuario.admin){
					res.render("admin.html",{
						username: user,
						option: "none"
					});
				}else{
					res.render("user.html",{
						username: user,
						option: "none"
					});
				}
			}

		});

	}
});


app.get('/admin',function(req,res){
  var user = req.cookies.usuario;
		if(user == null){
			res.render("login.html");
		}else{
			models.User.findOne({username:user},function(err,usuario){
				if(!err){
					if(usuario.admin){
						res.render("admin.html",{
							username: user,
							option: "none"
						});
					}else{
						res.render("user.html",{
							username: user,
							option: "none"
						});
					}
				}
			});
		}
});

app.get('/register',function(req,res){
	var user = req.cookies.usuario;
		if(user == null){
			res.render("login.html");
		}else{
			models.User.findOne({username:user},function(err,usuario){
				if(!err){
					if(usuario.admin){
						res.render("register.html",{
							username: user,
							option: "none"
						});
					}else{
						res.render("user.html",{
							username: user,
							option: "none"
						});
					}
				}
			});
		}
});

app.get('/gencsv',function(req,res){
	var user = req.cookies.usuario;
		if(user == null){
			res.render("login.html");
		}else{
			models.User.findOne({username:user},function(err,usuario){
				if(!err){
					if(usuario.admin){
						res.render("csv.html",{
							username: user,
							option: "none"
						});
					}else{
						res.render("user.html",{
							username: user,
							option: "none"
						});
					}
				}
			});
		}
});




app.get('/logout',function(req, res){
  var user = req.cookies.usuario;
  res.clearCookie('usuario').render("login.html");
});

app.post('/',function(req,res){
	var username = req.body.user;
	var password = req.body.pass;
	console.log("user: %s password: %s", username, password);
	models.User.findOne({username: username}, function(err,user){
		if(!err && user!=null){
			console.log(user);
			user.comparePassword(password,function(err,esIgual){
				if(err == null && esIgual){
					console.log("Bienvenido al sistema");
					if(user.admin){
						res.cookie("usuario",username).render("admin.html",{
							username: username,
							option: "none"
						});
					}else{
						res.cookie("usuario",username).render("user.html",{
							username: username,
							option: "none"
						});
					}
				}else{
					console.log("Password Incorrecto");
					res.render("login.html");
				}
			});
		}
	});


});

app.post('/registerAccount',function(req,res){
	var user = req.cookies.usuario;
	var nombre = req.body.nombre;
	var correo = req.body.correo;
	var username = req.body.user;
	var pass = req.body.pass;
	var pass1 = req.body.pass1;

	if(pass == pass1){
		models.registerUser(username,pass,nombre,correo,false);
	}
	setTimeout(function(){
			res.render("register.html",{
				username: user,
				option: "block"
			});

	},2000);



});

app.post('/registerData',function(req,res){
	var user = req.cookies.usuario;
	var msg = req.body.msg;
	var fecha = req.body.fecha;
	var tiempo = req.body.tiempo;
	console.log(fecha);
	models.registerData(user,msg,'',fecha,tiempo);
	models.User.findOne({username: user},function(err,usuario){
		if(!err){
			if(usuario.admin){
				setTimeout(function(){
						res.render("admin.html",{
							username: user,
							option: "block"
						});

				},2000);


			}else{
				setTimeout(function(){
						res.render("user.html",{
							username: user,
							option: "block"
						});

				},2000);
			}
		}
	});
});

app.post('/gencsv',function(req,res){
	var user = req.body.nombre;
	var dfinal = req.body.dfinal;
	var dini = req.body.dini;
	console.log(user);
	console.log(dini);
	console.log(dfinal);
	var wstream = fs.createWriteStream('/tmp/' + user + '.csv');
	models.Data.find({username: user},function(err,data){
		if(!err){
			data.forEach(function(dat){
				console.log(dat.date);
				if(dat.date <= dfinal && dat.date >= dini){
					var cad = dat.fecha + " " + dat.hora + "," + dat.msg + "\n";
					wstream.write(cad);
				}
			});
			wstream.end();
			setTimeout(function(){
					res.download('/tmp/' + user + '.csv');
			},2000);

		}
	});
});

app.get('/prog',function(req,res){
	res.render("admin.html");

});


app.get('/csv',function(req,res){
	res.render("csv.html");

});


app.listen(port,ipaddress,function(){
	console.log('%s: Node Server started on %s:%d ...',Date(Date.now()),ipaddress,port);
});
