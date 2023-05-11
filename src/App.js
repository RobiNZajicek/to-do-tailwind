import React from 'react'
import { useState,useEffect } from 'react'
import {projectFirestore} from "./firebase/config"
import { FaTrashAlt } from 'react-icons/fa';
import { FaRegThumbsUp } from 'react-icons/fa';
import Modal from "react-modal"
import { GiHourglass } from "react-icons/gi";
const App = () => {

    const[task,setTask]=useState("")
    const[allTasks,setAllTasks]=useState([])
    const[error,setError]=useState("")
    const [finished,setFinished]=useState("")
    const[bgColor,setBgcolor]=useState("white")
    const[show,setShow]=useState(false)
    const [difficulty, setDifficulty] = useState('');

    useEffect(()=>{
      const sub=projectFirestore.collection("todo").onSnapshot((snap)=>{
          if(snap.empty){
            setError("")
            setAllTasks([])
          }else{
            let result=[]
            snap.docs.forEach((oneTask)=>{
              result.push({id: oneTask.id,...oneTask.data()})
            })
            setAllTasks(result)
            setError(' ')
          }
        }, (error) => {
          setError(error.message);
        });
      return () => {
        sub();
      }; 
    }, []);   

    const submit=(e)=>{
      e.preventDefault()
      
     if(!task.trim()){
      setError("fill task")
     }else if(!finished.trim()){
      setError("fill")
     }else if(difficulty.trim()===""){
      setError("FIll difficult")
      return;
     
     
     }else{
      
      const oneTask={
        
        task:task,
        finished:finished,
        difficulty: difficulty
      }

      setShow(false)

      try{
        projectFirestore.collection("todo").add(oneTask)
        setTask("")
        setFinished("")
        setDifficulty("")
      }catch(error){
        setError('Task could not be added: ' + error.message);
      }
    }
  }

  
    const deletos=(id)=>{
      projectFirestore.collection("todo").doc(id).delete()
    }
    //hard part
    //nastavime vsechny tasky an to aby kdyz se schdouje kliknuti s id tasku kdzy je to good tak se to zmeni na opacny boolean 
   const toggleInProgress=(id)=>{
    setAllTasks(prevTasks =>
      prevTasks.map((oneTask) => {
        if (oneTask.id === id) {
          return { ...oneTask,
          status: !oneTask.status,
          difficulty: oneTask.difficulty
          };
        } else {
          return oneTask;
        }
      })
    );
    setBgcolor("rgb(218, 255, 164");
  };

  //mas pole tasku a v top to hleda ze kdyz to najde id na ktere bylo kliknuto a je to true tak to zmeni barvu 
   const style = (taskId) => {
    const task = allTasks.find((oneTask) => oneTask.id === taskId);
    if (task.status) {
      return { backgroundColor: 'rgb(218, 255, 164)' };
    } else {
      return { backgroundColor: 'white' };
    }
  };
  
  //end ot of the hard part
  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  return (
    <section className="  flex flex-col items-center mt-10 ">
      <div className='bg-blue-500 w-1/4 h-24 rounded-2xl flex items-center justify-center text-white'>
        <h1 className="text-5xl font-bold mb-4">Todo</h1>
      </div>
      <h3 className="flex justify-between w-full mb-2">
      </h3>
      <button
        onClick={() => setShow(true)}
        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Task
      </button>
      <Modal
        onRequestClose={() => setShow(false)}
        isOpen={show}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter:"blur(6px)",
            msFilter:"blue(6px)",
          },
          content: {
            width: "300px",
            height: "450px",
          },
        }}
      >
        <form onSubmit={submit} className="flex flex-col">
          <p className='text-xs'>You can write your task here</p>
          <input
            type="text"
            onChange={(e) => setTask(e.target.value)}
            className="py-2 px-4 mb-4 border border-gray-300 rounded"
            placeholder="Enter task"
          />
          <p className='text-xs'>By when do you want to do it?</p>
          <input
            type="date"
            onChange={(e) => setFinished(e.target.value)}
            placeholder='When do you want to do it?'
            className="py-2 px-4 mb-4 border placeholder-gray-300 border-gray-300 rounded"
          />
           <div>
    <select className='mb-2' id="difficulty" value={difficulty} onChange={handleDifficultyChange}>
      <option  value="">Select Difficulty</option>
      <option className='text-green-500' value="Easy">Easy</option>
      <option className='text-red-500'value="Hard">Hard</option>
    </select>
  </div>
  {error && <p className="text-red-500">{error}</p>}
<hr className='mb-2 text-blue-500 '/>


          <input
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 hover:scale-105 hover:ease-out"
            value="Create Taskss"
          />    
        </form>
        
        <img className='flex w-44 h-40 ml-8 mt-4 justify-center items-center' src="https://m.media-amazon.com/images/I/41u3nDmbK8L._AC_.jpg" alt="" />
      </Modal>
      <div  className="mt-4 bg-white w-96 h-40">
        {allTasks.map((oneTask) => {
          const { id, task, finished } = oneTask;
  
          return (
            <div
              style={style(id)}
              key={id}
              className="flex items-center justify-between w-full py-2 px-4 mb-4 border border-gray-300 rounded"
            >
              <div>
                <p>{task}</p>
                <p>{finished}</p>
                <p >{oneTask.difficulty}</p> 
              </div>
              {oneTask.status ? (
                <button
                id='completeButton'
                  className="flex ml-3 w-28 items-center justify-center py-1 px-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => toggleInProgress(id)}
                >
                  <FaRegThumbsUp id='complete' className="mr-1  w-4" />
                  Finished
                </button>
              ) : (
                <button
                id='inProgressButton'
                  className="flex ml-3 items-center justify-center py-1 px-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => toggleInProgress(id)}
                >
                  <GiHourglass id='inProgress' className="mr-1 w-4 " />
                  In Progress
                </button>
              )}
              <button
                onClick={() => deletos(id)}
                id='deleteButton'
                className="flex items-center  justify-center py-1 px-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <FaTrashAlt id='deletes' className='w-8 h-6' />
              </button> 
            </div>
          );
        })}
      </div>
    </section>
  );
      }
    export default App