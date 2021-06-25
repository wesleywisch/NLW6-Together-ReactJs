import { useParams, useHistory } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import themeImg from '../assets/images/theme.png';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question/Question';

// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { useTheme } from '../hooks/useTheme';

import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
    id: string;
}

export function AdminRoom(){
    // const { user } = useAuth()
    const { theme, toggleTheme } = useTheme();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id

    const { title, questions } = useRoom(roomId)

    console.log(questions)

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm('Tem certeza que você deseja excluir essa pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
    }

    async function handleHighLightQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
    }

    return(
        <div id="page-room" className={theme}>
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <div className="alternativeTheme">
                <img src={themeImg} alt="Mudar o tema da página" onClick={toggleTheme} />
            </div>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                {questions.map(question =>{
                    return(
                        <Question
                        key={question.id} 
                        content={question.content}
                        author={question.author}
                        isAnswered={question.isAnswered}
                        isHighlighted={question.isHighlighted}
                        >

                           {!question.isAnswered && (
                            <>
                               <button
                               type="button"
                               onClick={() => handleCheckQuestionAsAnswered(question.id)}
                               >
                                   <img src={checkImg} alt="Marcar pergunta como respondida" />
                                </button> 
    
                                <button
                               type="button"
                               onClick={() => handleHighLightQuestion(question.id)}
                               >
                                   <img src={answerImg} alt="Dar destaque á pergunta" />
                                </button>
                            </>
                           )} 

                            <button
                           type="button"
                           onClick={() => handleDeleteQuestion(question.id)}
                           >
                               <img src={deleteImg} alt="Deletar pergunta" />
                            </button> 
                        </Question>
                    )
                })}
                </div>
            </main>
        </div>
    )
}