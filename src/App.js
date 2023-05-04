import React from 'react'
import { useState,useEffect } from 'react'
import {projectFirestore} from "./firebase/config"
import { FaTrashAlt } from 'react-icons/fa';
import { FaRegThumbsUp } from 'react-icons/fa';
import Model from "react-modal"
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
  return <section onSubmit={submit}>
    <button onClick={()=>setShow(true)}>Create task</button>
    <Model onRequestClose={()=>setShow(false)} isOpen={show} style={{overlay:{
      background:"grey"
    },
    content:{
      width:"500px",
      height:"500px"
    }
    }}>
    <form className=''>
      <input type="text" onChange={(e)=>setTask(e.target.value)} className='' /><br></br>
      <input type='date' onChange={(e)=>setFinished(e.target.value)}/>
      <input type="submit" onClick={()=>setShow(false)} className='' value="Create task" />
    </form>
    </Model>
    <form onSubmit={submit}>
    {error && <p className=''>{error}</p>}
    {allTasks.map((oneTask)=>{
      const {id,task,finished}=oneTask

      return <div style={style(id)}  key={id} className=''>
          <p  className=''>{task}</p>
          <p className=''>{finished}</p>
          {oneTask.status ? (
                  <button className='completeButton' onClick={()=>toggleInProgress(id)}>
                  <FaRegThumbsUp className='complete' />
                  Finished
                </button>
                  
                ) : (
                  <button className='inProgressButton' onClick={()=>toggleInProgress(id)}>
                    <GiHourglass className='inProgress' /><br />
                    In process
                  </button>
                )}
          <button onClick={()=>deletos(id)}><FaTrashAlt/></button>
      </div>
    })}
    </form>
    
  </section>
}

export default App