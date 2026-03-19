import { Request, Response } from "express";
import bycrpt from 'bcrypt'
import { signToken } from "../utils/jwt";
import { getUsers, createUser, verificarUser } from '../models/user.model'
import { handleError } from '../utils/errorHandler';
type user = {
    username: string,
    password: string
}
//Register

export const base = async (req: Request, res: Response) => {
    try {
        res.json({ users: getUsers() })
    } catch (err) {
        handleError(err, res, 'Base');
    }
}

export const register = async (req: Request, res: Response) => {
    const { username, password }: user = req.body
    try {
        const existeUsuario = verificarUser(username)
        if (existeUsuario) return res.status(404).json({ message: 'User alredy exists' })
        const hashPass = await bycrpt.hash(password, 10)
        createUser({ username, password: hashPass })
        res.status(202).json({ message: 'Usuario creado correctamente!' })
    } catch (err) {
        handleError(err, res, 'Register');
    }
};


//Login

export const login = async (req: Request, res: Response) => {
    const { username, password }: user = req.body

    try {
        const user = verificarUser(username)
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' })

        const matchPass = await bycrpt.compare(password, user.password)
        if (!matchPass) return res.status(400).json({ message: 'Invalid Credentials' })

        const payload = { id: user.id, name: user.username }

        const token = signToken(payload)
        res.status(202).json({ message: 'Usuario ingresado correctamente', token })
    } catch (err) {
        handleError(err, res, 'Login');
    }
};