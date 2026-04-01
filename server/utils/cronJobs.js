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

      const result = await Menu.updateMany(
        {
          date: today,
          isActive: true,
          cutoffTime: { $lte: currentTime }
        },
        {
          $set: { isActive: false }
        }
      )

      if (result.modifiedCount > 0) {
        console.log(`Cron: Marked ${result.modifiedCount} menus as inactive`)
      }

    } catch (error) {
      console.log('Cron error:', error.message)
    }
  })

  console.log('Cron jobs started')
}

export default startCronJobs