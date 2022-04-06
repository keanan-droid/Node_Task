import { Router, json } from "express";
import { BookController } from "../Controller/Books"

const router = Router();
const Controller = new BookController();

router.post("/api/inventory", json(), (req, res) => {
    Controller.addBook(req, res);
});

router.delete("/api/inventory", json(), (req, res) => {
    Controller.deleteBook(req, res);
});

router.get("/api/inventory/:id", json(), (req, res) => {
    Controller.bookById(req, res);
});

router.get("/api/inventory", json(), (req, res) => {
    Controller.allBooksById(req, res);
});

router.post("/api/inventory-filter", json(), (req, res) => {
    Controller.filter(req, res);
});

export default router;