import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import HomePage from "./components/HomePage"
import Quiz from "./components/Quiz"
import QuizApiResponseObject from "./models/QuizQuestions"


function App(): JSX.Element {
  const [homePage, setHomePage] = useState(true);
  const [allQuestions, setAllQuestions] = useState<QuizApiResponseObject[]>([])
  const [playAgain, setPlayAgain] = useState(false);
  const [categoryIndex, setCategoryIndex] = useState(JSON.parse(localStorage.getItem("categoryIndex")!) || []);
  const [apiParameters, setApiParameters] = useState({
    sessionToken: "",
    amount: 5,
    categoryID: "9",
    difficulty: "medium",
    questionType: "multiple&encode",
  })
  const [inputs, setInputs] = useState({})
  const [answerIndexes, setAnswerIndexes] = useState(getRandomNumbers())
  const [score, setScore] = useState(0)

  function getRandomNumbers(): number[] {
    const randomArray: number[] = []
    for (let i = 0; i < apiParameters.amount; i++) {
      randomArray.push(Math.floor(Math.random() * 4))
    }
    return randomArray
  }

  function fetchQuestions() {
    fetch(`https://opentdb.com/api.php?
    token=${apiParameters.sessionToken}&
    amount=${apiParameters.amount}&
    category=${apiParameters.categoryID}&
    difficulty=${apiParameters.difficulty}&
    type=${apiParameters.questionType}&
    encode=url3986`)
      .then((res) => res.json())
      .then((data) => setAllQuestions(data.results))
  }

  useEffect(() => {
    fetch("https://opentdb.com/api_token.php?command=request")
      .then((res) => res.json())
      .then((data) => setApiParameters(oldParameters => ({ ...oldParameters, sessionToken: data.token })))
  }, [])
  useEffect(() => {
    if (categoryIndex.length) return;
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("categoryIndex", JSON.stringify(data.trivia_categories))
        setCategoryIndex(data.trivia_categories)
      })
  }, [])


  useDidMountEffect(() => {
    fetchQuestions();
  }, [playAgain, homePage])


  function startQuiz() {
    setHomePage(false)
  }

  function restartGame(e: React.FormEvent, setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>) {
    e.preventDefault()
    setPlayAgain(prevState => !prevState)
    setAllQuestions([])
    setInputs({})
    setAnswerIndexes(getRandomNumbers())
    setIsSubmitted(false)
  }

  return (
    <main className="App">
      {homePage ?
        <HomePage startQuiz={startQuiz}
          fetchQuestions={fetchQuestions}
          setAllQuestions={setAllQuestions}
          apiParameters={apiParameters}
          setApiParameters={setApiParameters}
          playAgain={playAgain}
          categoryIndex={categoryIndex}
        /> :
        <Quiz
          allQuestions={allQuestions}
          restartGame={restartGame}
          inputs={inputs}
          setInputs={setInputs}
          answerIndexes={answerIndexes}
          score={score}
          setScore={setScore}
          apiParameters={apiParameters}
        />}
    </main>
  )
}

const useDidMountEffect = (func: React.EffectCallback, deps: React.DependencyList) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
}

export default App
