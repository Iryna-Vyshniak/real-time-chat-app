import { Router } from 'express';

import authCtrl from '../../controllers/auth.controller.js';
import validateBody from '../../decorators/validateBody.js';
import { userLoginSchema, userSignupSchema } from '../../schema/user.schema.js';

const router = Router();

const userSignupValidate = validateBody(userSignupSchema);
const userLoginValidate = validateBody(userLoginSchema);

router.post('/signup', userSignupValidate, authCtrl.signup);

router.post('/login', userLoginValidate, authCtrl.login);

router.post('/logout', authCtrl.logout);

export default router;
