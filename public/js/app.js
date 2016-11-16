var plantilla ='<div class="col-sm-12 col-md-4">'+
	'<div class="thumbnail">'+
	'<img src="::src::" alt="poster" class="poster">'+
	'<div class="caption">'+
	'<h3 id="title"><strong>::title::</strong></h3>'+
	'<p id="plot"><strong>Plot:</strong> ::plot::</p>'+
	'<p id="actors"><strong>Actors:</strong> ::actors:: </p>'+
	'<p><button class="btn btn-warning btn-collapse" type="button" aria-expanded="false" aria-controls="collapseExample">See more</button>'+
	'</p>'+
	'<div class="collapse" class="collapseExample">'+
	'<div class="card card-block">'+
	'<p><strong>Full plot:</strong> ::plot2::</p>'+
	'<p><strong>Runtime:</strong> ::runtime:: </p>'+
	'<p><strong>Genre:</strong> ::genre:: <p>'+
	'<p><strong>Year:</strong> ::released:: <p>'+
	'<p><strong>Awards:</strong> ::awards:: <p>'+
	'<p><strong>Languages:</strong> ::language:: <p>'+
	'<p><strong>Country:</strong> ::country:: <p>'+
	'</div>'+
	'</div>'+
	'</div>'+
	'</div>'+
	'</div>';

var cargarPagina = function () {

	setTimeout(function(){
		$(".logo-temporal").addClass("ocultar");
		$("#logo-login").removeClass("ocultar");
		$("#login").removeClass("ocultar");
	}, 5000);

	if((src!=null || src!=undefined)&& location.href.includes("searcher.html")){
		$("#foto-perfil").attr("src", src);
		$("#nombre").text(nombre);
	}

	window.fbAsyncInit = function() {
		FB.init({
			appId      : '1271991989487510',
			status     : true,
			cookie     : true,
			xfbml      : true,
			version    : 'v2.1'
		});
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response, function() {});
		});
	};

	var buscarPorTitulo = function (event) {
		if (event.keyCode == 13) {
			$('#search-by-title-button').click();

		} else {
			return false
		}
	};

	$(".display-none").parent().addClass("display-none");
	$('#titulo').keyup(buscarPorTitulo);
	$('#search-by-title-button').click(buscarTitulo);
	$('#search-by-title-reset').click(reset);
};


$(document).ready(cargarPagina);

var nombre= localStorage.getItem("nombre");
var src= localStorage.getItem("src");

$(document).on('click', '#login' , function(e) {
	e.preventDefault();
	facebookLogin();
});

$(document).on('click', ".btn-collapse" , function(){
	$(this).attr("aria-expanded","true");
	$(this).parent().next().toggleClass("collapse");
});

var statusChangeCallback = function(response, callback) {
	console.log(response);
	if (response.status === 'connected') {
		getFacebookData();
	} else {
		callback(false);
	}
};

var checkLoginState = function(callback) {
	FB.getLoginStatus(function(response) {
		callback(response);
	});
};

var getFacebookData =  function() {
	FB.api('/me', function(response) {
		localStorage.setItem("nombre", response.name);
		localStorage.setItem("src", 'http://graph.facebook.com/'+response.id+'/picture?type=large');
		window.location = 'searcher.html';
	});
};

var facebookLogin = function() {
	checkLoginState(function(data) {
		if (data.status !== 'connected') {
			FB.login(function(response) {
				if (response.status === 'connected')
					getFacebookData();
			}, {scope: scopes});
		}
	});
};

var buscarTitulo=function () {
	var c = $('#search-by-title-form').serialize();
	var url = 'http://www.omdbapi.com/?' + c;
	var pelicula = $('#search-by-title-response');
	var fullPlot;
	$.getJSON(url.replace("short","full"),function (a){
		fullPlot=a.Plot;
	});
	$.getJSON(url,function (a) {
		$("#conten").prepend(plantilla.replace("::title::",a.Title)
							 .replace("::src::",a.Poster)
							 .replace("::plot::",a.Plot)
							 .replace("::actors::",a.Actors)
							 .replace("::released::",a.Released)
							 .replace("::runtime::",a.Runtime)
							 .replace("::genre::",a.Genre)
							 .replace("::title2::",a.Title)
							 .replace("::plot2::",fullPlot)
							 .replace("::actors2::",a.Actors)
							.replace("::language::",a.Language)
							.replace("::awards::",a.Awards)
							.replace("::country::",a.Country));
		$("#titulo").val("");
	});
};