import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'
import mongoose from 'mongoose'

const app = express()
// Render usually uses port 10000, local uses 3001
const PORT = process.env.PORT || 3001

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ CrazyWeb Database Connected!"))
  .catch(err => console.error("❌ DB Connection Error:", err))

// --- LEAD SCHEMA ---
const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
})
const Lead = mongoose.model('Lead', leadSchema)

// --- MIDDLEWARE ---
// CORS is now open for your Vercel deployment
app.use(cors())
app.use(express.json())

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are the CrazyWeb.Studio AI — the digital voice of Indore's most elite 3D web agency. Persona: Confident, intelligent, premium.`

// --- ROUTES ---

// 1. Root Route (Render Health Check ke liye ZAROORI hai)
app.get('/', (req, res) => {
  res.status(200).send('CrazyWeb API is hyperspace ready! 🚀');
});

// 2. Health Status API
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// 3. Contact API Route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email) return res.status(400).json({ error: "Name and Email are required." })

    const newLead = new Lead({ name, email, message })
    await newLead.save()

    res.status(201).json({ success: true, message: "Lead captured in hyperspace! 🚀" })
  } catch (err) {
    console.error("Lead Save Error:", err)
    res.status(500).json({ error: "Failed to save lead." })
  }
})

// 4. AI Chat Route
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages array is required' })

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-10)],
      max_tokens: 200,
      temperature: 0.75,
    })
    const message = completion.choices[0]?.message?.content ?? 'Something went wrong.'
    return res.json({ message })
  } catch (err) {
    console.error('OpenAI error:', err)
    return res.status(500).json({ message: 'AI error.' })
  }
})

// --- SERVER START ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 CrazyWeb.Studio API running on port ${PORT}`)
  console.log(`   AI Status: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '⚠️ Missing Key'}`)
})