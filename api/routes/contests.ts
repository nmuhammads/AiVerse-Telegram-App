import { Router } from 'express'
import { getContests, getContestDetails, getContestEntries, joinContest } from '../controllers/contestController.js'

const router = Router()

router.get('/', getContests)
router.get('/:id', getContestDetails)
router.get('/:id/entries', getContestEntries)
router.post('/:id/join', joinContest)

export default router
