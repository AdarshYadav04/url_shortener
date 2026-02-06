import axios from "axios"
const PYTHON_API_URL = process.env.PYTHON_API_URL;

export const chatController = async (req, res) => {
    const { question } = req.body;
    try {
        const response = await axios.post(`${PYTHON_API_URL}/chat`, { question },{
            headers: {
              "Content-Type": "application/json"
            },
            timeout: 60000
          });
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error in chatController:', error);
        return res.status(500).json({ error: 'Error in chatController' });
    }
};