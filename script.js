var scriptURL = "https://script.google.com/macros/s/AKfycbznmIT9u4xUDLTe08GXBoHtlEgDQ9-dvfU-GzILrQbgA4QCZTlmk_PemCughi_5ZLbi/exec";
/**
 * Initializations
 */
var startBtn =  document.getElementById('js-start-quiz');
var quizContainer = document.getElementById('quiz-container');
var startContainer = document.getElementById('start-container');
var loadingContainer = document.getElementById('loading-container');
var resultContainer = document.getElementById('result-container');
var question = document.getElementById('question');
var answers = document.getElementById('answers');
var questionIndex = document.getElementById('question-index');
var questionsAnswers;
var quizeStore = localStorage;

/**
 * Adding Event Listners
 */
answersElement = Array.from(document.querySelectorAll('#answers a')).map(function(element){
    element.addEventListener('click', setNextQuestion);
}); 
startBtn.addEventListener('click',startQuiz);

function startQuiz(){
    var code = document.getElementById('passcode').value;
    if( !validateCode( code ) ) {
        alert( 'સાચો કોડ એન્ટર કરો / Please enter Valid Code' )
    } else {
        startContainer.classList.toggle('d-none');
        loadingContainer.classList.toggle('d-none');
        quizeStore.setItem('selectedAnswers',JSON.stringify([]));
        fetchQuizQuestions();
    }
}

function fetchQuizQuestions(){
    /**
     * TODO : remove this script
     */
    let demo = scriptURL+'?action=quiz&callback=showQuestion';

    var request = jQuery.ajax({
        crossDomain: true,
        url: demo,
        method: "GET",
        dataType: "text",
        success : function( data ){
            function shuffle(array) {
                for (var i = array.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
                return array;
            }
            var questionsData = JSON.parse(data);
            var questionsDataJSON = JSON.parse(questionsData);
            questionsDataJSON = shuffle(questionsDataJSON);
            showQuestion( JSON.stringify(questionsDataJSON) );
        },
        error: function( xhr,e ){
            console.log(e);
        },
    });
}

function setNextQuestion(event){
    let currentQuestionIndex = parseInt(questionIndex.innerHTML);
    let selectedAnswer = event.target.id;
    if( (questionsAnswers.length) > (currentQuestionIndex) ){
        saveAnswer(selectedAnswer);
        setQuestion(currentQuestionIndex);
    } else {
        saveAnswer(selectedAnswer);
        showResult();
    }
}

function setQuestion(index){
    let currentQuestion = questionsAnswers[index];
    questionIndex.innerHTML = ++index;
    question.innerHTML = currentQuestion.question;
    document.getElementById('answer1').innerHTML = currentQuestion.answer1;
    document.getElementById('answer2').innerHTML = currentQuestion.answer2;
    document.getElementById('answer3').innerHTML = currentQuestion.answer3;
    document.getElementById('answer4').innerHTML = currentQuestion.answer4;

    loadingContainer.classList.add('d-none');
    quizContainer.classList.remove('d-none');
}

function showQuestion(questions){
    /**
     * Internal Cachig for development
     */
    quizeStore.setItem('quiz', JSON.stringify(questions));
    /*** */
    questionsAnswers = JSON.parse(questions);
    setQuestion(0);
}

function showResult(){
    quizContainer.classList.add('d-none');
    let result = document.querySelector('#result-container #result');
    let _calculatedScore = calculateResults();

    result.innerHTML = _calculatedScore;
    resultContainer.classList.remove('d-none');

    sendResultToDatabase();
}

function calculateResults(){
    let _questionsAnswers = questionsAnswers;
    let _rightAnswers = getTotalScore();
    return _rightAnswers+' / '+_questionsAnswers.length ;
}

function getTotalScore() {
    let _questionsAnswers = questionsAnswers;
    let _rightAnswers = 0;
    let _localAnswer = JSON.parse(quizeStore.getItem('selectedAnswers'));
    _questionsAnswers.map( function( answers, index ){
        if( 'answer'+answers.RightAnswer ==  _localAnswer[index] ){
            _rightAnswers++;
        }
    });
    return _rightAnswers;
}

function saveAnswer(selectedAnswer){
    let localAnswer;
    if( ! quizeStore.getItem('selectedAnswers') ){
        localAnswer = [];
    } else {
        localAnswer = JSON.parse(quizeStore.getItem('selectedAnswers'));
    }
    localAnswer.push(selectedAnswer);
    quizeStore.setItem('selectedAnswers',JSON.stringify(localAnswer));
}

function sendResultToDatabase(){
    let userToken = quizeStore.getItem('token');
    const sendObject = {
        'token': userToken,
        'action': 'result',
        'score': getTotalScore(),
    }

    console.log(sendObject);

    sendResultToGoogleSheet(sendObject)
} 

function sendResultToGoogleSheet(formData) {
    // var form_data = new FormData();

    // for ( var key in formData ) {
    //     form_data.append(key, formData[key]);
    // }
    let ajaxRequest = function(formData){
        // user = { data : user };
        $.ajax({
            type: "POST",
            url: scriptURL,
            async: true,
            data: formData,
            headers: {
                // 'Content-Type': 'text/plain;charset=utf-8',
                'Content-type': 'application/x-www-form-urlencoded',
                // 'Content-type': 'application/json',
            },
            beforeSuccess: function(){
                
            },
            success: function (data)
            {
                dataJson = JSON.parse(data);
                $('#commonModal .modal-body').text(dataJson.result)
                $('#commonModal').modal('show')

            }
        });
    } 
    ajaxRequest(formData);
}

function validateCode( enteredCode ) {
    var date = new Date();
    var code = date.getFullYear() + (date.getMonth() + 1) + date.getDate();

    if( enteredCode == code ) {
        return true;
    }

    return false;
}