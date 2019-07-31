const mongoose = require("../../database"); // pega a promisse já declara do index.js dentro do database
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    password: {
        type: String,
        required: true,
        select: false // quando buscar um usuário a informação não virá no array
    },
    createAt: { 
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) { // "pre" será realizado antes de salvar 
    const hash = await bcrypt.hash(this.password, 10); // será gerado 10 rounds de hash 
    this.password = hash;

    next();
})

const User = mongoose.model("User", UserSchema);

module.exports = User;