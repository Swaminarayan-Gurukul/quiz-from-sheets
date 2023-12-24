var scriptURL = "https://script.google.com/macros/s/AKfycbzVsQBrFJ1gOkBwE_9zAp6lQgvXZcTf_glyEabqj-iHA5r1BgL5-vekgCXnW0yN--8/exec";

const resultAnalysis = document.getElementById('result-analysis')
const retakeQuizContainer = document.getElementById('retake-quiz-container')
const loadingContainer = document.getElementById('loading-container')
var quizeStore = localStorage;

fetchResults();

function displayAllResults(results){
    resultsJson = JSON.parse(results);
    // Sort the array by the second element
    resultsJson.sort((a, b) => b[2] - a[2]);

    leaderResults = resultsJson.slice(0,3);
    // runnersUpResults = resultsJson.slice(3);
    runnersUpResults = resultsJson;
    displayLeaderBoard(leaderResults);
    displayRunnerUps(runnersUpResults);
    // Print the sorted array
    console.log(runnersUpResults);
};

function displayLeaderBoard(result){
    let finalHTML = "Quiz is not started...";
    if( result.length ) { 
        console.log(result)
        finalHTML = ` <div class="title text-center my-5">
        <h2>Leader Board 🙂</h2>
      </div><div class="card-group">`;

        for( let i = 0; i < result.length; i++ ) {
            finalHTML +=`<div class="card">
            <img src="https://www.svgrepo.com/show/304743/trophy-first.svg" class="card-img-top" alt="...">
            <div class="card-body">
                <h3 class="card-title">${result[i][1]}</h3>
                <h4 class="card-title">${result[i][2]}</h4>
                <p class="card-text"><small class="text-muted">Number ${i+1}</small></p>
            </div>
            </div>`    
        }
        
        
        finalHTML += `</div>`
    }
    let leaderBoard = document.querySelector('.leader-board');
    console.log(leaderBoard)
    leaderBoard.innerHTML = finalHTML;
}

function displayRunnerUps(result){
    var finalHTML = "Quiz is not started...";
    if( result.length ) { 
        console.log(result)
        finalHTML = "<tr><td>SR. No</td><td>Name</td><td>Score</td></tr>";

        for( let i = 0; i < result.length; i++ ) {
            finalHTML +=`<tr><td>${i}</td><td>${result[i][1]}</td><td>${result[i][2]}</td></tr>`    
        }
    }
    var leaderBoard = document.querySelector('#runner-up-results');
    console.log(leaderBoard)
    leaderBoard.innerHTML = finalHTML;
}

function fetchResults(){
    /**
     * TODO : remove this script
     */
    let demo = scriptURL+'?action=result&callback=displayAllResults';

    // displayAllResults( '[[1,"Ronak Vanpariya","2"],[2,"Sahajanad Digital","3"],[3,"Sahajanad Digital 1","23"],[4,"Sahajanad Digital 3","10"]]' );
    // return;

    var request = jQuery.ajax({
        crossDomain: true,
        url: demo,
        method: "GET",
        dataType: "text",
        success : function( e ){
            //console.log(e);
            displayAllResults(e);

        },
        error: function( xhr,e ){
            console.log(xhr);
            console.log(e);
        },
    });
}
// resultAnalysis.innerHTML = 