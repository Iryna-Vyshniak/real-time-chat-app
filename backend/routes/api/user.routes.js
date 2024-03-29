import { Router } from 'express';

import userCtrl from '../../controllers/user.controller.js';
import protectRoute from '../../middlewares/protectRoute.js';

const router = Router();

router.get('/', protectRoute, userCtrl.getUsersForSidebar);
router.get('/:id', protectRoute, userCtrl.getUserInfo);
router.patch('/messages', protectRoute, userCtrl.updateMessageStatus);
router.put('/update/:id', protectRoute, userCtrl.updateUser);

export default router;
