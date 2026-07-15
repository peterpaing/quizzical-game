import { use, useEffect } from "react" ;
import {useState} from "react" ;


export default function Main(){
    const [DataStorage,setDataStorage] =useState([]);
    const [answered , setAnswered] = useState([]);
    
    useEffect(()=>{

        const fetchData = async () => {
            try {
                const response = await fetch('https://opentdb.com/api.php?amount=4&category=9&difficulty=medium&type=multiple');    
                const data = await response.json() || [];
                setDataStorage(data.results);
            }catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
},[]) 


    const questionsArr = DataStorage.map(n=>n.question);
    
    const allAnswershuffle = DataStorage.map(n=>{
        const correct = n.correct_answer ;
        const wrong = n.incorrect_answers ;
        const allAns = [...wrong,correct];

        for (let i = allAns.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [allAns[i], allAns[j]] = [allAns[j], allAns[i]];
        }

         return allAns;
    })

    const render = questionsArr.map((question, questionIndex) => {
    return (
        
        <section key={questionIndex} className="question-container">
            <p>{question}</p>
            {allAnswershuffle[questionIndex].map((answer, answerIndex) => (
                   <label key={answerIndex}><input type="radio" name={questionIndex} value={answer}/>{answer}</label> 
                ))}
        </section>
    )
})

        function formCheck(formData) {
        const userAns = Object.fromEntries(formData);
        setAnswered(userAns);
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