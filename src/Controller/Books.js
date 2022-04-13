import { DbConfig } from "../Config/db.config";
import { compare } from "bcrypt";

export class BookController {
    async addBook (req, res) {
        const pool = new DbConfig().getPool();

        const { name, isbn, issuedate, author } = req.body;

        if (!name || !isbn || !issuedate || !author) {
            return res.status(400).json({ msg: "All fields are required to login" })
        }

        try {
            
            const pgClient = await pool.connect();

            const query = {
                text: "INSERT INTO Books (name, isbn, issuedate, author) VALUES ($1, $2, $3, $4)",
                values: [name, isbn,issuedate, author],
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

        const { isbn } = req.body;

        try {
            
            const pgClient = await pool.connect();

            const query = {
                text: "DELETE FROM Books WHERE isbn = $1",
                values: [isbn],
            }

            await pgClient.query(query).rows;
            pgClient.release();
            return res.status(201).json({ msg: "Book deleted"})

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

        try {
            
            const pgClient = await pool.connect();

            let query = {
                text: "SELECT * FROM Books",
            }

            let books = await (await pgClient.query(query)).rows;

            pgClient.release();
            return res.status(201).json({ books })

        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async filter (req, res) {
        const pool = new DbConfig().getPool();

        const { issuedate, author } = req.body;

        try {
            
                const pgClient = await pool.connect();

                const queryDate = {
                    text: "SELECT * FROM Books WHERE issuedate = $1",
                    values: [issuedate],
                }
        
                const queryAuthor = {
                    text: "SELECT * FROM Books WHERE author = $1",
                    values: [author],
                }
                // console.log(queryAuthor);
    
                const bookIssue = await (await pgClient.query(queryDate)).rows[0];
                const isValidDate = await compare(issuedate, bookIssue.issuedate);
                console.log("dsd");

                const bookAuthor = await (await pgClient.query(queryAuthor)).rows[0];
                const isValidAuthor = await compare(author, bookAuthor.author);
                console.log(bookAuthor);

                if(!isValidDate || !isValidAuthor) {
                    pgClient.release();
                    return res.status(201).json({ bookIssue });
                } else {
                    pgClient.release();
                    return res.status(400).json({ msg: "invalid" }); 
                }
                
    
            } catch (error) {
                return res.status(500).json(error)
            }

    }
}
