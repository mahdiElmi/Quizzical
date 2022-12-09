import { nanoid } from "nanoid";
import { useState, useEffect, ReactNode } from "react"
import QuizApiResponseObject from "../models/QuizQuestions"
import HomePage from "../components/HomePage"


interface QuizProps {
  allQuestions: QuizApiResponseObject[],
  restartGame: (e: React.FormEvent, setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>) => void,
  inputs: {},
  setInputs: React.Dispatch<React.SetStateAction<{}>>,
  answerIndexes: number[],
  score: number,
  setScore: React.Dispatch<React.SetStateAction<number>>,
  apiParameters: {
    sessionToken: string;
    amount: number;
    categoryID: string;
    difficulty: string;
    questionType: string;
  }
}

export default function Quiz({
  allQuestions,
  restartGame,
  inputs,
  setInputs,
  answerIndexes,
  score,
  setScore,
  apiParameters
}: QuizProps): JSX.Element {

  const [isSubmitted, setIsSubmitted] = useState(false)
  // console.log({ allQuestions, inputs })


  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget
    setInputs(oldInputs => {
      return { ...oldInputs, [name]: value }
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const correctAnswers = allQuestions.map(question => decodeURIComponent(question.correct_answer))
    setIsSubmitted(true)
    console.log({ correctAnswers })
    let score = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
      correctAnswers[i] === inputs[i + 1 as keyof typeof inputs] && score++;
    }
    setScore(score)
  }

  const questionElements = allQuestions.map((questionObj: QuizApiResponseObject, index) => {
    let decodedAnswers = questionObj.incorrect_answers.map(
      incorrect_answer => decodeURIComponent(incorrect_answer)
    )
    const decodedCorrectAnswer = decodeURIComponent(questionObj.correct_answer)
    decodedAnswers.splice(answerIndexes[index], 0, decodedCorrectAnswer)

    const answerElements = decodedAnswers.map((answer, idx) => {
      const queryableIndex = index + 1 as keyof typeof inputs
      const labelClasses = `answer-button ${isSubmitted ? "disabled" : ""} 
      ${isSubmitted && decodedAnswers[idx] === decodedCorrectAnswer ? " correct" : ""} 
      ${isSubmitted && decodedAnswers[idx] === inputs[queryableIndex] ? "incorrect" : ""}`

      return (<div key={nanoid()} className="answer">
        <input
          onChange={handleChange}
          type="radio"
          name={`${index + 1}`}
          value={decodedAnswers[idx]}
          checked={inputs[queryableIndex] === decodedAnswers[idx]}
          id={decodedAnswers[idx]} />
        <label
          className={labelClasses}
          htmlFor={decodedAnswers[idx]}>{decodedAnswers[idx]}
        </label>
      </div>)
    })

    return (
      <div key={nanoid()} className="question" >
        <p className="question-text">{decodeURIComponent(questionObj.question)}</p>
        <div className="answers">
          {answerElements}
        </div>
        <hr />
      </div>
    )
  })


  return (
    <form className="quiz">
      {allQuestions.length === 0 ?
        <div className="loading">
          <h1 className="loading-text">Fetching Questions</h1>
          <div className="loading-animation"><div></div><div></div><div></div><div></div></div>
        </div>
        :
        <button className="homepage-button">Back to Home</button>
      }

      {questionElements}
      <div className="score-and-button">
        {isSubmitted && <span className="score-text">You scored {score}/{apiParameters.amount} correct answers</span>}
        {!isSubmitted ?
          <button type="submit" className="check-answer-button" disabled={allQuestions.length === 0} onClick={handleSubmit}>Check answers</button>
          :
          <button className="check-answer-button" onClick={(e) => restartGame(e, setIsSubmitted)}>Play again</button>
        }
      </div>



    </form>
  )
}