/**
 * 
 */

class User{
	 
    constructor(name,password,email) {
        this.name = name;
        this.password = password;
        this.email = email;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        name = name.trim();
        if (name === '') {
            throw 'The name cannot be empty';
        }
        this.name = name;
    }
    getPassword() {
        return this.password;
    }
    setPassword(password) {
        password = password.trim();
        if (password === '') {
            throw 'The password cannot be empty';
        }
        this.password = password;
    }
    getEmail() {
        return this.email;
    }
    setEmail(email) {
        email = email.trim();
        if (email === '') {
            throw 'The email cannot be empty';
        }
        this.email = email;
    }
}

let user = new User('Luemmelpeter' ,' 123123', 'email');

user.setName('Luemmelicher Luemmelpeter Doe');
user.setEmail('Lümmel@Peter.com')

console.log(user)

