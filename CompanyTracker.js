const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'employee_db',
});

connection.connect((err)=>{
    if (err) throw err;
    start();
});

const start = ()=>{
    inquirer.prompt(
        {
            type: 'list',
            name:'actions',
            message: "Welcome to Umbrella Corp. Please select an action.",
            choices:['Manage Departments', 'Manage Roles', 'Manage Employees', 'EXIT']
        }
    ).then(function(answer){
        if (answer.actions === 'Manage Departments'){
            manageDepts();
        } else if (answer.actions === 'Manage Roles'){
            manageRoles();
        } else if (answer.actions === 'Manage Employees'){
            manageEmps();
        } else {
            connection.end();
        }
    })
};

const manageDepts = ()=>{
    inquirer.prompt(
        {
            type: 'list',
            name: 'actions',
            message:'Choose which action you would like to perform.',
            choices:['Add department','Delete department','Return to previous screen']
        }
    ).then((answers)=>{
        if (answers.actions === 'Add department'){
            addDept();
        } else if (answers.actions === 'Delete department'){
            delDept();
        } else {
            start();
        }
    })
};

const addDept = ()=>{
    inquirer.prompt(
        {
            type:'input',
            name:'name',
            message: 'Please enter department name.'
        }
    ).then((answer)=>{
        connection.query(
            'INSERT INTO department SET ?',{
                name: answer.name
            },
            (err)=>{
                if (err) throw err;
                console.log(answer.name +' Department created!');
                manageDepts();
            }
        )
    })
};

const delDept = ()=>{
    connection.query('SELECT * FROM department',(err,res)=>{
        if (err)throw err;
        console.table(res);

        inquirer.prompt({
            type:'input',
            name:'id',
            message:'Enter the department id you wish to delete.'
        }).then((answer)=>{
            if (isNaN(answer.id) === false){
                connection.query(`DELETE FROM department WHERE id=${answer.id}`);
                console.log('Successfully deleted!')
                manageDepts();
            }
            else{
                console.log('Incorrect Input!');
                delDept();
            }
        })
    });
}


const manageRoles = ()=>{
    inquirer.prompt({
        type:'list',
        name:'actions',
        message:'Please select which action you would like to take',
        choices:['Add role', 'Delete Role','Return to previous screen']
    }).then((answer)=>{
        if (answer.actions === 'Add role'){
            addRole();
        }else if (answer.actions === 'Delete Role'){
            delRole();
        }else{
            start();
        }
    })
};

const addRole = ()=>{
    inquirer.prompt([
        {
            type:'input',
            name:'title',
            message: 'Please enter role title.'
        },
        {
            type:'input',
            name:'salary',
            message:'Please enter role salary.'
        },
        {
            type:'input',
            name:'department_id',
            message:'Please enter department name'
        }
    ]).then((answer)=>{
        if(isNaN(answer.salary) === false){
        connection.query(
            'INSERT INTO role SET ?',{
                id: answer.insertId,
                title: answer.title,
                salary:answer.salary,
                department_id:answer.department_id
            },
            (err)=>{
                if (err) throw err;
                console.log(answer.title +' Role created!');
                manageRoles();
            }
        )}
        else{
            console.log('Salary must be a number with no punctuation! (commas/decimals');
            addRole();
        }
})};

const delRole = ()=>{
    connection.query('SELECT * FROM role',(err,res)=>{
        if (err)throw err;
        console.table(res);

        inquirer.prompt({
            type:'input',
            name:'id',
            message:'Enter the role id you wish to delete.'
        }).then((answer)=>{
            if (isNaN(answer.id) === false){
                connection.query(`DELETE FROM role WHERE id=${answer.id}`);
                console.log('Successfully deleted!')
                manageRoles();
            }
            else{
                console.log('Incorrect Input!');
                delRole();
            }
        })
    });
}

const manageEmps = ()=>{
    inquirer.prompt({
        type:'list',
        name:'actions',
        message:'Please select which action you would like to take',
        choices:['Add employee', 'Delete employee','Return to previous screen']
    }).then((answer)=>{
        if (answer.actions === 'Add employee'){
            addEmp();
        }else if (answer.actions === 'Delete employee'){
            delEmp();
        }else{
            start();
        }
    })
};

const addEmp = ()=>{
    inquirer.prompt([
        {
            type:'input',
            name:'firstName',
            message: 'Please enter employee first name.'
        },
        {
            type:'input',
            name:'lastName',
            message:'Please enter employee last name.'
        },
        {
            type:'input',
            name:'role_id',
            message:'Please enter role ID.'
        },
        {
            type:'input',
            name:'manager_id',
            message:'Please enter manager name.'
        }
    ]).then((answers)=>{
        connection.query('INSERT INTO employee SET ?',{
            first_name: answers.firstName,
            last_name: answers.lastName,
            role_id:answers.role_id,
            manager_id:answers.manager_id
        },(err)=>{if(err)throw err;} 
       )
       console.log('Successfully added employee!');
        manageEmps();
    })
}

const delEmp = ()=>{
    connection.query('SELECT * FROM employee',(err,res)=>{
        if (err)throw err;
        console.table(res);

        inquirer.prompt({
            type:'input',
            name:'id',
            message:'Enter the employee id you wish to delete.'
        }).then((answer)=>{
            if (isNaN(answer.id) === false){
                connection.query(`DELETE FROM employee WHERE id=${answer.id}`);
                console.log('Successfully deleted!')
                manageRoles();
            }
            else{
                console.log('Incorrect Input!');
                delRole();
            }
        })
    });
}