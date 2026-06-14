import mockDB from "./mockDB";

const reportService = {
  async exportTasks() {
    const tasks = mockDB.getTasks();
    
    // Create CSV content
    const headers = ["ID", "Title", "Status", "Priority", "Assigned To", "Created At"];
    const csvRows = [headers.join(",")];
    
    tasks.forEach(task => {
      csvRows.push([
        task._id,
        `"${(task.title || "").replace(/"/g, '""')}"`,
        task.status,
        task.priority,
        task.assignedTo,
        task.createdAt
      ].join(","));
    });
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tasks_report.csv");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  },

  async exportUsers() {
    const users = mockDB.getUsers();
    
    const headers = ["ID", "Name", "Email", "Role", "Active"];
    const csvRows = [headers.join(",")];
    
    users.forEach(user => {
      csvRows.push([
        user._id,
        `"${(user.name || "").replace(/"/g, '""')}"`,
        user.email,
        user.role,
        user.isActive
      ].join(","));
    });
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users_report.csv");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
};

export default reportService;
