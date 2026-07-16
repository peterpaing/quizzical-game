import { useState, useEffect } from "react" ;
import clsx from 'clsx';
import {decode} from 'html-entities';

export default function Main(){
    const [DataStorage,setDataStorage] =useState([]);
    const [shuffleData , setShuffleData]= useState([])
    const [answered , setAnswered] = useState([]);
    const [showResult , setShowResult] = useState(false)
    
    useEffect(()=>{

        const fetchData = async () => {
            try {
                const response = await fetch('https://opentdb.com/api.php?amount=4&category=9&difficulty=easy&type=multiple');    
                const data = await response.json() || [];
                const decodedResults = data.results.map(question => ({
                    ...question,
                    question: decode(question.question),
                    correct_answer: decode(question.correct_answer),
                    incorrect_answers: question.incorrect_answers.map(answer =>
                        decode(answer)
                    )
                }));

                setDataStorage(decodedResults);
                const allAnswershuffle = decodedResults.map(n=>{
                const correct = n.correct_answer ;
                const wrong = n.incorrect_answers ;
                const allAns = [...wrong,correct];

                for (let i = allAns.length - 1; i > 0; i--) {

                    const j = Math.floor(Math.random() * (i + 1));

                    [allAns[i], allAns[j]] = [allAns[j], allAns[i]];
                }

         return allAns;
        })      
                setShuffleData(allAnswershuffle)
                }catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
    },[]) 

    const questionsArr = DataStorage.map(n=>n.question);

    const render = questionsArr.map((question, questionIndex) => {
    return (
        <section key={questionIndex} className="question-container">
            <fieldset  aria-describedby={
                showResult ? `question-feedback-${questionIndex}` : undefined
            }>

            <legend>{question}</legend>
            {shuffleData[questionIndex].map((answer, answerIndex) => (

                   <label key={answerIndex}
                    className={clsx((showResult&& answered[questionIndex] !== DataStorage[questionIndex].correct_answer) &&
                        answered[questionIndex]=== answer ? 'incorrect' : null
                    )}

                   ><input type="radio" name={questionIndex}
                    value={answer}
                   disabled={showResult}
                   />{answer}

                   </label> 

                ))}

                {showResult?
                 <p id={`question-feedback-${questionIndex}`} className="sr-only">
                    {DataStorage[questionIndex].correct_answer === answered[questionIndex]?
                      'Your answer is correct.' :
                     `Your answer is incorrect . Correct answer is ${DataStorage[questionIndex].correct_answer}`}
                    </p> : ''}

                </fieldset>
        </section>
    )
})

        function formCheck(formData) {
        const userAns = Object.fromEntries(formData);
        setAnswered(userAns);
        setShowResult(true);
    }


    const correctCount = DataStorage.filter(
    (question, index) => answered[index] === question.correct_answer
    ).length;
    
    
    return (
        <main>
            <form action={formCheck}>
           {render} 
           <button type="submit">Check Answer </button>
           </form>
        </main>
    )
}