const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, 'tasks.json');

function readTasks() {
    if (!fs.existsSync(TASKS_FILE)) {
        return [];
    }

    const data = fs.readFileSync(TASKS_FILE);
    return JSON.parse(data);
}

function saveTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 4));
}

function addTask(description) {
    const tasks = readTasks();
    const taskId = tasks.length + 1;
    const newTask = {
        id: taskId,
        description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${taskId})`);
}

function updateTask(taskId, description) {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.description = description;
        task.updatedAt = new Date().toISOString();
        saveTasks(tasks);
        console.log(`Task ${taskId} updated successfully`);
    } else {
        console.log(`Task ${taskId} not found`);
    }
}

function deleteTask(taskId) {
    let tasks = readTasks();
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks(tasks);
    console.log(`Task ${taskId} deleted successfully`);
}

function markInProgress(taskId) {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'in-progress';
        task.updatedAt = new Date().toISOString();
        saveTasks(tasks);
        console.log(`Task ${taskId} marked as in-progress`);
    } else {
        console.log(`Task ${taskId} not found`);
    }
}

function markDone(taskId) {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'done';
        task.updatedAt = new Date().toISOString();
        saveTasks(tasks);
        console.log(`Task ${taskId} marked as done`);
    } else {
        console.log(`Task ${taskId} not found`);
    }
}

function listTasks(status = null) {
    const tasks = readTasks();
    const filteredTasks = status ? tasks.filter(t => t.status === status) : tasks;
    filteredTasks.forEach(task => {
        console.log(`ID: ${task.id}, Description: ${task.description}, Status: ${task.status}, Created At: ${task.createdAt}, Update At: ${task.updatedAt} `);
    });
}

function main() {
    const [, , command, ...args] = process.argv;

    switch (command) {
        case 'add':
            if (args.length === 1) {
                addTask(args[0]);
            } else {
                console.log("Usage: node index.js add <description>");
            }
            break;
        case 'update':
            if (args.length === 2) {
                updateTask(parseInt(args[0]), args[1]);
            } else {
                console.log("node index.js update <id> <description>");
            }
            break;
        case 'delete':
            if (args.length === 1) {
                deleteTask(parseInt(args[0]));
            } else {
                console.log("Usage: node index.js delete <id>");
            }
            break;
        case 'mark-in-progress':
            if (args.length === 1) {
                markInProgress(parseInt(args[0]));
            } else {
                console.log("Usage: node index.js mark-in-progress <id>");
            }
            break;
        case 'mark-done':
            if (args.length === 1) {
                markDone(parseInt(args[0]));
            } else {
                console.log("Usage: node index.js mark-done <id>");
            }
            break;
        case 'list':
            if (args.length === 1) {
                listTasks(args[0]);
            } else {
                listTasks();
            }
            break;
        default:
            console.log("Invalid command. Usage: index.js <command> [option]");
    }
}

main();