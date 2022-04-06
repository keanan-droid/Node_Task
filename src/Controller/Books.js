import { DbConfig } from "../Config/db.config";

export class BookController {
    async addBook (req, res) {
        const pool = new DbConfig().getPool();

        const { name, isbn, patron, issuedate, author } = req.body;

        if (!name || !isbn || !patron || !issuedate || !author) {
            return res.status(400).json({ msg: "All fields are required to login" })
        }

        try {
            
            const pgClient = await pool.connect();

            const query = {
                text: "INSERT INTO Books (name, isbn, patron, issuedate, author) VALUES ($1, $2, $3, $4, $5)",
                values: [name, isbn, patron,issuedate, author],
            };

            await pgClient.query(query);
            pgClient.release();
            return res.status(201).json({ msg: "Book issued"})
        } catch (error) {
            return res.status(500).json(error)
        }
    }


    async deleteBook(req, res) {
        const pool = new DbConfig().getPool();

        const { isbn, phonenumber } = req.body;

        try {
            
            const pgClient = await pool.connect();

            let query = {
                text: "SELECT id FROM Admin WHERE phonenumber = $1",
                values: [phonenumber],
            }

            const account = await (await pgClient.query(query)).rows[0];

            if (!account) {
                return res.status(301).json({ msg: "User does not exist"})
            }

            query = {
                text: "DELETE FROM Books WHERE isbn = $1",
                values: [isbn],
            }

            await pgClient.query(query).rows;
            pgClient.release();
            return res.status(201).json({ msg: "Book deleted from user"})

        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async bookById (req, res) {
        const pool = new DbConfig().getPool();

        const { isbn } = req.body

        try {
            
            const pgClient = await pool.connect();

            const query = {
                text: "SELECT * FROM Books WHERE isbn = $1",
                values: [isbn],
            }

            const book = await (await pgClient.query(query)).rows[0];
            pgClient.release();
            return res.status(201).json({ book })

        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async allBooksById (req, res) {
        const pool = new DbConfig().getPool();

        const { phonenumber } = req.body;

        try {
            
            const pgClient = await pool.connect();

            let query = {
                text: "SELECT id FROM Admin WHERE phonenumber = $1",
                values: [phonenumber],
            }

            let account = await (await pgClient.query(query)).rows[0];

            if (!account) {
                return res.status(301).json({  msg: "Invalid credentilas"})
            }

            query = {
                text: "SELECT * FROM Books WHERE owner = $1",
                values: [account.id]
            }

            account = await (await pgClient.query(query)).rows;

            pgClient.release();
            return res.status(201).json({ account })

        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async filter (req, res) {
        const pool = new DbConfig().getPool();

        const { date_1, date_2 } = req.body;

        try {
            
            const pgClient = await pool.connect();

            const query = {
                text: "SELECT * FROM Books WHERE issuedate >= &1 AND issuedate < $2",
                values: [date_1, date_2],
            }

            const account = await (await pgClient.query(query)).rows;

            pgClient.release();
            return res.status(201).json({ account });
            

        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

// SELECT * FROM Books WHERE issuedate >= '2021-01-01' AND issuedate < '2022-01-01';