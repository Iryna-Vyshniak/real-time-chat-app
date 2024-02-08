import { Router } from 'express';

import messageCtrl from '../../controllers/message.controller.js';
import validateBody from '../../decorators/validateBody.js';
import messageValidation from '../../schema/message.schema.js';
import protectRoute from '../../middlewares/protectRoute.js';

const router = Router();

const messageValidate = validateBody(messageValidation);

router.get('/:id', protectRoute, messageCtrl.getMessages);
router.post('/send/:id', protectRoute, messageValidate, messageCtrl.sendMessage);

export default router;
