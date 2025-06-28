// const express = require("express");
// const router = express.Router();
// const { OpenAI } = require("openai");
// require("dotenv").config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// router.get("/", (req, res) => {
//   res.send("Chat route");
// });
// router.post("/chat", async (req, res) => {
//   const { message } = req.body;
//   console.log("Request Body:", req.body);
//   if (!message) {
//     return res.status(400).json({ error: "Message is required" });
//   }
//   try {
//     const response = await openai.completions.create({
//       model: "gpt-3.5-turbo", //free
//       // model: "gpt-4",//paid
//       messages: [{ role: "user", content: message }],
//       max_tokens: 50,
//     });
//     res.json({ response: response.choices[0].message.content.trim() });
//     // res.json({ response: response.data.choices[0].text });
//   } catch (err) {
//     console.error("OpenAI API Error:", err);
//     res
//       .status(500)
//       .json({ error: "Internal server error error in catch section" });
//   }
// });
// module.exports = router;
//////////////////////old code////////////
// const express = require("express");
// const router = express.Router();
// const axios = require("axios");

// const HF_API_KEY = process.env.HUGGINGFACE_API_KEY; // Replace with your API key
// const HUGGING_FACE_API_URL =
//   "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B";
// // Change model if needed

// router.get("/", (req, res) => {
//   res.send("Chat route");
// });

// router.post("/chat", async (req, res) => {
//   const { message } = req.body;
//   console.log("Request Body:", req.body);

//   if (!message) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   try {
//     const response = await axios.post(
//       HUGGING_FACE_API_URL, // Use backticks for string interpolation
//       { inputs: message },
//       {
//         headers: { Authorization: `Bearer ${HF_API_KEY}` }, // Fix template literals
//       }
//     );

//     const botResponse = response.data[0]?.generated_text || "No response";
//     res.json({ response: botResponse.trim() });
//   } catch (err) {
//     console.error("Hugging Face API Error:", err);
//     res.status(500).json({ error: "Internal server error error in catch" });
//   }
// });

// module.exports = router;

/////////////////////updated chat route code///////////////////////
const express = require("express");
const router = express.Router();
const axios = require("axios");

// const HF_API_KEY = process.env.HUGGINGFACE_API_KEY; // Replace with your API key
// const HUGGING_FACE_API_URL =
//   "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B";
// Change model if needed

router.get("/", (req, res) => {
  res.send("Chat route");
});

router.post("/chat", async (req, res) => {
  const { message } = req.body;
  console.log("Request Body:", message);

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          // "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
          "X-Title": "My vnyAI chat app", // Optional. Site title for rankings on openrouter.ai.
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    // const botResponse = response.data[0]?.generated_text || "No response";
    // res.json({ response: botResponse.trim() });

    const json = await response.json(); // ✅ important fix

    const botResponse = json.choices?.[0]?.message?.content || "No response";
    res.json({ response: botResponse.trim() });
  } catch (err) {
    console.error("OPENROUTER API Error:", err);
    res.status(500).json({
      error: "Internal server error error in catch",
      apiError: err.message,
    });
  }
});

module.exports = router;
