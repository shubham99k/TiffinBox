import express from 'express'
import {
  createCookProfile,
  getCookProfile,
  updateCookProfile,
  getAllCooks,
  getSingleCook,
  toggleAvailability
} from '../controllers/cookController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/all', getAllCooks)
router.get('/:id', getSingleCook)

router.post('/profile', protect, authorizeRoles('cook'), upload.single('photo'), createCookProfile)
router.get('/profile/me', protect, authorizeRoles('cook'), getCookProfile)
router.put('/profile', protect, authorizeRoles('cook'), upload.single('photo'), updateCookProfile)
router.put('/availability', protect, authorizeRoles('cook'), toggleAvailability)

export default router