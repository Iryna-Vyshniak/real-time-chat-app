import { Router } from 'express';

import userCtrl from '../../controllers/user.controller.js';
import protectRoute from '../../middlewares/protectRoute.js';

const router = Router();

router.get('/', protectRoute, userCtrl.getUsersForSidebar);
router.patch('/messages', protectRoute, userCtrl.updateMessageStatus);

export default router;
