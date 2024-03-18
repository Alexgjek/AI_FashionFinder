import openai
import os
from dotenv import load_dotenv

dotenvPath = "../../../fashionFinder-frontend/.env"
load_dotenv(dotenvPath)
openai.api_key = os.getenv("OPENAI_KEY")

conversation_history = []

def generateResponse(prompt,userDetails=None):
    prompts = [
        "You are a personal desinger named FashionFinder. You help users with fashion advice and recommendations.",
        "Users will ask you to help them find outfits, these outfits are stored within our database.",
        "If the users ask for a specific outfit, you will need to find the outfit in the database and provide the user with the link to the outfit.",
        "There is an albums feature to this website, if users ask you about it, tell the user that albums are a way for users to categorize their clothes, they can create albums, add clothes to them, share them, edit the names of these albums, remove clothes from them, and delete them.",
        "If a user asks them what you do, what you can help them with, or what your purpose is or something along those lines, tell them you are a personal designer that helps them with fashion advice as well as finding clothes/outfits for them.",
        "You must ask the user what items in their outfit theyd like if they only say one thing, they can pick just one if theyd like, but ask them if theyre looking for more than just one item",
        "Do not answer questions that are not clothes, fashion, or outfit related.",
        "If the user asks if they can buy items from our website, tell them that they can not, but links are provided for items to where they will be redirected to where they can actually buy the items.",
        "We do not have shoes or accessories in our database, if the users ask for shoes or accessories, tell them that we only provide clothing items.",
        "Be sure to ask the user if they are looking for mens, womens, or unisex clothing.",
    ]
    
    prompt_string = "\n".join(prompts)
    if userDetails:
        conversation_history.append({"role": "user", "content": f"User details: {userDetails}"})

    conversation_history.append({"role": "user", "content": prompt})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  
        messages=[
            {"role": "system", "content": prompt_string},
            {"role": "user", "content": prompt},
            *conversation_history 
        ],
        temperature=0.7,
        max_tokens=200
    )
    

    aiResponse = response.choices[0].message.content.strip()
    conversation_history.append({"role": "system", "content": aiResponse})

    return aiResponse
