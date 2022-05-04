import { Router, json } from "express";
import { AuthController } from "../Controller/Auth";
import { IsSuperAdmin } from "../Middlewares/isSuperAdmin";

const router = Router();
const Controller = new AuthController();

router.post("/api/signup", json(), IsSuperAdmin, (req, res, next) => {
    Controller.signup(req, res, next);
});

router.post("/api/signin", json(), (req, res, next) => {
    Controller.signin(req, res, next);
});

router.post("/api/reset", json(), (req, res) => {
    Controller.reset(req, res);
});

router.post("/api/update", json(), (req, res) => {
    Controller.update(req, res);
});

export default router;