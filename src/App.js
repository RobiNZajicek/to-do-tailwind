import React from 'react'
import { useState,useEffect } from 'react'
import {projectFirestore} from "./firebase/config"
import { FaTrashAlt } from 'react-icons/fa';
import { FaRegThumbsUp } from 'react-icons/fa';
import Modal from "react-modal"
import { GiHourglass } from "react-icons/gi";
import RealTimeDate from './RealTimeDate';
const App = () => {

    const [task,setTask]=useState("")
    const [allTasks,setAllTasks]=useState([])
    const [error,setError]=useState("")
    const [finished,setFinished]=useState("")
    const [bgColor,setBgcolor]=useState("white")
    const [show,setShow]=useState(false)
    const [difficulty, setDifficulty] = useState("");
    const [FilerButton,setFilterButton]=useState("")
    const [buttonText,setButtonText]=useState("Filter Easy Tasks")

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
       console.log(difficulty);
     if(!task.trim()){
      setError("fill task")
     }else if(!finished.trim()){
      setError("fill date when you want to finis task")
     }else if(difficulty.trim()===""){
      setError("Fill difficult")
      return;
      
     
     }else{
      
      const oneTask={
        
        task:task,
        finished:finished,
        difficulty: difficulty,
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
  

  const filerDificulty=(e)=>{
    setFilterButton(e.target.value)
    if(FilerButton===""){
      setButtonText("Fillter Hard Tasks")
    }else if(FilerButton==="Easy"){
      setButtonText(FilerButton)
    }else if(FilerButton==="Hard"){
      setButtonText("Fillter Easy Tasks")
    }
  }


  return (
    <section className="  flex flex-col items-center h-max mt-4  ">
      <div className='bg-blue-500 w-2/6 h-16 rounded-xl  flex items-center justify-center text-white'>
        <h1 className="text-5xl font-bold mb-2">Todo</h1>
      </div>

      <div className='bg-blue-500 w-1/4 rounded-xl flex justify-center min-h-screen mt-6 '>
      
      <button
        onClick={() => setShow(true)}
        className="py-2 px-4 absolute  bg-blue-400 mt-2 text-white rounded hover:bg-blue-600" 
      >
        Create Task
      </button>
      <select value={FilerButton}   onChange={filerDificulty} className="py-2 mt-14 px-4 absolute    bg-blue-400 text-white rounded hover:bg-blue-600">
        <option value="" >Fillter All</option>
        <option value="Easy">Fillter Easy</option>
        <option value="Hard">FIllter Hard</option>
      </select>
      <Modal
        onRequestClose={() => setShow(false)}
        isOpen={show}
        style={{
          overlay: {
            position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 1,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter:"blur(6px)",
            msFilter:"blue(6px)",
          },
          content: {
            position: 'absolute',
            width: "300px",
            height: "280px",
            top: '200px',
                    left: '780px',
                    right: '500px',
                    bottom: '200px',
                    border: '1px solid #ccc',
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
        
        {/* <img className='flex w-44 h-60 ml-32 mt-6 justify-center items-center' src="https://m.media-amazon.com/images/I/41u3nDmbK8L._AC_.jpg" alt="" /> */}
      </Modal>
      
      <div  className="mt-28 w-96 h-40 ">
        {allTasks.filter((oneTask) => {
    if (FilerButton === "") {
      return true;
    } else {
      return oneTask.difficulty === FilerButton;
    }
  })
  .map((oneTask) => {
          const { id, task, finished,difficulty} = oneTask;
  
          return (
            <div
              style={style(id)}
              key={id}
              className="flex items-center justify-between bg-blue-500 w-96 py-2 px-4 mb-2  border-blue-500 rounded-xl"
            >
              <div className=''>
                <p>{task}</p>
                <p className='text-xs'><RealTimeDate/>{finished}</p>
                <p style={{ color: oneTask.difficulty === "Easy" ? "rgb(0, 207, 0)" : "red" }}>{oneTask.difficulty}</p> 

              </div>
              {oneTask.status ? (
                <button
                id='completeButton'
                  className="flex ml-44 h-8 w-28 items-center justify-center py-1 px-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => toggleInProgress(id)}
                >
                  <FaRegThumbsUp id='complete' className="mr-1  w-4" />
                  Finished
                </button>
              ) : (
                <button
                id='inProgressButton'
                  className=" ml-44 h-8  flex py-1 px-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => toggleInProgress(id)}
                >
                  <GiHourglass id='inProgress' className="mr-1 mt-1 w-4 " />
                  In Progress
                </button>
              )}
              <button
                onClick={() => deletos(id)}
                id='deleteButton'
                className=" py-1 px-2 w-12 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <FaTrashAlt id='deletes' className='w-8 h-6' />
              </button> 
            </div>
          );
        })}
      </div>
      </div>

    </section>
  );
      }
    export default App