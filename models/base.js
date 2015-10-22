/*w
 * Copyright (C) 2015 Rafael Ramírez
 *
 *   Chasqui es software libre; puede redistribuirlo y/o modificarlo bajo 
 *   los términos de la Licencia Pública General GNU tal como se publica por 
 *   la Free Software Foundation; ya sea la versión 3 de la Licencia, o 
 *   (a su elección) cualquier versión posterior.
 *
 *   Chasqui se distribuye con la esperanza de que le sea útil, pero SIN 
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

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
/*
mongoose.connect('mongodb://127.2.75.2/node',{
	user:'admin',
	pass:'HHpVv7CVaWtT'
});*/

mongoose.connect('mongodb://localhost/chasqui2');


var UserSchema = new mongoose.Schema({
  /*username: String,
  password: String*/
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  nombre:   { type:String, required:true },
  correo:   { type:String, required:true },
  admin:    { type:Boolean,required:true }

});

var DataModelSchema = new mongoose.Schema({
  username: { type: String, required: true },
  date:     { type:Date, default: Date(Date.now) },
  msg:      { type:String },
  url:      { type:String },
  fecha:    { type:String, required:true },
  hora:     { type:String, required:true }
});

UserSchema.pre('save', function(next){
  var user = this;
  if(user.isModified('password')){
      bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(!err){
            bcrypt.hash(user.password,salt,function(err,hash){
              if(!err){
                user.password = hash;
                next();
              }else{
                next(err);
              }
            });
        }else{
          next(err);
        }
      });
  }
});

UserSchema.methods.comparePassword = function(candidatePassword,callback){
  bcrypt.compare(candidatePassword, this.password, function(err, esIgual){
    if(err){
      callback(err);
    }else{
      callback(null,esIgual);
    }
  });
};

var User = mongoose.model('User',UserSchema);
var Data = mongoose.model('Data',DataModelSchema);

var registerData = function(username, msg,url,fecha,hora){
  var data = new Data({
    username: username,
    msg: msg,
    url: url,
    fecha: fecha,
    hora: hora
  });

  data.save(function(err,data){
    if(err){
      console.log("error de insercion");
    }else{
      console.log(data);
    }
  });

};

var registerUser = function(username,password,nombre,correo,admin){
  var usuario = new User({
    username: username,
    password: password,
    nombre: nombre,
    correo: correo,
    admin: admin,
  });

  usuario.save(function(err,usuario){
    if(err){
      console.log("error de insercion");
    }else{
      console.log(usuario);
    }
  });


};

module.exports.User = User;
module.exports.Data = Data;
module.exports.registerData = registerData;
module.exports.registerUser = registerUser;
//registerData("jhonny","hola a todo el mundo","www.mundofred.com","dd/mm/yyyy","01:20");
//registerUser("jhonny","makerlabs","Jhonny Chiri Aguayo","jhonny@gmail.com",true);

/*
registerUser("admin","asdf","Rafael Ramirez","mrsblast@gmail.com",true);
registerUser("toto","qwerty","Hernan Sarabia","totoland@gmail.com",false);
*/

/*
var usuario = new User({
  username: "roli",
  password: "hackerlife"
});

usuario.save(function(err,usuario){
  if(err){
    console.log("error");
  }else{
    console.log(usuario);
  }
});

User.findOne({username: 'roli'}, function(err,user){
  if(!err){
    console.log(user);
    user.comparePassword("hackerlife",function(err,esIgual){
      if(err == null && esIgual){
        console.log("Bienvenido al sistema");
      }else{
        console.log("Password Incorrecto");
      }
    });
  }
});
*/
