const question = document.getElementById("question")
const choices = Array.from(document.getElementsByClassName("choice-text"))
const progressText = document.getElementById('progressText')
const scoreText = document.getElementById('score')
const progressBarFull = document.getElementById('progressBarFull')
const loader = document.getElementById('loader')
const game = document.getElementById('game-hidden')
const history = document.getElementById('history')
const historyImg = document.getElementById('history-img')
const gameQuestion = document.getElementById('game')
const gameHistory = document.getElementById('history-div')
const level = document.getElementById('level')

let currentQuestion = {}
let acceptAnswers = false
let score = 0
let questionCounter = 0
let availableQuestions = []

let questions = []

let lvl = 'level1'

gameStart = lvl => {
    const jsonQuestion = ["database/questions.json"]

    fetch(
        jsonQuestion
        // "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
    )
        .then(res => {
            return res.json()
        })
        .then(loadedQuestions => {

            console.log("LEVEL",loadedQuestions)

            console.log(lvl)
    
            questions = loadedQuestions[lvl]['questions']
            console.log("QUESTIONS", questions)
        
            historys = loadedQuestions[lvl]['historys']
            console.log("HISTORYS", historys)
        
            startGame()
    
        })
        .catch(err => {
            console.log(err)
        })
}

// CONSTANTES
const CORRECT_BONUS = 10
const MAX_QUESTIONS = 5

startGame = () => {
    questionCounter = 0
    score = 0
    availableQuestions = [ ... questions];
    
    console.log(availableQuestions[0])

    
    // history.classList.remove('hidden')
    // history.classList.add('hidden')

    getNewQuestion()
    // history.innerText = historys[0].history
    // showHistoryImage(historys[0].image)
    game.classList.remove('hidden')
    gameQuestion.classList.remove('hidden')
    loader.classList.add('hidden')
}

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score)
        // go to the end page
        return window.location.assign("/end.html")
    }
    questionCounter++
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`

    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`

    const questionIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionIndex]
    
    console.log("QUESTION SELECTED", currentQuestion) //teste

    question.innerText = currentQuestion.question

    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number];
    })

    availableQuestions.splice(questionIndex, 1)

    acceptAnswers = true
}

removeGameHidden = e => {
    e.preventDefault();
    gameQuestion.classList.remove('hidden')
    gameHistory.classList.add('hidden')
}

// showHistory = () => {
//     history = loadedQuestions.level1.historys
//     console.log(history)
// }

// showHistoryImage = (image) => {
//     historyImg.src = "static/images/questions/" + image;
// }

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptAnswers) return

        acceptAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset["number"]

        // const classToApply = 'incorrect'
        // if (selectedAnswer == currentQuestion.answer) {
        //     classToApply = 'correct'
        // }

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        if(classToApply === 'correct') {
            incrementScore(CORRECT_BONUS)
        }

        selectedChoice.parentElement.classList.add(classToApply)

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()
        }, 1000)
    })
})

incrementScore = num => {
    score += num
    scoreText.innerText = score
}

selectedGameLevel = lvl => {
    level.classList.add('hidden')
    // gameHistory.classList.add('hidden')
    gameStart(lvl)
}