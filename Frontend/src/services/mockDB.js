const USERS_KEY = "mock_users";
const TASKS_KEY = "mock_tasks";

const mockDB = {
  initialize() {
    let existingUsers = localStorage.getItem(USERS_KEY);
    
    // If empty, initialize with default users
    if (!existingUsers) {
      const adminUser = {
        _id: "admin-uuid-1234",
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
        profileImageUrl: "",
        isActive: true,
      };
      const hemantUser = {
        _id: "hemant-uuid-5678",
        name: "Hemant",
        email: "hemant@example.com",
        password: "password123",
        role: "user",
        profileImageUrl: "",
        isActive: true,
      };
      localStorage.setItem(USERS_KEY, JSON.stringify([adminUser, hemantUser]));
      existingUsers = localStorage.getItem(USERS_KEY);
    }
    
    // Data Migration: Convert old `.id` to `._id` for existing accounts
    if (existingUsers) {
      let parsedUsers = JSON.parse(existingUsers);
      let needsMigration = false;
      parsedUsers = parsedUsers.map(user => {
        if (user.id && !user._id) {
          needsMigration = true;
          const { id, ...rest } = user;
          return { _id: id, ...rest };
        }
        return user;
      });
      
      // Also ensure Hemant is always there if they ask to see it
      if (!parsedUsers.find(u => u.name.toLowerCase() === "hemant")) {
        parsedUsers.push({
          _id: "hemant-uuid-5678",
          name: "Hemant",
          email: "hemant@example.com",
          password: "password123",
          role: "user",
          profileImageUrl: "",
          isActive: true,
        });
        needsMigration = true;
      }
      
      if (needsMigration) {
        localStorage.setItem(USERS_KEY, JSON.stringify(parsedUsers));
      }
    }
    
    if (!localStorage.getItem(TASKS_KEY)) {
      localStorage.setItem(TASKS_KEY, JSON.stringify([]));
    }
  },

  getUsers() {
    this.initialize();
    return JSON.parse(localStorage.getItem(USERS_KEY));
  },

  setUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getTasks() {
    this.initialize();
    return JSON.parse(localStorage.getItem(TASKS_KEY));
  },

  setTasks(tasks) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },
  
  generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
};

export default mockDB;
