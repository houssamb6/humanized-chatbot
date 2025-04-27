#  Humanizing LLM 

---

##  Project Overview

This project builds a model capable of **rephrasing the output of a Large Language Model (LLM)** to make it sound more **natural, fluent, and human-like**.

In many cases, even powerful LLMs generate text that feels robotic or overly formal.  
Our goal is to **develop an AI system that rewrites LLM outputs** to sound more **approachable, conversational, and real** — like a text written by a human.

---

## 🎯 Objectives

- Reformulate LLM outputs to be:
  - Natural and easy to read
  - Friendly and engaging
  - Clear and concise
- Combine the power of:
  - A **base LLM** (Llama 2 via [Ollama](https://ollama.com/))
  - A **paraphrasing model** ([Ateeqq/Text-Rewriter-Paraphraser](https://huggingface.co/Ateeqq/Text-Rewriter-Paraphraser))
- Serve the humanized responses through a simple **Flask API**.

---
##  Project Structure

- **Backend** (`/backend`): Flask server running the Llama2 model (local API).
- **Frontend** (`/frontend`): React Vite application for the user interface.

---
## ⚙️ How It Works

1. **User** sends a question to the API (`/ask` endpoint).
2. **Backend** processes it:
   - Sends the conversation context to the LLM via **LangChain**.
   - Receives a first draft response.
   - Passes the response through the **Text Rewriter** model to paraphrase it.
3. **Final Output**: A smooth, natural-sounding answer is returned.

---

## 🛠️ Technologies Used

| Technology | Role |
| :--- | :--- |
| Python | Programming Language |
| Flask | Backend Web Framework |
| LangChain | Prompt Management & LLM Chaining |
| Hugging Face Transformers | Paraphraser Model |
| Ollama | Local LLM Deployment (Llama 2) |
| PyTorch | Deep Learning Library (for paraphraser) |

---

##  Getting Started

### Prerequisites
- Python 3.8+
- Ollama installed and running locally (with the Llama2 model pulled)
- GPU (optional but recommended for paraphrasing speed)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/humanizing-llm.git
   cd humanizing-llm
   ```

2. **Install the required packages:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask server:**
   ```bash
   python app.py
   ```

4. **Access the API at:**
   ```
   http://localhost:5000
   ```

---

##  API Usage

### Endpoint

- **POST** `/ask`

### Request Body Example

```json
{
  "question": "What is the importance of AI?",
  "conversation_history": [
    {"role": "user", "content": "Hello!"},
    {"role": "bot", "content": "Hi, how can I help you?"}
  ]
}
```

### Response Example

```json
{
  "answer": "AI plays a crucial role in modern society by improving efficiency, decision-making, and driving innovation across various industries."
}
```

---
Features

- Human-like chat interface
- Online/offline backend status indicator
- Mobile responsive design
- Dark mode / Light mode compatible
- Smooth interaction with local Llama2 backend
- Simple memory management via Flask sessions
- 
##  Demo
<div align="center">
  <img src="src/assets/Capture d'écran 2025-04-27 065613.png" alt="Image 1" />
</div>
<div align="center">
  <img src="./assets/Capture d'écran 2025-04-27 065642.png" alt="Image 2" />
</div>
<div align="center">
  <img src="./assets/Capture d'écran 2025-04-27 065711.png" alt="Image 3" />
</div>
<div align="center">
  <img src="./assets/Capture d'écran 2025-04-27 065753.png" alt="Image 4" />
</div>
<div align="center">
  <img src="./assets/Capture d'écran 2025-04-27 065812.png" alt="Image 5" />
</div>


##  Why This Project?

In real-world applications, **sounding human** is critical for AI systems like:
- Virtual assistants
- Chatbots
- Content generation tools

This project aims to **bridge the gap** between machine output and real human communication — making AI more natural, relatable, and effective.

---

##  Future Improvements

- Fine-tune the paraphraser model for even better results
- Personalize responses based on user profiles
- Add support for multiple LLMs (Llama 3, Mistral, etc.)

---


# Let's make AI sound more human!

