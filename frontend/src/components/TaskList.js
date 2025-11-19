import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TaskForm from "./TaskForm";
import Task from "./Task";
import axios from "axios";
import { URL } from "../App";
import loadingImg from "../assets/loader.gif"

const TaskList = ({serverUrl}) => {
  const [tasks,setTasks] = useState([]);
  const [completedTasks,setCompletedTasks] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [formData, setFormData]=useState({
    name:"",
    completed:false
  })
  const {name}=formData;
  const handleInputChange = (e)=>{
    const {name,value} =e.target;
    setFormData({...formData,[name]:value})
  }
  const [isEditing,setIsEditing]=useState(false);
  const [taskId,setTaskId]=useState("");

  const getTasks=async()=>{
    setIsLoading(true);
    try{
      const {data} = await axios.get(`${URL}/api/tasks`);
      setTasks(data);
      // Filter completed tasks
      const completed = data.filter(task => task.completed === true);
      setCompletedTasks(completed);
      setIsLoading(false);
    }catch(err){
      toast.error(err.response?.data?.message || err.message || "Failed to fetch tasks");
      setIsLoading(false);
    }
  }
  useEffect(() => { console.log('serverUrl:', serverUrl); }, [serverUrl]);


  useEffect(()=>{
    getTasks();
  }, []);

  const createTask=async (e)=>{
    e.preventDefault();
    if(name===""){
        return toast.error("Input Field Empty")
    }
    try{
        await axios.post(`${URL}/api/tasks`, formData);
        toast.success("Task Added Successfully");
        setFormData({...formData, name: ""});
        getTasks();
    }catch(err){
        toast.error(err.response?.data?.message || err.message || "Failed to create task");
    }
  }

  const deleteTask=async(id)=>{
    try{
      await axios.delete(`${URL}/api/tasks/${id}`);
      getTasks();
    } catch(err){
        toast.error(err.response?.data?.message || err.message || "Failed to create task");
    }
  }

  const getSingleTask=async(task)=>{
    setFormData({name:task.name,completed:false});
    setTaskId(task._id);
    setIsEditing(true);
  }

  const updateTask=async(e)=>{
    e.preventDefault();
    if(name==="") return toast.error("Task Name Empty");
    try{
      axios.put(`${URL}/api/tasks/${taskId}`,formData);
      toast.success("Task Added Successfully");
      setFormData({...formData, name: ""});
      setIsEditing(false);
      getTasks();
    }catch(err){
      toast.error(err.response?.data?.message || err.message || "Failed to edit task");
    }
  }

  const setToComplete=async (task) => {
    const newFormData={name:task.name,completed:true}
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`,newFormData)
      getTasks();
    } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Failed to edit task");

    }
  }
  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm name={name} 
      handleInputChange={handleInputChange} 
      createTask={createTask} isEditing={isEditing}
      updateTask={updateTask}/>
      <div className="--flex-between --pb">
        <p>
        <b>Total Tasks:</b>{tasks.length}
        </p>
        <p>
        <b>Completed Tasks:</b>{completedTasks.length}
        </p>
        </div>
        <hr/>
        {
          isLoading && (
            <div className="--flex-center">
              <img src={loadingImg} alt="Loading" />
            </div>
          )
        }
        {
          !isLoading && tasks.length===0?(
            <p>No task added. Add a task now.</p>
          ):(<>
            {
              tasks.map((task,index)=>{
                return <Task 
                key={task._id} task={task} 
                index={index} 
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                setToComplete={setToComplete}
                />;
              })
            }
          </>)
        }
    </div>
  )
}

export default TaskList
