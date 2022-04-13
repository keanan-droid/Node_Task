import { compare } from "bcrypt";
import { genSalt, hash } from "bcrypt";
import { DbConfig } from "../Config/db.config";
import { config } from "dotenv";
import { sign } from "jsonwebtoken";


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
        const { phonenumber, password } = req.body;

        if (!phonenumber || !password) {
            return res.status(400).json({  msg: "All fields are required to login" })
        }

        const query = {
            text: "SELECT * FROM Admin WHERE phonenumber = $1",
            values: [phonenumber]
        }

        const pool = new DbConfig().getPool();

        try {
            
            const pgClient = await pool.connect();
            const account = await (await pgClient.query(query)).rows[0];

            if (!account) {
                return res.status(404).json({ msg: "User with this account does not exist" })
            }

            const isValidPassword = await compare(password, account.password);

            if (!isValidPassword) {
                return res.status(404).json({  msg: "Invalid credentials"})
            }

            //TOKEN
            const token_payload = {
                uid: account.id,
                phonenumber: account.phonenumber,
            };
            const token = await sign(token_payload, "privateKey", {
                expiresIn: "3d",
            });

            pgClient.release();
            return res.status(201).json({ token })

        } catch (error) {
            return res.status(500).json(error)
        }
    }


    async reset(req, res) {

        const pool = new DbConfig().getPool();

        const { phonenumber, setNewPassword } = req.body;

        if (!phonenumber || !setNewPassword) {
            return res.status(400).json({ msg: "All fields are required to login" })
        }

        const salt = await genSalt();
        const hashedPassword = await hash(setNewPassword, salt);

        try {

            const pgClient = await pool.connect();

            const updateQuery = {
                text: "UPDATE Admin SET password = $1 WHERE phonenumber = $2",
                values: [hashedPassword, phonenumber]
            }

            const newAccount = await (await pgClient.query(updateQuery)).rows[0];

            pgClient.release();
            return res.status(201).json({ msg: "Password updated" })

        } catch (error) {
            return res.status(500).json(error)
        }
    }


    async update(req, res) {

        const pool = new DbConfig().getPool();

        const { email, phonenumber } = req.body;

        try {

            const pgClient = await pool.connect();

            const query = {
                text: "SELECT * FROM Admin WHERE phonenumber = $1",
                values: [phonenumber]
            }

            const account = await (await pgClient.query(query)).rows[0];
            // console.log(account.phonenumber);
            const isVerified = await compare(phonenumber, account.phonenumber);
            // console.log(phonenumber);
            console.log(isVerified);

            if(!isVerified) {

                const updateQuery = {
                    text: "UPDATE Admin SET email = $1 WHERE phonenumber = $2",
                    values: [email, phonenumber]
                }
    
                const newAccount = await (await pgClient.query(updateQuery)).rows[0];
    
                pgClient.release();
                return res.status(201).json({ newAccount })
            } else {
                pgClient.release();
                return res.status(400).json({ msg: "invalid phonenumber"})
            }

        } catch (error) {
            return res.status(500).json(error)
        }

    }

}