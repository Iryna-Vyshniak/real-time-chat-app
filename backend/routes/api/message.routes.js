import { Router } from 'express';

import messageCtrl from '../../controllers/message.controller.js';
import validateBody from '../../decorators/validateBody.js';
import messageValidation from '../../schema/message.schema.js';
import protectRoute from '../../middlewares/protectRoute.js';
import { uploadMiddleware } from '../../middlewares/uploadMiddleware.js';

const router = Router();

const messageValidate = validateBody(messageValidation);

router.get('/:id', protectRoute, messageCtrl.getMessages);
router.post('/send/:id', protectRoute, messageValidate, uploadMiddleware, messageCtrl.sendMessage);
router.patch(
  '/:id/emoji/:messageId',
  protectRoute,
  messageValidate,
  uploadMiddleware,
  messageCtrl.sendEmoji
);
router.patch(
  '/:id/emoji-remove/:messageId',
  protectRoute,
  messageValidate,
  uploadMiddleware,
  messageCtrl.removeEmoji
);
router.put('/edit/:id/:messageId', protectRoute, messageValidate, messageCtrl.editMessage);
router.delete(
  '/delete/:id',
  protectRoute,
  messageValidate,
  uploadMiddleware,
  messageCtrl.deleteMessage
);

export default router;
