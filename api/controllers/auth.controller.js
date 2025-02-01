import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) =>{
    const {username, email, password} = req.body;
    const hashPassword = bcrypt.hashSync(password, 12);
    const newUser = new User ({username, email, password: hashPassword});
    try {
        await newUser.save();
        res.status(201).json('User created successfully');
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const {username, password} = req.body;
    try {
        const validUser = await User.findOne({username});
        if (!validUser) return next(errorHandler(404, 'User not found'));
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));
        const token =   jwt.sign({id: validUser._id}, process.env.JWT_SECRET); 
        const {password: pass, ...otherDetails} = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(otherDetails); 
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    try {
        // if (!req.body || !req.body.name || !req.body.email) {
        //     return res.status(400).json({ error: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) });
        // }
        const validUser = await User.findOne({email: req.body.email});
        if (validUser) {
            const token =    jwt.sign({id: validUser._id}, process.env.JWT_SECRET); 
            const {password: pass, ...otherDetails} = validUser._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(otherDetails);
        }
        else{
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatePassword, 12);
            const newUser = new User ({ username: req.body.username.replace(/\s+/g, "").toLowerCase() + Math.random().toString(36).slice(-4) , email: req.body.email, password: hashedPassword, avatar: req.body.avatar });
            await newUser.save();
            const token =   jwt.sign({id: newUser._id}, process.env.JWT_SECRET); 
            const {password: pass, ...otherDetails} = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(otherDetails);
        }
        
    } catch (error) {
        next(error);
    }
}

export const signout = async (req, res, next) => {
     try {
        res.clearCookie('access_token');
        res.status(200).json('User signed out successfully');
     } catch (error) {
        next(error);
     }
}