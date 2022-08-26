//dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');


//connection to sql db
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'mysqlPassword',
    database: 'employee_tracker_db'
})
// connection to server and db
connection.connect(function(err){
    if (err) throw err;
    promptConsole();
});
// prompt trying to copy module example lol
promptConsole = () =>{
    console.log('************************')
    console.log('*                      *')
    console.log('*   Employee Manager   *')
    console.log('*                      *')
    console.log('************************')
    promptEmployeeTracker();
};


//prompt the application
function promptEmployeeTracker(){
    inquirer.prompt({
        name: 'options',
        type: 'list',
        message: 'What would you like to do?',
        choices: 
        [
            'View all employees',
            'Add an employee',
            'View all roles',
            'Add a role',
            'View all departments',
            'Add a department',
            'Update an employee role',
            'Quit'

        ]
    })
    .then((answers) => {
        const { options } = answers;
        if (options === 'View all employees'){
            displayEmployees();
        }
        if (options === 'Add an employee'){
            addEmployee();
        }
        if (options === 'View all roles'){
            displayRoles();
        }
        if (options === 'Add a role'){
            addRole();
        }
        if (options === 'View all departments'){
            displayDepartments();
        }
        if (options === 'Add a department'){
            addDepartment();
        }
        if (options === 'Update an employee role'){
            updateEmploeeRole();
        }
        if (options === 'Quit'){
            connection.end()
        };
    });
};
// display employees function
displayEmployees = () =>  {
    console.log('Displaying all employees...\n');   
    const sql = `SELECT employee.id, 
                    employee.first_name, 
                    employee.last_name, 
                    roles.title, 
                    department.name AS department,
                    roles.salary,
                    CONCAT (manager.first_name, " ", manager.last_name) AS manager
                    FROM employee
                    LEFT JOIN roles ON employee.roles_id = roles.id
                    LEFT JOIN department ON roles.department_id = department.id
                    LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptEmployeeTracker();
        
    })
};
// display roles function
const displayRoles = () => {
    const sql = `SELECT roles.id AS "Roles ID", roles.title AS Roles, roles.salary AS Salary, roles.department_id AS "Department ID" FROM employee_tracker_db.roles`;
    connection.query(
      sql,
      (err, rows) => {
        if (err) throw err;
        console.log('\n');
        console.table(rows);
        promptEmployeeTracker();
    })
  }
// display departments function
displayDepartments = () => {
    const sql = `SELECT department.id AS "Department ID", department.name AS department FROM employee_tracker_db.department`;

    connection.query(
        sql,
        (err, rows) => {
        if (err) throw err;
        console.log('\n')
        console.table(rows);
        promptEmployeeTracker();
    })
};


// add new employee function
const addEmployee = async () => {
    connection.query('Select * FROM roles', async (err, roles) => {
        if (err) throw err; 
        
        connection.query('Select * FROM employee WHERE manager_id IS NULL', async (err, managers) => {
          if (err) throw err; 
    
        managers = managers.map(manager => ({name:manager.first_name + " " + manager.last_name, value: manager.id}));
        managers.push({name:"None"});
    // prompt questions to add new employee
    const responses = await inquirer
        .prompt([
        {
            type: 'input',
            name: 'firstname',
            message: 'What is the employees first name?',
            
        },
        {
            type : 'input',
            name: 'lastname',
            message: 'What is your employees last name?',
           
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is the employees role?',
            choices: roles.map(roles => ({name:roles.title, value: roles.id})),
        },
        {
            type: 'rawlist',
            name: 'managers',
            message: 'What is their managers name?',
            choices: managers
        }   
    ])
    if (responses.managers === "None") {
        responses.managers = null;
      }
// insert into employee table
    connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: responses.firstname,
          last_name: responses.lastname,
          roles_id: responses.role,
          manager_id: responses.managers
        },
        (err, res) => {
          if (err) throw err;
          console.log("New employee added.\n");
          promptEmployeeTracker();
        }
    )
  })
})
};
// add new department
const addDepartment = async () => {
    const responses = await inquirer
    // prompt question for new department
    .prompt([
        {
            name: 'addNewDepartment',
            type: 'input',
            message: 'What is the name of the new department?'
        }
    ])
    // insert into department table
    connection.query(
        'INSERT INTO employee_tracker_db.department SET ?',
        { 
            name: responses.addNewDepartment,
        },
        (err) => {
            if (err) throw err;
            console.log('New department added!\n')
            promptEmployeeTracker();
            }
       
    )
};
// view departments function to add into add role prompt
const viewDepartments = () => {
    return new Promise( (resolve, reject) => {
    
      const query = `SELECT * FROM employee_tracker_db.department`;
      connection.query(
        query,
        (err, results) => {
          if (err) reject(err);
          resolve(results);
    })
  })
  }

// add a new roles
const addRole = async () => {
    // invoke function from view departments
    const departments = await viewDepartments();
    const responses = await inquirer

// prompt questions for new roles
    .prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the name of the new role?'
        },
        {
            name: 'salary',
            type: 'number',
            message: 'What is the salary of this role?'
        },
        {
            name: 'department',
            type: 'list',
            choices: departments.map(department => department.name),
            message: 'What department is the role in?'
           
        }
    ])

    departments.forEach(department => {
        if (department.name === responses.department) {
        responses.department = department.id;
        }
    });
// insert into roles table
    connection.query(
        'INSERT INTO employee_tracker_db.roles SET ?',
        { 
            title: responses.title,
            salary: responses.salary,
            department_id: responses.department
        },
        (err) => {
            if (err) throw err;
            console.log('New role added!\n')
            promptEmployeeTracker();
            }
       
    )
};



// function to view departments 
// function to view roles 
// function to view employees
// function to add employees using inquirer
//function to add new department
//function to add new role


