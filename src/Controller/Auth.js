import { compare } from "bcrypt";
import { genSalt, hash } from "bcrypt";
import { DbConfig } from "../Config/db.config";
import { config } from "dotenv";
import { sign } from "jsonwebtoken";
const nodemailer = require("nodemailer");
import { response } from "express";
import { APIError } from "../Middlewares/Error";

export class AuthController {
    async signup(req, res, next) {
        const pool = new DbConfig().getPool();

        const { firstname, surname, phonenumber, role, password } = req.body;

        if (!firstname || !surname || !phonenumber || !role || !password) {
            // console.log(new APIError("dsd").badRequest());
            return next(new APIError("All fields are required to create account", 400).badRequest())
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

            let transporter = nodemailer.createTransport({
                service: 'SendinBlue',
                // host: "smtp-relay.sendinblue.com",
                // port: 587,
                // secure: false, 
                auth: {
                    user: 'keananshawnswartz@gmail.com', // generated ethereal user
                    pass: '', // generated ethereal password
                },
            });

            const url = "http://localhost:4000/api/signup/verify";

            const mailOptions = {
                from: "noreply@keanan.co.za",
                to: "keananshawnswartz@gmail.com",
                subject: "Account Verification",
                text: "This is an email to remind you that your account is to be verified",
                html: `
                    <h1>Verify Account</h1>
                    <a href=${url}>Verify</a>
                `,
            };

            transporter.sendMail(mailOptions, (error, info)=>{
                if (error) {
                    return response.status(500).json(error);
                }
                return res.status(201).json({ msg: "User created", info });
            })

        } catch (error) {
            return res.status(500).json(error)
        }
    }
    

    async signin(req, res, next) {
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
                console.log(new APIError(json({ message: "dsd"})).notFound());
                return next(new APIError().notFound())
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

            if(account) {

                const updateQuery = {
                    text: "UPDATE Admin SET email = $1 WHERE phonenumber = $2",
                    values: [email, phonenumber]
                }
    
                await (await pgClient.query(updateQuery)).rows(0);

                const isVerified = {
                    text: "UPDATE Admin SET isVerified = true WHERE email = $1",
                    values: [email]
                }

                await pgClient.query(isVerified).rows[0];
    
                pgClient.release();
                return res.status(201).json({ msg: "Account updated" })
            } else {
                pgClient.release();
                return res.status(400).json({ msg: "invalid phonenumber" })
            }

        } catch (error) {
            return res.status(500).json(error)
        }
    }
}
