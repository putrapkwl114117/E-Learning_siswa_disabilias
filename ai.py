# import os
# from openai import OpenAI
# from dotenv import load_dotenv

# # Muat file .env
# load_dotenv()
# OpenAI.api_key = os.getenv("OPEN_API_KEY")

# client = OpenAI.api_key = os.getenv("OPEN_API_KEY")
# # Example OpenAI Python library request
# MODEL = "gpt-3.5-turbo"
# # example with a system message
# response = client.completions.create(
#     model=MODEL,
#     messages=[
#         {"role": "system", "content": "You are a helpful assistant."},
#         {"role": "user", "content": "Explain asynchronous programming in the style of the pirate Blackbeard."},
#     ],
#     temperature=0,
# )

# print(response.choices[0].message.content)
