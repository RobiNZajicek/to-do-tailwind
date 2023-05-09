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
      

      const oneTask={
        
        task:task,
        finished:finished
      }

      setShow(false)

      try{
        projectFirestore.collection("todo").add(oneTask)
      }catch(error){
        setError('Task could not be added: ' + error.message);
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
          return { ...oneTask, status: !oneTask.status };
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
  return (
    <section className="  flex flex-col items-center mt-10 min-h-screen">
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
            height:"100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

          },
          content: {
            width: "600px",
            height: "600px",
          },
        }}
      >
        <form onSubmit={submit} className="flex flex-col">
          <input
            type="text"
            onChange={(e) => setTask(e.target.value)}
            className="py-2 px-4 mb-4 border border-gray-300 rounded"
            placeholder="Enter task"
          />
          <input
            type="date"
            onChange={(e) => setFinished(e.target.value)}
            className="py-2 px-4 mb-4 border border-gray-300 rounded"
          />
          <input
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            value="Create Taskss"
          />
        </form>
      </Modal>
      <div  className="mt-4 bg-white w-96 h-40">
        {error && <p className="text-red-500">{error}</p>}
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
              </div>
              {oneTask.status ? (
                <button
                  className="flex  items-center justify-center py-1 px-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => toggleInProgress(id)}
                >
                  <FaRegThumbsUp className="mr-1 " />
                  Finished
                </button>
              ) : (
                <button
                  className="flex fixed ml-3 items-center justify-center py-1 px-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => toggleInProgress(id)}
                >
                  <GiHourglass className="mr-1 " />
                  In Progress
                </button>
              )}
              <button
                onClick={() => deletos(id)}
                className="flex items-center  justify-center py-1 px-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <FaTrashAlt className='' />
              </button> 
            </div>
          );
        })}
      </div>
    </section>
  );
      }
    export default App