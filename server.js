//dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const { listenerCount } = require('mysql2/typings/mysql/lib/Connection');

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
    console.log('*   Employee Manger    *')
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
        const { choices } = answers;
        if (choices === 'View all employees'){
            displayEmployees();
        }
        if (choices === ' Add and employee'){
            addEmployee();
        }
        if (choices === 'View all roles'){
            displayRoles();
        }
        if (choices === 'Add a role'){
            addRole();
        }
        if (choices === 'View all departments'){
            displayDepartments();
        }
        if (choices === 'Add a department'){
            addDepartment();
        }
        if (choices === 'Update an employee role'){
            updateEmploeeRole();
        }
        if (choices === 'Quit'){
            connection.end()
        };
    });
};

displayEmployees = () => {
    
}
// function to view departments 
// function to view roles 
// function to view employees
//
