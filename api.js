const base_url = "https://api.jikan.moe/v3/"

var timerTampon = false;
var shakeOn = false;
var myPos = 0;
var totalPos = 0;
var myPosFav = 1;
var totalPosFav = 0;
var favo = [];
var anime_season;
var anime_trie = [];
var season;
getSeason();
var currentYear = new Date().getFullYear();
var anim = false;
saisonAPI();
$("#search_input").val("");
//localStorage.clear();
initFav();

function addFav(titre, url) {
    if (favo) {
        favo.push([titre, url])
    } else {
        favo = [
            [titre, url]
        ];
    }
    localStorage.setItem("favoris", JSON.stringify(favo));
    initFav();
}

function supprFav(titre) {
    for (i = 0; i < favo.length; i++) {
        if (favo[i][0] == titre) {
            favo.splice(i, 1);
            localStorage.setItem("favoris", JSON.stringify(favo));
            $("#liste-favoris li:nth-child(" + (i + 1) + ")").remove();
            totalPosFav--;
            if (totalPosFav == 0) {
                $('.petite-explicaton-fav').hide();
            } else if (totalPosFav < 3) {
                $('#img_scroll_right-fav').hide();
                $('#img_scroll_left-fav').hide();
            }
            if (totalPosFav == myPosFav && myPosFav > 1) {
                var cssValue = $('#liste-favoris').css('right');
                var parsedCssValue = parseInt(cssValue);
                parsedCssValue -= 297;
                $("#liste-favoris").animate({ right: String(parsedCssValue) + "px" }, function() { anim = false; });
                myPosFav--;
            }
            if (totalPosFav == myPosFav + 1) {
                $('#img_scroll_right-fav').hide();
            }
        }
    }
}

function inFav(titre) {
    for (i = 0; i < favo.length; i++) {
        if (favo[i][0] == titre) {
            return true;
        }
    }
}

function initFav() {
    favo = [];
    favo = JSON.parse(localStorage.getItem("favoris"));

    if (!favo) {
        totalPosFav = 0;
    } else {
        totalPosFav = favo.length;
    }

    if (totalPosFav == 0) {
        totalPosFav = 0;
        $('#img_scroll_right-fav').hide(500);
        $('#img_scroll_left-fav').hide(500);
        $('.petite-explicaton-fav').hide();
        return;
    }

    totalPosFav = favo.length;


    if (totalPosFav < 3) {
        $('#img_scroll_right-fav').hide(500);
        $('#img_scroll_left-fav').hide(500);
    } else if (myPosFav < 2) {
        $('#img_scroll_right-fav').show(500);
        $('#img_scroll_left-fav').hide(500);
    } else {
        $('#img_scroll_right-fav').show(500);
        $('#img_scroll_left-fav').show(500);
    }
    $('.petite-explicaton-fav').show();
    $(".fav").remove();
    favo.forEach(function(favoris) {
        var res = `<li class="fav">
				<a class="suppr" href="javascript:supprFav('` + favoris[0] + `');"><img src="images/bin.png" alt="Supprimer le favoris" width=35></a>
				<a class="card_anime" href="javascript:launchFav('` + favoris[0] + `')" >
					<div class="card_image">
						<img class="season_image" src="` + favoris[1] + `" alt="` + favoris[0] + `">
					</div>
					<div class="card_name">
					  <span class="card_titre">` + favoris[0] + `</span>
						</div>
				</a>
		  </li>`
        $("#liste-favoris").append(res);
    });
}

function launchFav(titre) {
    $("#search_input").val(titre);
    $("#btn-lancer-recherche").click();
}

function reset() {
    $(".saison").remove();
    $(".element").remove();
    $('#bloc-resultats').css('right', '0px');
    $('#img_scroll_left').hide();
    $('#img_scroll_right').show();
    anime_trie = [];
}

function saisonAPI() {
    $.getJSON(base_url + "season/" + currentYear + "/" + season, function(result) {
        anime_season = result.anime;
        reset();
        for (var i in anime_season) {
            if (anime_season[i].type) {
                if (anime_season[i].type == "TV" && !(anime_season[i].continuing)) {
                    anime_trie.push(anime_season[i]);
                }
            }
        }
        anime_trie.sort(compare);

        var ul = document.getElementById("bloc-resultats");
        var j = 0;
        totalPos = Math.floor(anime_trie.length / 4);
        myPos = 0;

        for (var i = 0; i < anime_trie.length; i += 4) {

            if (i + 1 < anime_trie.length) {
                var title2 = (anime_trie[i + 1].title ? anime_trie[i + 1].title : "Unknown");
                var img2 = (anime_trie[i + 1].image_url ? anime_trie[i + 1].image_url : "images/img_vide.jpg");
                var res2 = `<a class="card_anime" href="javascript:launchFav('` + title2 + `')" >
					  <div class="card_image">
					  <img class="season_image" src="` + img2 + `" alt="` + title2 + `">
					  </div>
					  <div class="card_name">
					  <span class="card_titre">` + title2 + `</span>
					  </div>
					  </a>`;
            } else {
                var res2 = ""
            }
            if (i + 2 < anime_trie.length) {
                var title3 = (anime_trie[i + 2].title ? anime_trie[i + 2].title : "Unknown");
                var img3 = (anime_trie[i + 2].image_url ? anime_trie[i + 2].image_url : "images/img_vide.jpg");
                var res3 = `<a class="card_anime" href="javascript:launchFav('` + title3 + `')" >
					  <div class="card_image">
					  <img class="season_image" src="` + img3 + `" alt="` + title3 + `">
					  </div>
					  <div class="card_name">
					  <span class="card_titre">` + title3 + `</span>
					  </div>
					  </a>`;
            } else {
                var res3 = ""
            }
            if (i + 3 < anime_trie.length) {
                var title4 = (anime_trie[i + 3].title ? anime_trie[i + 3].title : "Unknown");
                var img4 = (anime_trie[i + 3].image_url ? anime_trie[i + 3].image_url : "images/img_vide.jpg");
                var res4 = `<a class="card_anime" href="javascript:launchFav('` + title4 + `')" >
					  <div class="card_image">
					  <img class="season_image" src="` + img4 + `" alt="` + title4 + `">
					  </div>
					  <div class="card_name">
					  <span class="card_titre">` + title4 + `</span>
					  </div>
					  </a>`;
            } else {
                var res4 = ""
            }


            var title1 = (anime_trie[i].title ? anime_trie[i].title : "Unknown");
            var img1 = (anime_trie[i].image_url ? anime_trie[i].image_url : "images/img_vide.jpg");
            var res =
                `<li class="saison">
			<a class="card_anime" href="javascript:launchFav('` + title1 + `')" >
			  <div class="card_image">
				<img class="season_image" src="` + img1 + `" alt="` + title1 + `">
			  </div>
			  <div class="card_name">
				<span class="card_titre">` + title1 + `</span>
			  </div>
			</a>
			` + res2 + `
			` + res3 + `
			` + res4 + `
		  </li>`;

            $("#beforeMe").before(res);

        }

    });
}

function getSeason() {
    var month = new Date().getMonth() + 1;
    season = '';
    switch (month) {
        case 12:
        case 1:
        case 2:
            season = 'winter';
            break;
        case 3:
        case 4:
        case 5:
            season = 'spring';
            break;
        case 6:
        case 7:
        case 8:
            season = 'summer';
            break;
        case 9:
        case 10:
        case 11:
            season = 'fall';
            break;
    }
}

function compare(a, b) {
    if (a.members > b.members) {
        return -1;
    }
    return 0;
}




$("#btn-lancer-recherche").click(function() {
    if (timerTampon) {
        if (!shakeOn) {

            shakeOn = true;
            $("#shakeError").show();
            setTimeout(function() { shakeOn = false; }, 1000)
            setTimeout(function() { $("#shakeError").hide(); }, 3000)
            shake();
        }
        return;
    } else {
        timerTampon = true;
        setTimeout(function() { timerTampon = false }, 1000)
    }
    if ($("#search_input").val()) {
        $.getJSON(base_url + "search/anime?q=" + $("#search_input").val(), function(anime) {
            reset();
            totalPos = 49;
            myPos = 0;
            jQuery.each(anime.results, function() {
                var res =
                    `<li class="element">
			  <a class="favOff" href="javascript:addFav('` + (this.title ? this.title : "??????") + "','" + (this.image_url ? this.image_url : "images/img_vide.jpg") + `');" ><img src="images/etoileOff.png" alt="Etoile vide" width=50 ></a>
			  <a href="` + (this.url ? this.url : "") +
                    `"><div class="titre">
				  <span>` + (this.title ? this.title : "??????") + `</span>
				</div>
				<section class="sec1">
				  <div class="imgAnime">
					<img src="` + (this.image_url ? this.image_url : "images/img_vide.jpg") + `" alt="` + (this.title ? this.title : "") +
                    `"></div>
				  <div class="inform">
					<p><span>Type : </span>` + (this.type ? this.type : "Unknown") + `</p>
					<p><span>Episodes : </span>` + (this.episodes ? this.episodes : "Unknown") + `</p>
					<p><span>Score : </span>` + (this.score ? this.score : "Unknown") + `</p>
					<p><span>Members : </span>` + (this.members ? this.members : "Unknown") + `</p>
					<p><span>Rated : </span>` + (this.rated ? this.rated : "Unknown") + `</p>
				  </div>
				</section>
				<section class="sec2">
				  <span>Synopsis :</span>
				  <p>` + (this.synopsis ? this.synopsis : "No synopsis") + `</p>
				</section>
				<section class="sec3">
				  <p><span>Date : </span>` + (this.start_date ? this.start_date.slice(0, -15) : "Unknown") + " / " + (this.end_date ? this.end_date.slice(0, -15) : "Unknown") + `</p>
				  <p><span>Airing : </span>` + (this.airing ? "Yes" : "No") + `</p>
				</section>
			  </a>
			</li>`
                $("#beforeMe").before(res);
            });
        });
    } else {
        saisonAPI();
    }
});


$("#btn-left").click(function() {
    if (anim) {
        return;
    }
    anim = true;
    var cssValue = $('#bloc-resultats').css('right');
    var parsedCssValue = parseInt(cssValue);
    if (myPos != 0) {
        parsedCssValue -= 600;
        if (myPos == 1) {
            $("#bloc-resultats").animate({ right: String(parsedCssValue) + "px" }, function() { anim = false; });
            $('#img_scroll_left').hide(500);
        }
        if (myPos == totalPos) {
            $("#bloc-resultats").animate({ right: String(parsedCssValue) + "px" }, function() { anim = false; });
            $('#img_scroll_right').show(500);
        } else {
            $("#bloc-resultats").animate({ right: String(parsedCssValue) + "px" }, function() { anim = false; });
        }
        myPos--;
    }
});

$("#btn-right").click(function() {
    if (anim) {
        return;
    }
    anim = true;
    var cssValue = $('#bloc-resultats').css('right');
    var parsedCssValue = parseInt(cssValue);
    parsedCssValue += 600;
    if (myPos == 0) {
        $("#bloc-resultats").animate({ right: String(parsedCssValue) + "px" }, function() { anim = false; });
        $('#img_scroll_left').show(500);
    }
    if (myPos > totalPos - 2) {
        $("#bloc-resultats").animate({ right: String(parsedCssValue) + "px" }, function() { anim = false; });
        $('#img_scroll_right').hide(500);
    } else {
        $("#bloc-resultats").animate({ right: String(parsedCssValue) + "px" }, function() { anim = false; });
    }
    myPos++;
});

$("#btn-left-fav").click(function() {
    if (anim) {
        return;
    }
    anim = true;
    var cssValue = $('#liste-favoris').css('right');
    var parsedCssValue = parseInt(cssValue);
    if (myPosFav != 0) {
        parsedCssValue -= 297;
        if (myPosFav == 2) {
            $("#liste-favoris").animate({ right: String(parsedCssValue) + "px" }, function() { anim = false; });
            $('#img_scroll_left-fav').hide(500);
        }
        if (myPosFav == totalPosFav - 1) {
            $("#liste-favoris").animate({ right: String(parsedCssValue) + "px" }, function() { anim = false; });
            $('#img_scroll_right-fav').show(500);
        } else {
            $("#liste-favoris").animate({ right: String(parsedCssValue) + "px" }, function() { anim = false; });
        }
        myPosFav--;
    }
});

$("#btn-right-fav").click(function() {
    if (anim) {
        return;
    }
    anim = true;
    var cssValue = $('#liste-favoris').css('right');
    var parsedCssValue = parseInt(cssValue);
    parsedCssValue += 297;
    if (myPosFav == 1) {
        $("#liste-favoris").animate({ right: String(parsedCssValue) + "px" }, function() { anim = false; });
        $('#img_scroll_left-fav').show(500);
    }
    if (myPosFav == totalPosFav - 2) {
        $("#liste-favoris").animate({ right: String(parsedCssValue) + "px" }, function() { anim = false; });
        $('#img_scroll_right-fav').hide(500);
    } else {
        $("#liste-favoris").animate({ right: String(parsedCssValue) + "px" }, function() { anim = false; });
    }
    myPosFav++;
});


$("#search_input").on('keyup', function(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        $("#btn-lancer-recherche").click();
    }
});

function shake() {
    var div = $("#shake");
    var interval = 100;
    var distance = 10;
    var times = 4;

    for (var iter = 0; iter < (times + 1); iter++) {
        $(div).animate({
            left: ((iter % 2 == 0 ? distance : distance * -1))
        }, interval);
    }
    $(div).animate({ left: 0 }, interval);
}