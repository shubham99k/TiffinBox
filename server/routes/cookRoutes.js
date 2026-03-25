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
import { activeStatus } from '../middleware/activeStatusMiddleware.js'

const router = express.Router()

router.get('/all', getAllCooks)
router.get('/:id', getSingleCook)

router.post('/profile', protect, authorizeRoles('cook'), activeStatus, upload.single('photo'), createCookProfile)
router.get('/profile/me', protect, authorizeRoles('cook'), activeStatus, getCookProfile)
router.put('/profile', protect, authorizeRoles('cook'), activeStatus, upload.single('photo'), updateCookProfile)
router.put('/availability', protect, authorizeRoles('cook'), activeStatus, toggleAvailability)

export default router