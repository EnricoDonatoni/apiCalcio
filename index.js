//express
var express = require('express');
var bodyParser = require('body-parser');
//inspect variables
var util = require('util');

//instantiate express
var app = express();
var maxsquadre = 4;
var torneoavviato = false;

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

var squadre = [];

app.get("/domanda", function(req, res){
//Math.round((Math.random()*domande.length)
	var id = req.query.id;
	if(typeof(id) === "undefined"){
		modulo.idnonvalido(res,domande);
	}
	else{
		
		if(id == parseInt(id) || id == "" || isNaN(id)){
			
			
			modulo.idnonvalido(res,domande);
		}
		else{
			console.log("ccc");
			var n = parseInt(id);
			if((n < 0) || (n > domande.length)){
				res.setHeader('Content-Type', 'application/json');
				res.status(400).json({
					errore: "Out of range"
				});
			}
			else{
				res.setHeader('Content-Type', 'application/json');
				res.status(200).json({
					question: domande[n].question,
					idq : n
				});
			}
		}
		

	}
    
}); 

app.post("/squadra", function(req, res){

    var nomesquadra = req.body.squ || req.query.squ;
    var luogo = req.body.luogo || req.query.luogo;

    var error = "";
    var squadra={
    	nomesquadra : "",
    	luogo : ""
    };

    if(typeof(nomesquadra) === "undefined"){
    	error = "Inserire un nome squadra valido";
    }
    else{
	    if(typeof(luogo) === "undefined"){
	    	error = "Inserire un luogo valido";
	    }	
	    else{
	    		if(maxsquadre>squadre.length){
	    		
	    			squadra.nomesquadra = nomesquadra;
	    			squadra.luogo = luogo;
	    			squadre.push(squadra);
	    		}
	    		else{
	    			error = "Numero max di squadre raggiunto"
	    		}
	    	}
	    
    }



    if(error != ""){
    	res.setHeader('Content-Type', 'application/json');
    	res.status(400).json({
    		errore: error
    	});
    }
    else{	    	
		res.status(200).json({
			status: "Ok! Squadra aggiunta",
			pos: squadre.length-1
		});
    }

});

app.post("/torneo", function(req, res){
   
    var id = req.body.id || req.query.id;
    var ris = req.body.ris || req.query.ris;

    var error = "";

    if((squadre.length>maxsquadre)||(squadre.length<maxsquadre))
    {
    	error = "Numero di squadre non adatto";
    }
    else
    {
    	if(torneoavviato){
    		error = "Torneo già in corso";
    	}
    	else{
    		torneoavviato = true;

    	}
    }
});

app.post("/risposta", function(req, res){
   
    var id = req.body.id || req.query.id;
    var ris = req.body.ris || req.query.ris;

    var error = "";

    var n

    console.log(id);

    if(tentativi>0){



	    if(typeof(id) === "undefined"){
			error="Id non valido 1";
		}
		else{
			
			if(id != parseInt(id) || id == "" || isNaN(id)){
				
				
				error="Id non valido 2";
			}
			else{
				
				n = parseInt(id);
				if((n < 0) || (n > domande.length)){
					error="Id non valido 3";
				}

			}
			

		}

	    if(error != ""){
	    	res.setHeader('Content-Type', 'application/json');
	    	res.status(400).json({
	    		errore: error
	    	});
	    }
	    else{	 
	    	if(modulo.check(ris, domande[n].answer)==1){
	    		res.setHeader('Content-Type', 'application/json');
	    		res.status(200).json({
					status: "Risposta giusta",
					tentativi: tentativi
				});
	    	}
	    	else
	    	{
	    		tentativi--;
	    		res.setHeader('Content-Type', 'application/json');
	    		res.status(200).json({
					status: "Risposta sbagliata",
					tentativi: tentativi
				});


	    	}

	    }


	}
	else
	{
		res.setHeader('Content-Type', 'application/json');
	    		res.status(200).json({
					status: "Tentativi finiti",
					
				});

	}

});

//listen in a specific port
app.listen((process.env.PORT || 65000));

//check status
console.log('Server running at http://localhost:65000/');