import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: { persistSession: false }
  }
)

const categories = ['food', 'rent', 'car', 'entertainment', 'transport']

async function seedTransactions () {
  const { error: deleteError } = await supabase
    .from('transactions')
    .delete()
    .gte('id', 0)

  if (deleteError) {
    console.error('Error deleting existing data:', deleteError)
    return
  }

  const transactions = []

  for (
    let year = new Date().getFullYear();
    year > new Date().getFullYear() - 2;
    year--
  ) {
    for (let i = 0; i < 10; i++) {
      const date = new Date(
        year,
        faker.number.int({ min: 0, max: 11 }),
        faker.number.int({ min: 1, max: 28 })
      )

      let type, tag
      const typeBias = Math.random()

      if (typeBias < 0.85) {
        type = 'expense'
        tag = faker.helpers.arrayElement(categories) // Category only for 'Expense'
      } else if (typeBias < 0.95) {
        type = 'income'
      } else {
        type = faker.helpers.arrayElement(['savings', 'investment'])
      }

      let amount
      switch (type) {
        case 'income':
          amount = faker.number.int({ min: 2000, max: 5000 })
          break
        case 'expense':
          amount = faker.number.int({ min: 100, max: 1000 })
          break
        case 'savings':
        case 'investment':
          amount = faker.number.int({ min: 5000, max: 10000 })
          break
        default:
          amount = 0
      }

      const something = {
        created_at: date,
        amount,
        type,
        description: faker.lorem.sentence(),
        tag: type === 'expense' ? tag : null // Category only for 'Expense'
      }

      transactions.push(something)
    }
  }
  const { error: insertError } = await supabase
    .from('transactions')
    .upsert(transactions)

  if (insertError) {
    console.error('Error inserting data:', insertError)
  } else {
    console.log('Data inserted successfully.')
  }
}

seedTransactions().catch(console.error)
