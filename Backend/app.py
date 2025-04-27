from flask import Flask, request, jsonify, session
from flask_cors import CORS  # Import CORS
from langchain_ollama import OllamaLLM  # Import the new Ollama class
from langchain.prompts import PromptTemplate  # Use the prompt template from LangChain
from langchain.chains import LLMChain  # Import the LLMChain class from core langchain
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import uuid  # To generate a session ID

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for the frontend origin
CORS(app, origins="http://localhost:5173", supports_credentials=True)  # Adjust the frontend URL if necessary

# Initialize Ollama with Llama2 model (Ensure Ollama is running locally)
llm = OllamaLLM(model="llama2")  # This connects to the running Ollama service

# Initialize Text-Rewriter model (Ateeqq/Text-Rewriter-Paraphraser)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
tokenizer = AutoTokenizer.from_pretrained("Ateeqq/Text-Rewriter-Paraphraser")
model = AutoModelForSeq2SeqLM.from_pretrained("Ateeqq/Text-Rewriter-Paraphraser").to(device)

# Set up session for user-specific memory
app.secret_key = "your_secret_key"  # Secret key for session management

# Function to generate paraphrased text
def generate_title(text):
    input_ids = tokenizer(f'paraphraser: {text}', return_tensors="pt", padding="longest", truncation=True, max_length=64).input_ids.to(device)
    outputs = model.generate(
        input_ids,
        num_beams=4,
        num_beam_groups=4,
        num_return_sequences=4,
        repetition_penalty=10.0,
        diversity_penalty=3.0,
        no_repeat_ngram_size=2,
        temperature=0.8,
        max_length=64
    )
    return tokenizer.batch_decode(outputs, skip_special_tokens=True)

# More precise system-level prompt for human-like responses
system_prompt = """ 
You are a friendly, professional, and approachable AI assistant. Your responses should be:
1. Clear and concise.
2. Well-structured and easy to understand.
3. Engaging, with a natural conversational tone.
4. Avoid being overly formal or robotic.
5. Provide relevant examples if necessary to clarify your response.
6. If asked a question, answer directly with as much helpful information as possible.
7. Avoid long, unnecessary sentences or jargon unless the context requires it.

Answer the following question in a human-like, friendly manner:
"""

# Create the main prompt template
prompt = PromptTemplate(
    input_variables=["conversation"],
    template=f"{system_prompt}\n{{conversation}}"
)

# Using LLMChain for chaining the prompt and the LLM
chain = LLMChain(llm=llm, prompt=prompt)

# Flask route to handle POST requests
@app.route('/ask', methods=['POST'])
def answer_question():
    # Handle ping request for API status check
    if request.json.get('question') == 'ping':
        return jsonify({"answer": "pong"})
    
    # Ensure a session ID is set for the user
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())  # Assign a unique session ID
    
    user_message = request.json['question']
    
    # Get conversation history from request
    conversation_history = request.json.get('conversation_history', [])
    
    # Format the conversation history for the LLM
    formatted_conversation = ""
    if conversation_history:
        for msg in conversation_history:
            role = msg['role']
            content = msg['content']
            formatted_conversation += f"{role.capitalize()}: {content}\n"
    else:
        formatted_conversation = user_message
    
    # Use LangChain to get an answer from the LLM with the full conversation context
    result = chain.run(conversation=formatted_conversation)
    
    # Use the Text-Rewriter to paraphrase the result
    paraphrased_result = generate_title(result)
    
    # Maintain conversation history in session if needed
    if 'conversation_history' not in session:
        session['conversation_history'] = []
    
    session['conversation_history'].append({'role': 'user', 'message': user_message})
    session['conversation_history'].append({'role': 'bot', 'message': paraphrased_result[0]})
    
    # Return the paraphrased text as the response
    return jsonify({"answer": paraphrased_result[0]})

if __name__ == '__main__':
    app.run(debug=True, port=5000)