import React from 'react'
import { useState,useEffect } from 'react'
import {projectFirestore} from "./firebase/config"
const App = () => {

    const[task,setTask]=useState("")
    const[allTasks,setAllTasks]=useState([])
    const[error,setError]=useState("")
    const [finished,setFinished]=useState("")

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
  return <section onSubmit={submit}>
    <form className=''>
      <input type="text" onChange={(e)=>setTask(e.target.value)} className='' /><br></br>
      <input type='date' onChange={(e)=>setFinished(e.target.value)}/>
      <input type="submit" className='' value="Create task" />
    </form>
    {error && <p className=''>{error}</p>}
    {allTasks.map((tasks)=>{
      const {id,task,finished}=tasks

      return <div  key={id} className=''>
          <p className=''>{task}</p>
          <p className=''>{finished}</p>
          <button onClick={()=>deletos(id)}></button>
      </div>
    })}
  </section>
}

export default App