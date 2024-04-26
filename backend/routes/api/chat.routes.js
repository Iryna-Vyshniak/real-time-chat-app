import { Router } from 'express';

import chatCtrl from '../../controllers/chat.controller.js';
import protectRoute from '../../middlewares/protectRoute.js';

const router = Router();

router.post('/group', protectRoute, chatCtrl.createGroupChat);
router.post('/group/:groupId/pin-group', protectRoute, chatCtrl.pinGroupChat);
router.put('/group-edit/:groupId', protectRoute, chatCtrl.updateGroupChat);
router.delete('/group/:groupId/delete-user', protectRoute, chatCtrl.deleteUserFromGroup);

export default router;
