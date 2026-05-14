import axios from "axios"
const PYTHON_API_URL = process.env.PYTHON_API_URL;
const PYTHON_API_KEY = process.env.PYTHON_API_KEY;

export const chatController = async (req, res) => {
  
    const { question } = req.body;
    try {
        if (!PYTHON_API_URL) {
          return res.status(500).json({ error: "PYTHON_API_URL is not set" });
        }
        if (!PYTHON_API_KEY) {
          return res.status(500).json({ error: "PYTHON_API_KEY is not set" });
        }

        const response = await axios.post(`${PYTHON_API_URL}/chat`, {
          query: question,
          top_k: req.body?.top_k ?? 1,
          temperature: req.body?.temperature ?? 2,
          include_sources: req.body?.include_sources ?? true,
        },{
            headers: {
              "accept": "application/json",
              "Content-Type": "application/json",
              "X-API-Key": PYTHON_API_KEY
            }
          });
        
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error in chatController:', error);
        return res.status(500).json({ error: 'Error in chatController' });
    }
};