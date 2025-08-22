import express from 'express'
import {register, login, getProfile, predict, publishPrediction, getRandomData, publishSupportRequest, homeStats, logout} from '../controller/user.js'
import { isAuthenticated } from '../middleware/auth.js';
import { userSupportReq } from '../controller/support.js';

const router= express.Router();

router.post("/register", register);
router.post("/login", login);

router.use(isAuthenticated);

router.get("/getProfile",getProfile);
router.get("/homeStats",homeStats);
router.get("/randomData",getRandomData);
router.get("/logout", logout);

router.post("/predict",predict);
router.post("/publish",publishPrediction);
router.post("/publish-support-request",publishSupportRequest);
router.get("/user-support-request",userSupportReq);

export default router;