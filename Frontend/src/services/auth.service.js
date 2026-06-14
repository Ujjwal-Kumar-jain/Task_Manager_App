import mockDB from "./mockDB";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const authService = {
  async signup(userData) {
    await delay(500);
    const users = mockDB.getUsers();
    
    if (users.some(u => u.email === userData.email)) {
      throw { response: { data: { message: "Email already exists" } } };
    }

    const newUser = {
      _id: mockDB.generateId(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.adminJoinCode === "123456" ? "admin" : "user",
      profileImageUrl: userData.profileImageUrl || "",
      isActive: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    mockDB.setUsers(users);

    const { password, ...userWithoutPassword } = newUser;
    return { success: true, data: userWithoutPassword, message: "User created successfully" };
  },

  async signin(email, password) {
    await delay(500);
    const users = mockDB.getUsers();
    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
      throw { response: { data: { message: "Invalid email or password" } } };
    }

    if (!user.isActive) {
      throw { response: { data: { message: "Account is inactive" } } };
    }

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem("current_user", JSON.stringify(userWithoutPassword));

    return { success: true, data: userWithoutPassword, message: "Login successful" };
  },

  async signout() {
    await delay(300);
    localStorage.removeItem("current_user");
    return { success: true, message: "Logged out successfully" };
  },

  async getUserProfile() {
    await delay(300);
    const currentUser = JSON.parse(localStorage.getItem("current_user"));
    if (!currentUser) throw { response: { data: { message: "Unauthorized" } } };
    
    const users = mockDB.getUsers();
    const user = users.find(u => u._id === currentUser._id);
    if (!user) throw { response: { data: { message: "User not found" } } };

    const { password, ...userWithoutPassword } = user;
    return { success: true, data: userWithoutPassword };
  },

  async updateProfile(profileData) {
    await delay(500);
    const currentUser = JSON.parse(localStorage.getItem("current_user"));
    if (!currentUser) throw { response: { data: { message: "Unauthorized" } } };

    const users = mockDB.getUsers();
    const index = users.findIndex(u => u._id === currentUser._id);
    if (index === -1) throw { response: { data: { message: "User not found" } } };

    const updatedUser = { ...users[index], ...profileData };
    users[index] = updatedUser;
    mockDB.setUsers(users);

    const { password, ...userWithoutPassword } = updatedUser;
    localStorage.setItem("current_user", JSON.stringify(userWithoutPassword));

    return { success: true, data: userWithoutPassword, message: "Profile updated successfully" };
  },

  async uploadImage(formData) {
    await delay(800);
    return { success: true, imageUrl: "https://via.placeholder.com/150", message: "Image uploaded successfully" };
  }
};

export default authService;
