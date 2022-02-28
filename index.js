const constants = {
    WORK: 'work',
    PERSONAL: 'personal',
    PRI_1: 1,
    TASK_MAP: "task_map"
}

/* Task Class Definition */
class Task {
    constructor(name, type, priority, deadline) {
        this.name = name;
        this.type = type;
        this.priority = priority;
        this.deadline = deadline;
        this.id = this.getTaskId();
        Task.taskCount++
    }
    getTaskId() {
        return "taskId:" + Task.taskCount.toString();
    }
}
Task.taskCount = 0

/* Priority Queue Class Definition */
class PriorityQueue {
    constructor(items = []){
        this.items = items
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
            return
        }
        this.items.push(item)
        return
    }
    deque(){
        if(this.isEmpty())
            return null
        let taskId = this.items[0].id
        this.items.shift()
        return taskId
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
        this.workQueue = this.initializePQ(constants.WORK)
        this.personalQueue = this.initializePQ(constants.PERSONAL)
        this.taskMap = new Map()
        if(localStorage.getItem(constants.TASK_MAP)!==null){
            this.taskMap = JSON.parse(localStorage.getItem(constants.TASK_MAP))
        }
    }
    initializePQ(qType){
        if(localStorage.getItem(qType) !== null)
            return new PriorityQueue(JSON.parse(localStorage.getItem(qType)).items)
        return new PriorityQueue()
    }
    add(task){
        if(task.type === constants.WORK){
            this.workQueue.enque(task)
            this.setLocalStorage(constants.WORK, this.workQueue)
        }else{
            this.personalQueue.enque(task)
            this.setLocalStorage(constants.PERSONAL, this.personalQueue)
        }
        this.taskMap[task.id] = task
        this.setLocalStorage(constants.TASK_MAP, this.taskMap)
    }
    getTask(taskId){
        return this.taskMap[taskId]
    }
    getHighestPriTask(type){
        if(type === constants.WORK){
            return this.workQueue.front()
        }else{
            return this.personalQueue.front()
        }
    }
    setLocalStorage(key, value){
        localStorage.setItem(key, JSON.stringify(value))
    }
    completeTask(type){
        let taskId
        if(type === constants.WORK){
            taskId = this.workQueue.deque()
            this.setLocalStorage(constants.WORK, this.workQueue)
        }else{
            taskId = this.personalQueue.deque()
            this.setLocalStorage(constants.PERSONAL, this.personalQueue)
        }
        delete this.taskMap[taskId]
        this.setLocalStorage(constants.TASK_MAP, this.taskMap)
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
const submitBtn = document.getElementById('submit')
const taskIdEle = document.getElementById('taskId')
const idEle = document.getElementById("id")
const deadlineEle = document.getElementById("ttime");
const taskManager = new TaskManager()

function populateForm(taskId){
    if(taskId === null){
        idEle.value = null
        typeEle.value = constants.WORK
        priEle.value = constants.PRI_1
        hideElement(taskIdEle)
    }else{
        let task = taskManager.getTask(taskId)
        nameEle.value = task.name
        typeEle.value = task.type
        priEle.value = task.priority
        deadlineEle.value = new Date(task.deadline).toJSON().slice(0,19)
        idEle.value = task.id
        showElement(taskIdEle)
    }
    showElement(form)
}

submitBtn.onclick = (event) =>{
    event.preventDefault()
    let id = idEle.value
    let task
    if(id == ''){
        task = new Task(nameEle.value, typeEle.value, parseInt(priEle.value), new Date(deadlineEle.value));
    }else{
        task = taskManager.getTask(id)
        let type = task.type 
        task.name = nameEle.value
        task.type = typeEle.value
        task.priority = parseInt(priEle.value)
        task.deadline = new Date(deadlineEle.value)
        taskManager.completeTask(type)
    }
    taskManager.add(task)
    alert('Task Added Successfully!')
    hideElement(form)
}

newTaskBtn.onclick = () => { 
    populateForm(null)
}

showNextTaskBtn.onclick = () => {
    try{
        highestPriTaskDiv.innerHTML = ''
        let task = taskManager.getHighestPriTask(taskTypeForPriEle.value)
        let heading = document.createElement('h4')
        let type = document.createElement('p')
        let priority = document.createElement('h5')
        let deadline = document.createElement('p')
        let taskCompletedBtn = document.createElement('button')
        let editTaskBtn = document.createElement('button')
        taskCompletedBtn.innerText = 'Task Completed'
        editTaskBtn.innerText = 'Edit Task'
        heading.innerText = 'TASK: ' + task.name
        type.innerText = 'TYPE: ' + task.type
        priority.innerText = 'Priority : ' + task.priority
        deadline.innerText = 'Deadline :' + task.deadline
        taskCompletedBtn.onclick = () => {
            taskManager.completeTask(task.type)
            hideElement(highestPriTaskDiv)
        }
        editTaskBtn.onclick = () => {
            populateForm(task.id)
            hideElement(highestPriTaskDiv)
        }
        highestPriTaskDiv.appendChild(heading)
        highestPriTaskDiv.appendChild(type)
        highestPriTaskDiv.appendChild(priority)
        highestPriTaskDiv.appendChild(deadline)
        highestPriTaskDiv.appendChild(taskCompletedBtn)
        highestPriTaskDiv.appendChild(editTaskBtn)
        showElement(highestPriTaskDiv)
    }catch(err){
        alert(err)
    }
}

function hideElement(ele){
    ele.style.display = 'none'
}
function showElement(ele){
    ele.style.display = 'block'
}
