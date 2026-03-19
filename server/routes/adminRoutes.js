import express from 'express'
import {
  getPendingCooks,
  verifyCook,
  rejectCook,
  getAllUsers,
  getStats,
  banUser
} from '../controllers/adminController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.use(protect)
router.use(authorizeRoles('admin'))

router.get('/cooks/pending', getPendingCooks)
router.put('/cooks/:id/verify', verifyCook)
router.put('/cooks/:id/reject', rejectCook)
router.get('/users', getAllUsers)
router.get('/stats', getStats)
router.put('/users/:id/ban', banUser)

export default router