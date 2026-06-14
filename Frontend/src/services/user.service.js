import mockDB from "./mockDB";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getCurrentUser = () => JSON.parse(localStorage.getItem("current_user"));

const userService = {
  async getUsers() {
    await delay(300);
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") throw { response: { data: { message: "Unauthorized" } } };

    const users = mockDB.getUsers();
    const tasks = mockDB.getTasks();

    const usersWithCounts = users.map(user => {
      const userTasks = tasks.filter(t => t.team && t.team.includes(user._id) || t.assignedTo === user._id);
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        tasksCount: userTasks.length,
        pendingTasks: userTasks.filter(t => t.status === "Pending").length,
        inProgressTasks: userTasks.filter(t => t.status === "In Progress").length,
        completedTasks: userTasks.filter(t => t.status === "Completed").length,
      };
    });

    return { success: true, data: usersWithCounts, message: "Users fetched" };
  },

  async getUserById(id) {
    await delay(200);
    const users = mockDB.getUsers();
    const user = users.find(u => u._id === id);
    if (!user) throw { response: { data: { message: "User not found" } } };
    
    const { password, ...userWithoutPassword } = user;
    return { success: true, data: userWithoutPassword, message: "User fetched" };
  },

  async deleteUser(id) {
    await delay(300);
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") throw { response: { data: { message: "Unauthorized" } } };

    let users = mockDB.getUsers();
    users = users.filter(u => u._id !== id);
    mockDB.setUsers(users);

    return { success: true, message: "User deleted" };
  }
};

export default userService;
