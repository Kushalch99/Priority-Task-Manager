/* Task Class Definition */
class Task {
    constructor(name, type, priority, deadline) {
        this.name = name;
        this.type = type;
        this.priority = priority;
        this.deadline = deadline;
        this.id = this.getTaskId();
    }
    getTaskId() {
        return "taskId:" + Task.taskCount.toString();
    }
}
Task.taskCount = 0

/* Priority Queue Class Definition */
class PriorityQueue {
    constructor(){
        this.items = []
    }
    isEmpty(){
        return this.items.length === 0
    }
    isBefore(date1, date2){
        return date1.getTime() < date2.getTime()
    }
    enque(item){
        if(this.isEmpty())
            return this.items.push(item)
        for(let i=0;i<this.items.length;i++){
            if(this.items[i].priority < item.priority)
                continue
            if(this.items[i].priority == item.priority && this.isBefore(this.items[i].deadline, item.deadline))
                continue
            this.items.splice(i, 0, item)
            break
        }
        return
    }
    deque(){
        if(this.isEmpty())
            return null
        return this.items.shift()
    }
    front(){
        if(this.isEmpty())
            throw Error("Queue empty")
        return this.items[0]
    }
}

/* Task Manager Class Definition */
class TaskManager {
    constructor(){
        this.workQueue = new PriorityQueue()
        this.personalQueue = new PriorityQueue()    
    }
    add(task){
        if(task.type === constants.WORK){
            this.workQueue.enque(task)
        }else{
            this.personalQueue.enque(task)
        }
    }
    getHighestPriTask(type){
        if(type === constants.WORK){
            return this.workQueue.front()
        }else{
            return this.personalQueue.front()
        }
    }
    completeTask(type){
        if(type === constants.WORK){
            return this.workQueue.deque()
        }else{
            return this.personalQueue.deque()
        }
    }
}

const newTaskBtn = document.getElementById("newTask")
const showNextTaskBtn = document.getElementById("showNextTask")
const highestPriTaskDiv = document.getElementById("highestPriTask")
const taskTypeForPriEle = document.getElementById("typeForPri")
const form = document.getElementById("taskform");
const nameEle = document.getElementById("tname");
const typeEle = document.getElementById("ttype");
const priEle = document.getElementById("tpri");
const deadlineEle = document.getElementById("ttime");
const taskManager = new TaskManager()



newTaskBtn.onclick = () => { showElement(form) }
showNextTaskBtn.onclick = () => {
    let task = taskManager.getHighestPriTask(taskTypeForPriEle.value)
    let heading = document.createElement('h4')
    let type = document.createElement('p')
    let priority = document.createElement('h5')
    let deadline = document.createElement('p')
    let taskCompletedBtn = document.createElement('button')
    taskCompletedBtn.innerText = 'Task Completed'
    heading.innerText = 'TASK: ' + task.name
    type.innerText = 'TYPE: ' + task.type
    priority.innerText = 'Priority : ' + task.priority
    deadline.innerText = 'Deadline :' + task.deadline
    taskCompletedBtn.onclick = () => {
        taskManager.completeTask(task.type)
        hideElement(highestPriTaskDiv)
    }
    highestPriTaskDiv.appendChild(heading)
    highestPriTaskDiv.appendChild(type)
    highestPriTaskDiv.appendChild(priority)
    highestPriTaskDiv.appendChild(deadline)
    highestPriTaskDiv.appendChild(taskCompletedBtn)
    showElement(highestPriTaskDiv)

}
form.onsubmit = (event) => {
    event.preventDefault();
    let task = new Task(nameEle.value, typeEle.value, parseInt(priEle.value), new Date(deadlineEle.value));
    taskManager.add(task)
    alert('Task Added Successfully!')
    hideElement(form)
};

function hideElement(ele){
    ele.style.display = 'none'
}
function showElement(ele){
    ele.style.display = 'block'
}

const constants = {
    WORK: 'Work',
    PERSONAL: 'Personal'
}

