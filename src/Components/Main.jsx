import { useEffect } from "react"
import {useState} from "react"


export default function Main(){
    const [DataStorage,setDataStorage] =useState([])
    

    useEffect(()=>{

    fetch('https://opentdb.com/api.php?amount=4&category=9&difficulty=medium&type=multiple')
    .then(res=>res.json())
    .then(data=>setDataStorage(data.results))
    .catch(err=> console.log(err))

    },[]) 


    const questionsArr = DataStorage.map(n=>n.question)
    const correctAnswer = DataStorage.map(n=>n.correct_answer)

    const allAnswershuffle = DataStorage.map(n=>{
        const correct = n.correct_answer
        const wrong = n.incorrect_answers
        const allAns = [...wrong,correct]

        for (let i = allAns.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [allAns[i], allAns[j]] = [allAns[j], allAns[i]];
        }

         return allAns
    })

    const render = questionsArr.map((question, questionIndex) => {
    return (
        <section key={questionIndex} className="question-container">
            <p>{question}</p>

            
                {allAnswershuffle[questionIndex].map((answer, answerIndex) => (
                   <label key={answerIndex}><input type="radio" name={question}/>{answer}</label> 
                ))}
            
        </section>
    )
})


    return (
        <main>
           {render} 
        </main>
    )
}