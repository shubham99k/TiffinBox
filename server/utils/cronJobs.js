import cron from 'node-cron'
import Menu from '../models/Menu.js'

const startCronJobs = () => {

  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date()

      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const currentTime = `${hours}:${minutes}`

      const today = now.toISOString().split('T')[0]

      await Menu.updateMany(
        {
          date: today,
          isActive: true,
          cutoffTime: { $lte: currentTime }
        },
        {
          $set: { isActive: false }
        }
      )

    } catch { }
  })
}

export default startCronJobs