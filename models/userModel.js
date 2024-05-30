const db = require("../config/db");
const bcrypt = require('bcrypt');

exports.checkUser = async (email) => {
    const user = await db.from('user').where({ email: email }).first();
    return user;
}

exports.register = async (email, password, username) => {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db('user').insert({ 
        email, 
        username: username,
        password: hashedPassword 
    });
}

