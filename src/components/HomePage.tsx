import { useState, useEffect, ChangeEvent } from "react"
import { nanoid } from "nanoid"
import QuizApiResponseObject from "../models/QuizQuestions"

interface LandingPageProps {
  startQuiz: () => void
  setAllQuestions: React.Dispatch<React.SetStateAction<QuizApiResponseObject[]>>
  fetchQuestions: () => void
  apiParameters: {
    sessionToken: string;
    amount: number;
    categoryID: string;
    difficulty: string;
    questionType: string;
  }
  setApiParameters: React.Dispatch<React.SetStateAction<{
    sessionToken: string;
    amount: number;
    categoryID: string;
    difficulty: string;
    questionType: string;
  }>>
  categoryIndex: Array<{
    id: string
    name: string
  }>
  playAgain: boolean
}

export default function HomePage({
  startQuiz,
  setAllQuestions,
  playAgain,
  fetchQuestions,
  apiParameters,
  setApiParameters,
  categoryIndex
}: LandingPageProps) {

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.currentTarget
    setApiParameters(oldParameters => {
      return { ...oldParameters, [name]: value }
    })
  }

  const categorySelectOptions = categoryIndex.map((category) =>
    <option key={nanoid()} value={category.id}>{category.name}</option>
  )

  return (
    <section  >
      <h1 className="title">Quizzical</h1>
      <div className="settings">
        <div className="setting">
          <label htmlFor="number-select">How many questions?</label>
          <select
            id="number-select"
            value={apiParameters.amount}
            onChange={handleChange}
            name="amount"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>

        <div className="setting">
          <label htmlFor="difficulty-select">What difficulty?</label>
          <select id="difficulty-select"
            value={apiParameters.difficulty}
            onChange={handleChange}
            name="difficulty"
          >
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </div>

        <div className="setting">
          <label htmlFor="category-select">What category?</label>
          <select id="category-select"
            value={apiParameters.categoryID}
            onChange={handleChange}
            name="categoryID"
          >
            {categorySelectOptions}
          </select>
        </div>
      </div>

      <p className="description">press this button to get questions with more buttons to press for answers!!</p>
      <button className='quiz-button' onClick={startQuiz}>Start quiz</button>
    </section >
  )
}