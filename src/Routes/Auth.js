import { Router, json } from "express";
import { AuthController } from "../Controller/Auth";

const router = Router();
const Controller = new AuthController();

router.post("/api/signup", json(), (req, res) => {
    Controller.signup(req, res);
});

router.post("/api/signin", json(), (req, res) => {
    Controller.signin(req, res);
});

router.post("/api/reset", json(), (req, res) => {
    Controller.reset(req, res);
});

router.post("/api/update", json(), (req, res) => {
    Controller.update(req, res);
});

export default router;