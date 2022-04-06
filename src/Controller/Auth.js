import { compare } from "bcrypt";
import { genSalt, hash } from "bcrypt";
import { DbConfig } from "../Config/db.config";
import { config } from 'dotenv';
const jwt = require('jsonwebtoken');


export class AuthController {
    async signup(req, res) {
        const pool = new DbConfig().getPool();

        const { firstname, surname, phonenumber, role, password } = req.body;

        if (!firstname || !surname || !phonenumber || !role || !password) {
            return res.status(400).json({ msg: "All fields are required to create account "});
        }

        try {
            
            const salt = await genSalt();
            const hashedPassword = await hash(password, salt);

            const pgClient = await pool.connect();
            console.log(hashedPassword);

            const query = {
                text: "INSERT INTO Admin (firstname, surname, phonenumber, role, password) VALUES ($1, $2, $3, $4, $5)",
                values: [firstname, surname, phonenumber, role, hashedPassword],
            };

            await pgClient.query(query);
            pgClient.release();
            return res.status(201).json({ msg: "User created"});
            
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    

    async signin(req, res) {
        const { firstname, password } = req.body;

        if (!firstname || !password) {
            return res.status(400).json({  msg: "All fields are required to login" })
        }

        const query = {
            text: "SELECT * FROM Admin WHERE firstname = $1",
            values: [firstname]
        }

        const pool = new DbConfig().getPool();

        try {
            
            const pgClient = await pool.connect();
            const account = await (await pgClient.query(query)).rows[0];

            const isValidPassword = await compare(password, account.password);

            if (!isValidPassword) {
                return res.status(404).json({  msg: "Invalid credentials"})
            }

            if (!account) {
                return res.status(404).json({ msg: "User with this email does not exist" })
            }

            pgClient.release();
            return res.status(201).json({ msg: "Welcome user" })

        } catch (error) {
            return res.status(500).json(error)
        }
    }


    async reset(req, res) {

        const pool = new DbConfig().getPool();

        const { firstname, setNewPassword } = req.body;

        if (!firstname || !setNewPassword) {
            return res.status(400).json({ msg: "All fields are required to login" })
        }

        const salt = await genSalt();
        const hashedPassword = await hash(setNewPassword, salt);

        try {

            const pgClient = await pool.connect();

            const query = {
                text: "SELECT * FROM Admin WHERE firstname = $1",
                values: [firstname]
            }

            const account = await (await pgClient.query(query)).rows[0];

            if (!account) {
                return res.status(404).json({ msg: "User with this firstname does not exist"})
            }

            const updateQuery = {
                text: "UPDATE Admin SET password = $1 WHERE firstname = $2",
                values: [hashedPassword, firstname]
            }

            const newAccount = await (await pgClient.query(updateQuery)).rows[0];

            pgClient.release();
            return res.status(201).json({ msg: "Password updated" })

        } catch (error) {
            return res.status(500).json(error)
        }
    }

}