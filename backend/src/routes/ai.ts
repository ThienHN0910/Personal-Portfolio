import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { requireAdmin } from '../lib/auth'

const router = Router()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

router.post('/improve-content', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  try {
    const { content } = req.body

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' })
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: 'Gemini API Key is not configured' })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' })

    const prompt = `Bạn là một chuyên gia viết blog và biên tập nội dung HTML. Hãy sửa lại nội dung HTML sau đây, cải thiện văn phong, sửa lỗi chính tả, tối ưu hóa các thẻ HTML và thêm inline style để nội dung trông chuyên nghiệp và đẹp mắt hơn. Layout nên được sắp xếp tốt hơn nếu có thể. CHỈ trả về đoạn mã HTML, KHÔNG bao gồm markdown (như \`\`\`html) hay bất kỳ lời giải thích nào khác.\n\nContent:\n${content}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    // Clean up potential markdown formatting that Gemini sometimes includes despite instructions
    text = text.replace(/^```html\n?/i, '').replace(/\n?```$/i, '').trim()

    return res.status(200).json({ success: true, data: text })
  } catch (error: any) {
    console.error('Error calling Gemini API:', error)
    return res.status(500).json({ success: false, error: 'Failed to improve content' })
  }
})

export default router
