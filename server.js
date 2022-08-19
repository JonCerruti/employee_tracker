//dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');


//connection to sql db
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysqlPassword',
    database: 'employee_tracker_db'
})
// connection to server and db
connection.connect(function(err){
    if (err) throw err;
    promptConsole();
});
promptConsole = () =>{
    console.log('************************')
    console.log('*                      *')
    console.log('*   Employee Manager   *')
    console.log('*                      *')
    console.log('************************')
    promptEmployeeTracker();
};


//inquirer prompt
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



const addEmployee = async () => {
    connection.query('Select * FROM roles', async (err, roles) => {
        if (err) throw err; 
        
        connection.query('Select * FROM employee WHERE manager_id IS NULL', async (err, managers) => {
          if (err) throw err; 
    
        managers = managers.map(manager => ({name:manager.first_name + " " + manager.last_name, value: manager.id}));
        managers.push({name:"None"});
    
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
}
// function to view departments 
// function to view roles 
// function to view employees

