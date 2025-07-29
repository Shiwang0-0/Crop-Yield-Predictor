import express from 'express'
import {register, login, getProfile, predict, getRandomData} from '../controller/user'
import { isAuthenticated } from '../middleware/auth';

const router= express.Router();

router.post("/register", register);
router.post("/login", login);

router.use(isAuthenticated);

router.get("/getProfile",getProfile);
router.get("/randomData",getRandomData);
router.post("/predict",predict);

export default router;