import { Router } from 'express';

import userCtrl from '../../controllers/user.controller.js';
import protectRoute from '../../middlewares/protectRoute.js';

const router = Router();

router.get('/', protectRoute, userCtrl.getUsersForSidebar);

export default router;
