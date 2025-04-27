📝 Humanizing LLM Outputs
Description
This project aims to build a model capable of rephrasing the output of a Large Language Model (LLM) to make it sound more "human-like".

In many cases, even powerful LLMs generate text that feels slightly robotic, overly formal, or repetitive. Our goal is to develop an AI system that takes LLM-generated text as input and rewrites it in a way that sounds more natural, fluent, and conversational — just like a real human would write it.

Project Objectives
🎯 Reformulate LLM outputs to make them:

More natural

Clearer and easier to read

Friendly and engaging

🧠 Use two models:

A base LLM (Llama 2 through Ollama) to generate initial responses.

A paraphrasing model (Ateeqq/Text-Rewriter-Paraphraser) to rework the LLM outputs.

🌐 Expose the system through a simple Flask API to interact with it easily from a frontend or other applications.

How It Works
The user sends a question via an API endpoint (/ask).

The backend (Flask server):

Sends the conversation context to the LLM using LangChain.

Receives a first version of the answer.

Paraphrases this answer using a specialized text rewriter model (based on Transformer architecture).

The final humanized response is sent back to the user.

Stack & Technologies
🐍 Python

🛜 Flask (Backend API)

🔥 LangChain (to manage prompts and interaction with LLM)

🤗 Hugging Face Transformers (for the paraphraser model)

🚀 Ollama (to run Llama 2 locally)

🎯 Session management (for maintaining conversation history)
