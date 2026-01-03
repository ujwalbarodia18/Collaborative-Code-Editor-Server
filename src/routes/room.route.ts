import { Router } from 'express';
import { createRoom, getRoom, isRoomPasswordProtected } from '../controllers/room.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/createRoom', authMiddleware, async (req, res) => {
  try {
    const { name, password } = req.body;
    const room = {
      name,
      ...(password ? {password} : {})
    };
    const roomDoc = await createRoom(room);

    res.status(201).json({ status: 1, data: roomDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

router.post('/getRoom', async (req, res) => {
  try {
    const { roomId, password } = req.body;
    const room = await getRoom(roomId, password);
    res.status(201).json({ status: 1, data: room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

router.post('/isRoomPasswordProtected', async (req, res) => {
  try {
    const { roomId } = req.body;
  
    const room = await isRoomPasswordProtected(roomId);
    res.status(201).json({ status: 1, data: room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create room' });
  }
});
export default router;