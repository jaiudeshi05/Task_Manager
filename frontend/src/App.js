import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import TaskList from './components/TaskList';

export const URL=process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
<TaskList serverUrl={URL} />
function App() {
  return (
    <div className="app">
      <div>
      <div className="task-container">
        <TaskList/>
      </div>
      <ToastContainer/>
      </div>
    </div>
  );
}

export default App;
