//Password manager for managing all my passwords
const fs = require('fs');
const chalk = require('chalk')


const numPresent = function(s) {
    for(i of s) {
        if (!isNaN(i)) {
            return true;
        }
    }
}


const upperPresent = function(s) {
    for(i of s) {
        
        if (i === i.toUpperCase() && i !== i.toLowerCase()) {
            return true;
        }
    }
}
const lowerPresent = function (s) {
    for (i of s) {

        if (i !== i.toUpperCase() && i === i.toLowerCase()) {
            return true;
        }
    }
}

const puncCheck = function(s) {
    const punc = ['!', '(', ')', '-', '.', ',', '?', '[', ']', '_', '`', '~', ';', ':', '@', '#', '$', '%', '^', '&', '']

    for(i of s) {
        if (i in punc) {
            return true;
        }
    }
}

const validate = function(s) {
    if (numPresent(s) && upperPresent(s) && lowerPresent(s) && puncCheck(s)) {
        return true;
    }
    else {
        return false;
    }
}
const generatePass = function() {
    let s = ''
    let smallChar = []
    let largeChar = []
    const num = [9, 2, 7, 4, 6, 0, 5, 3, 1, 8]
    const punc = ['!', '(', ')', '-', '.', ',', '?', '[', ']', '_', '`', '~', ';', ':', '@', '#', '$', '%', '^', '&', '']
    for(let i=65; i<91; i++) {
        smallChar.push(String.fromCharCode(i))
    }
    for (let j = 97; j < 123; j++) {
        largeChar.push(String.fromCharCode(j))
    }
    
    let sum = num.concat(smallChar, largeChar, punc)
    for(let k=0; k<Math.floor(Math.random()*7)+8; k++) {
        s = s + sum[Math.floor(Math.random() * sum.length)]
    }

    return s
}

const finalPass = function() {
    while (true) {
        let pwd = generatePass()
        if (validate(pwd) === true) {
            return pwd
        }

    }

}

const addToJSON = function(website, username, password) {
    
    const y = fs.readFileSync('pwd.json')
    const f = y.toString()
    const z = JSON.parse(f)
    
    let flag = false
    for (i of z) {
        if (i.website === website && i.username === username) {
            i.password = password
            flag = true
            break
        }
    }
    if (flag) {
        fs.writeFileSync('pwd.json', JSON.stringify(z))
    }
    else {
        const x = {
            website: website,
            username: username,
            password: password
        }
        z.push(x)
        fs.writeFileSync('pwd.json', JSON.stringify(z))
    }
    

}



function add() {
    
    const readline = require('readline')

    const stream = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    stream.question(chalk.cyan('Enter Website: '), website => {
        stream.question(chalk.cyan('Enter Username: '), username => {
            stream.question(chalk.yellow('Generate Pwd or Enter Pwd [g/e]?'), input => {
                if (input === 'e') {
                    stream.question(chalk.cyan('Enter Password: '), password => {

                        stream.question(chalk.cyan('Re-enter password: '), rePwd => {



                            if (password === rePwd) {
                                console.log(chalk.green(('The Website: ' + website)))
                                console.log(chalk.green('Your username: ' + username))
                                console.log(chalk.green('The entered password is: ' + password))
                                console.log(chalk.green('Is your Password Secure: ') + validate(password))

                                stream.question(chalk.yellow('Confirm Addition to Database? [Y/N]: '), decide => {
                                    stream.close()
                                    if (decide === 'Y') {
                                        addToJSON(website, username, password)
                                        console.log(chalk.green('Logged!'))


                                    }
                                    else {
                                        console.log(chalk.red.bold('Logging Off.'))

                                    }
                                })
                            }
                            else {
                                stream.close()
                                console.log(chalk.red.bold('Password confirmation unsuccessful.'))

                            }

                        });
                    });
                }
                else {
                    const pwd = finalPass();
                    console.log(chalk.green('The Website: ' + website))
                    console.log(chalk.green('Your username: ' + username))
                    console.log(chalk.green('The generated password is: ') + pwd)
                    stream.question(chalk.yellow('Confirm Addition to Database? [Y/N]: '), decide => {
                        stream.close()
                        if (decide === 'Y') {
                            addToJSON(website, username, pwd)
                            console.log(chalk.green('Logged!'))


                        }
                        else {
                            console.log(chalk.red.bold('Logging Off.'))

                        }

                    })

                }
            })

        });

    })
    
}


function change() {

    const readline = require('readline')

    const stream = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const file = fs.readFileSync('pwd.json')
    const x = JSON.parse(file.toString())
    stream.question(chalk.cyan('Enter the Website: '), website=> {
        stream.question(chalk.cyan('Enter the username: '), username => {
            stream.question(chalk.cyan('Enter the previous password: '), password => {
                
                if (x.some( obj => obj.website === website && obj.username === username && obj.password === password)) {
                    
                    console.log(chalk.green('Obj present. Authenticated.'))
                    stream.question(chalk.cyan('Enter the new password: '), pwd => {
                        stream.question(chalk.cyan('Re-enter the new password: '), newPwd => {

                            if (pwd === newPwd) {
                                addToJSON(website, username, pwd)
                                console.log(chalk.green(`Password updated to ${pwd} for ${obj.website} user ${obj.username}.`))
                                console.log(chalk.green('Logged!'))
                                stream.close()
                                return 1
                            }
                            else {

                                console.log(chalk.bold.red('New password confirmation failed.'))
                                stream.close()
                                return 1
                            }
                        })
                    })

                }
                else if (x.some(obj => obj.website === website && obj.username === username && obj.password !== password)) {

                    console.log(chalk.bold.red('Authentication Error.'))
                    stream.close()

                }
                
                else {
                    console.log(chalk.red.bold('Credentials not found.'))
                    stream.close()
                }

                
            })
        })
    } )
}

const find = function() {
    const readline = require('readline')
    const stream = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const file = fs.readFileSync('pwd.json')
    const x = JSON.parse(file.toString())

    stream.question(chalk.cyan('Enter the Website: '), website => {
        if (x.some(y => y.website === website)) {
            stream.question(chalk.yellow('Enter the username [optional]: '), username => {
                const result = x.filter(obj => obj.website === website)

                if (username === '') {
                    const result = x.filter(obj => obj.website === website)

                    result.forEach(obj => {
                        console.log(chalk.green(`Password for ${website} user ${obj.username} is ${obj.password}.`))
                    })
                    stream.close()



                }
                else {
                    const result = x.filter(obj => obj.website === website)

                    for (obj of result) {
                        if (obj.username === username) {
                            console.log(chalk.green(`Password for ${obj.website} user ${obj.username} is ${obj.password}.`))
                            stream.close()
                            return 1
                        }

                    }
                    console.log(chalk.red.bold('Credentials not found.'))
                    stream.close()
                    return 1

                }
            })
        }
        else {
            console.log(chalk.red.bold('Credentials not found.'))
            stream.close()
            return 1
        }
        })

} 


const remove = function() {
    const readline = require('readline')
    const stream = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const file = fs.readFileSync('pwd.json')
    const x = JSON.parse(file.toString())
    stream.question(chalk.cyan('Enter website name: '), website => {
        if (x.some(y => y.website === website)) {
            stream.question(chalk.cyan('Enter username: '), username => {
                if (x.some(y => y.username === username && y.website === website)) {
                    const keep = x.filter(function(c) {
                        return c.username !== username || c.website !== website
                    })
                    const data = JSON.stringify(keep)
                    fs.writeFileSync('pwd.json', data)
                    console.log(chalk.green(`Removed ${website} user ${username}.`))
                    stream.close()
                    
                }
                else {
                    console.log(chalk.bold.red('Credentials not found.'))
                    stream.close()
                }
            })
        }

        else {
            console.log(chalk.red.bold('Credentials not found.'))
            stream.close()
        }
    })
}

function authorize(f) {
    const readline = require('readline')
    const stream = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    const password = 'biffyBaff@time&again'
    stream.question(chalk.magenta('Enter the Master Password: '), master => {
        stream.close()
        if (master === password) {
            f()
        }
        else {
            console.log(chalk.red.bold('Authorization Error.'))
        }
    })

}
function clear() {
    const readline = require('readline')
    const stream = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    
    stream.question(chalk.yellow('No data can be recovered later. Proceed? [Y/N]: '), confirmation => {
            if (confirmation === 'Y') {
                
                const go = JSON.stringify([])
                fs.writeFileSync('pwd.json', go)
                console.log(chalk.green('Database Cleared.'))
                stream.close()
            }
            else {
                console.log(chalk.red.bold('Database purge canceled.'))
                stream.close()
            }
        })
    }

const mainExe = function() {
    console.log(chalk.inverse.cyan('------------Password Manager--------------'))
    const x = process.argv
    if (x.length > 4) {
        console.log(chalk.red.bold('Invalid command.'))
        return 1
    }
    const manual = [{command: '--add', about: 'Add a record/password to the database.'}, {command: '--change', about: 'Change password for a record in the database.'}, 
    {command: '--remove', about: 'Remove/Delete a record from database.'}, {command: '--find', about: 'Find a record using website and username.'},
    {command: '--clear', about: 'Purge database of all the records. Irreversible. Requires Authorization.'}]
    if (x[2] === '--help' || x.length === 2) {
        manual.forEach(f => console.log(chalk.cyan(`Command: ${f.command}\nAbout: ${f.about}\n---------------------------`)))
    } 
   else if (x[2] === '--add') {
       add()
   }
   else if (x[2] === '--change') {
       change()
   }
   else if (x[2] === '--remove') {
       remove()
   }
   else if (x[2] === '--find') {
       find()
   }
   else if (x[2] === '--clear') {
       authorize(clear)
   }

}
//+ve - green
//-ve- bold red
//instructions-blue
//mistakes-yellow
mainExe()



