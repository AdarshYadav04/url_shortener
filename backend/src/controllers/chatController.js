import axios from "axios";
const PYTHON_API_URL = process.env.PYTHON_API_URL;
const PYTHON_API_KEY = process.env.PYTHON_API_KEY;

/** Upstream (RAG) request timeout — Render free tier cold starts can exceed 30s */
const UPSTREAM_TIMEOUT_MS = Number(process.env.PYTHON_CHAT_TIMEOUT_MS) || 60000;

export const chatController = async (req, res) => {
  const { question } = req.body;
  try {
    if (!PYTHON_API_URL) {
      return res.status(500).json({ error: "PYTHON_API_URL is not set" });
    }
    if (!PYTHON_API_KEY) {
      return res.status(500).json({ error: "PYTHON_API_KEY is not set" });
    }

    const response = await axios.post(
      `${PYTHON_API_URL}/chat`,
      {
        query: question,
        top_k: req.body?.top_k ?? 1,
        temperature: req.body?.temperature ?? 2,
        include_sources: req.body?.include_sources ?? true,
      },
      {
        timeout: UPSTREAM_TIMEOUT_MS,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-API-Key": PYTHON_API_KEY,
        },
        validateStatus: () => true,
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return res.status(200).json(response.data);
    }

    const upstream = response.status;
    const clientStatus =
      upstream >= 500 ? 502 : upstream === 401 || upstream === 403 ? upstream : 400;
    console.error("chatController: upstream non-OK", {
      status: upstream,
      dataSnippet:
        typeof response.data === "string"
          ? response.data.slice(0, 200)
          : response.data,
    });
    return res.status(clientStatus).json({
      error: "RAG service returned an error",
      upstreamStatus: upstream,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const upstream = error.response?.status;
      if (upstream === 502 || upstream === 503 || upstream === 504) {
        console.error("chatController: upstream unavailable", upstream);
        return res.status(502).json({
          error: "RAG service is unavailable (upstream error)",
          upstreamStatus: upstream,
        });
      }
      if (error.code === "ECONNABORTED") {
        console.error("chatController: upstream timeout");
        return res.status(504).json({ error: "RAG service request timed out" });
      }
      if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
        console.error("chatController: connection failed", error.code);
        return res.status(502).json({ error: "Could not reach RAG service" });
      }
    }
    console.error("Error in chatController:", error);
    return res.status(500).json({ error: "Error in chatController" });
  }
};