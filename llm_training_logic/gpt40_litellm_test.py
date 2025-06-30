from openai import OpenAI
import json
import pathlib
import os

# Configuration
API_KEY = "sk-KH2efkW-Opu0xSq8FC8BgQ"
#API_KEY = "sk-5kRFa64mCahT1bpbyarK5Q"
API_BASE_URL = "http://0.0.0.0:4000"
# MODEL = "gpt-4o"

def get_client():
    """Initialize and return the OpenAI client."""
    return OpenAI(api_key=API_KEY, base_url=API_BASE_URL, max_retries=0)

def chat(model: str = "gpt-4o"):
    """Start an interactive chat with the model."""
    client = get_client()
    messages = [
        {"role": "system", "content": "You are a helpful AI assistant."}
    ]
    
    print("\nChat with the AI! Type 'quit', 'exit', or 'bye' to end the chat.\n")
    
    while True:
        try:
            # Get user input
            user_input = input("You: ")
            
            # Check for exit commands
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print("Goodbye!")
                break
                
            # Add user message to history
            messages.append({"role": "user", "content": user_input})
            params = load_character_params()
            TEMPERATURE = 0
            MAX_TOKENS = 0
            FREQUENCY_PENALTY = 0
            PRESENCE_PENALTY = 0
            print("\n\n\n\n#####################################################################")
            print("#####################################################################")
            print("#####################################################################")
            print("----------------------HERE ARE THE PARAMETERS:----------------------")
            print("#####################################################################")
            print("#####################################################################")
            print("#####################################################################\n\n\n\n")
            for k, v in params.items():
                if k == "MAX_TOKENS":
                    MAX_TOKENS = v * 10
                    print("Max Tokens: ", MAX_TOKENS)
                elif k == "Temperature":
                    TEMPERATURE = (0.011*v)
                    print("Temperature: ", TEMPERATURE)
                elif k == "FREQUENCY_PENALTY":
                    FREQUENCY_PENALTY = ((2.2*v)/100) - 0.2
                    print("Frequency Penalty: ", FREQUENCY_PENALTY)
                elif k == "PRES_PENALTY":
                    PRESENCE_PENALTY = (0.04*v) - 2
                    print("Presence Penalty: ", PRESENCE_PENALTY)

            # print(TEMPERATURE, MAX_TOKENS, FREQUENCY_PENALTY, PRESENCE_PENALTY)
            # Get model response
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature= TEMPERATURE,
                max_tokens=MAX_TOKENS,
                frequency_penalty= FREQUENCY_PENALTY,
                presence_penalty= PRESENCE_PENALTY
            )
            
            # Extract and display the response
            ai_reply = response.choices[0].message.content
            print(f"\nAI: {ai_reply}\n")
            
            # Add AI's response to history
            messages.append({"role": "assistant", "content": ai_reply})
            
        except KeyboardInterrupt:
            print("\nChat ended by user.")
            break
        except Exception as e:
            print(f"\nAn error occurred: {e}")
            break



PARAMS_PATH = pathlib.Path(__file__).resolve().parents[1] / "character_params.json"

def load_character_params():
    if PARAMS_PATH.exists():
        with open(PARAMS_PATH, 'r') as f:
            return json.load(f)
    # defaults if not yet saved
    return dict(Temperature=0.7, FREQUENCY_PENALTY=0.9, MAX_TOKENS=1000, PRESENCE_PENALTY=0.0)


if __name__ == "__main__":
    # Uncomment to run a quick test
    # test_model_call()
    params = load_character_params()
    print("Here are all the variables:")
    model = input("Enter what model you want to use: ") 
    # Start interactive chat
    chat(model = model)