import mockDB from "./mockDB";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getCurrentUser = () => JSON.parse(localStorage.getItem("current_user"));

const taskService = {
  async getTasks(status = "") {
    await delay(300);
    const currentUser = getCurrentUser();
    if (!currentUser) throw { response: { data: { message: "Unauthorized" } } };
    
    let tasks = mockDB.getTasks();
    
    if (currentUser.role !== "admin") {
      tasks = tasks.filter(t => t.team && t.team.includes(currentUser._id) || t.assignedTo === currentUser._id);
    }
    
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    
    return { success: true, data: tasks, message: "Tasks fetched" };
  },

  async createTask(taskData) {
    await delay(400);
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") throw { response: { data: { message: "Unauthorized" } } };

    const tasks = mockDB.getTasks();
    const newTask = {
      _id: mockDB.generateId(),
      ...taskData,
      status: taskData.status || "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    tasks.push(newTask);
    mockDB.setTasks(tasks);
    return { success: true, data: newTask, message: "Task created" };
  },

  async updateTask(id, taskData) {
    await delay(400);
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") throw { response: { data: { message: "Unauthorized" } } };

    const tasks = mockDB.getTasks();
    const index = tasks.findIndex(t => t._id === id);
    if (index === -1) throw { response: { data: { message: "Task not found" } } };

    tasks[index] = { ...tasks[index], ...taskData, updatedAt: new Date().toISOString() };
    mockDB.setTasks(tasks);
    return { success: true, data: tasks[index], message: "Task updated" };
  },

  async deleteTask(id) {
    await delay(300);
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") throw { response: { data: { message: "Unauthorized" } } };

    let tasks = mockDB.getTasks();
    tasks = tasks.filter(t => t._id !== id);
    mockDB.setTasks(tasks);
    return { success: true, message: "Task deleted" };
  },

  async updateTaskStatus(id, status) {
    await delay(300);
    const tasks = mockDB.getTasks();
    const index = tasks.findIndex(t => t._id === id);
    if (index === -1) throw { response: { data: { message: "Task not found" } } };

    tasks[index].status = status;
    tasks[index].updatedAt = new Date().toISOString();
    mockDB.setTasks(tasks);
    return { success: true, data: tasks[index], message: "Status updated" };
  },

  async updateTaskChecklist(id, todoChecklist) {
    await delay(300);
    const tasks = mockDB.getTasks();
    const index = tasks.findIndex(t => t._id === id);
    if (index === -1) throw { response: { data: { message: "Task not found" } } };

    tasks[index].todoChecklist = todoChecklist;
    tasks[index].updatedAt = new Date().toISOString();
    mockDB.setTasks(tasks);
    return { success: true, data: tasks[index], message: "Checklist updated" };
  },

  async getAdminDashboardData() {
    await delay(300);
    const tasks = mockDB.getTasks();
    const users = mockDB.getUsers();
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;
    const pendingTasks = tasks.filter(t => t.status === "Pending" || t.status === "In Progress").length;
    const totalUsers = users.length;
    
    return { 
      success: true,
      data: { totalTasks, completedTasks, pendingTasks, totalUsers },
      message: "Dashboard data fetched"
    };
  },

  async getUserDashboardData() {
    await delay(300);
    const currentUser = getCurrentUser();
    if (!currentUser) throw { response: { data: { message: "Unauthorized" } } };
    
    const tasks = mockDB.getTasks().filter(t => t.team && t.team.includes(currentUser._id) || t.assignedTo === currentUser._id);
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;
    const pendingTasks = tasks.filter(t => t.status === "Pending" || t.status === "In Progress").length;
    
    return {
      success: true,
      data: { totalTasks, completedTasks, pendingTasks },
      message: "User dashboard data fetched"
    };
  },

  async getTaskById(id) {
    await delay(200);
    const tasks = mockDB.getTasks();
    const task = tasks.find(t => t._id === id);
    if (!task) throw { response: { data: { message: "Task not found" } } };
    return { success: true, data: task, message: "Task fetched" };
  }
};

export default taskService;
