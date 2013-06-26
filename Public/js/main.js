myGoals = [];
myScore = 0;
myTime = 120;
myProgress = 0;

// A $( document ).ready() block.
$( document ).ready(function() {
	makeHandlers();
    updateStats();
    $("#btnSeeRoute").hide();
    $('#modalEndpoint').modal("show");
    
});

function updateStats(){
    $("#lblScore").text("Score: " + myScore);
    $("#lblTime").text("Time: " + myTime);
    $("#lblProgress").text("Progress: " + myProgress);
}

function updateTime(){
    myTime -= 1;
    updateStats();
}

function loadNextPage(theURL){
    $("#theFrame").attr("src",theURL);

}

function httpGet(theURL){
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET","/api/fetchpage?url="+theUrl,false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function makeHandlers(){

    $('a').click(function(e) {
        e.preventDefault();
        var href = $(this).attr('href');
        var title = $(this).attr('title');
        loadNextPage(href);
    });

	$("#btnSeeRoute").click(function(){
    	$('#modalEndpoint').modal("hide");
        for(var x in myGoals){
            $("#listModal").append('<li class="goalList generalColor">'+myGoals[x]["name"]+'</li>');
            $("#listGoals").append('<li class="goalList generalColor">'+myGoals[x]["name"]+'</li>');
        }
    	$("#modalMission").modal("show");
    });

    $("#btnPlay").click(function(){
    	$("#modalMission").modal("hide");
        window.setInterval(updateTime,1000);
        $("#frmWeb").attr("src",myGoals[0]["url"]);
        loadNextPage(myGoals[0]["url"]);
    });

    $("#btnFindEndpoint").click(function(){
        $.getJSON("goals.json",
            function(data){
                if(data["success"] == "true"){
                    $("#lblEndpt").text("Found Endpoint! Click to see mission!");
                    myGoals = data["goals"];
                    $("#btnSeeRoute").show();
                }
                else{
                    $("#lblEndpt").text("Could not find Endpoint, try again");   
                }
            });
    });
}

