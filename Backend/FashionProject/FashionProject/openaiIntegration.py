import openai
import os
import random
import math
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


from bson.json_util import dumps
import json

dotenvPath = "../../../fashionFinder-frontend/.env"
load_dotenv(dotenvPath)
# load_dotenv()
openai.api_key = os.getenv("OPENAI_KEY")


conversation_history = []

def generateResponse(prompt,userDetails=None):
    prompts = [
        "You are a personal desinger named FashionFinder. You help users with fashion advice and recommendations.",
        "Users will ask you to help them find outfits, these outfits are stored within our database.",
        # "If the users ask for a specific outfit, you will need to find the outfit in the database and provide the user with the link to the outfit.",
        "There is an albums feature to this website, if users ask you about it, tell the user that albums are a way for users to categorize their clothes, they can create albums, add clothes to them, share them, edit the names of these albums, remove clothes from them, and delete them.",
        "If a user asks them what you do, what you can help them with, or what your purpose is or something along those lines, tell them you are a personal designer that helps them with fashion advice as well as finding clothes/outfits for them.",
        # "You must ask the user what items in their outfit theyd like if they only say one thing, they can pick just one if theyd like, but ask them if theyre looking for more than just one item",
        "You must ask the user what items in their outfit theyd like, they can pick just one item",
        "Do not answer questions that are not clothes, fashion, or outfit related.",
        "If the user asks if they can buy items from our website, tell them that they can not, but links are provided for items to where they will be redirected to where they can actually buy the items.",
        "We do not have shoes or accessories in our database, if the users ask for shoes or accessories, tell them that we only provide clothing items.",
        "Be sure to ask the user if they are looking for mens, womens, or unisex clothing."
        "Do not ask the user to confirm for what they ask for",
        "Do not ask user to specify the shade of color they want",
        "When the user tells you they are looking for any type of pants like shorts or jeans or bottoms, do not ask for waist and hip size",
        "If the user doesn't give you a size or color, keep asking them and let them know that those are needed for you to proceed",
        "The user only needs to specify one size, one type, one color and one gender",
        "You are not responsible for the search",
        "You do not know what we have in the database, so do not talk about that",
        "Do not tell the user that we don't have something in the database",
        "If the user asks for dresses or dress, do not ask them to specific type",
        "You do not do the searching",
        "Make sure to ask the user about the item type, color, size and the gender, and once you gather all these attributes, respond with the message \"BEGIN_SEARCH\" and include all the matching attributes as a JSON object in this format {\"itemType\":,\"size\":,\"color\":,\"gender\":}"# and do not replay with anything else",
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


def searchMongo(collectionName, subCollectionName, itemColor, itemSize, budget, gender): 
    MONGODB = os.getenv("MONGO_URI")
    print(MONGODB)

    #Create a new client and connect to the server
    client = MongoClient(MONGODB, server_api=ServerApi('1'))
    items = []

    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        didConnect = True

        # FIX SUBCOLLECTION
        match subCollectionName.lower():
            case "top":
                subCollectionName = "top"
            case "tops":
                subCollectionName = "top"
            case "tshirt":
                subCollectionName = "top"
            case "tshirts":
                subCollectionName = "top"
            case "t-shirt":
                subCollectionName = "top"
            case "t-shirts":
                subCollectionName = "top"
            case "short":
                subCollectionName = "shorts"
            case "shorts":
                subCollectionName = "shorts"
            case "jeans":
                subCollectionName = "pants"
            case "jean":
                subCollectionName = "pants"
            case "sweatpants":
                subCollectionName = "pants"
            case "leggings":
                subCollectionName = "pants"
            case "skirts":
                subCollectionName = "skirts"
            case "skirt":
                subCollectionName = "skirts"
            case "hoodie":
                subCollectionName = "hoodie"
            case "hoodies":
                subCollectionName = "hoodie"
            case "zip-up hoodie":
                subCollectionName = "hoodie"
            case "zip up hoodie":
                subCollectionName = "hoodie"
            case "suits":
                subCollectionName = "suit"
            case "suit":
                subCollectionName = "suit"
            case "suit jacket":
                subCollectionName = "suit"
            case "suit pants":
                subCollectionName = "suit"
            case "dresses":
                subCollectionName = "dress"
            case "dress":
                subCollectionName = "dress"           

        # GENDER
        if "women" in gender.lower():
            gender = "female"
        elif "woman" in gender.lower():
            gender = "female"
        elif "men" in gender.lower():
            gender = "male"
        elif "man" in gender.lower():
            gender = "male"

        # SIZES
        if "extra small" in itemSize.lower():
            itemSize = "XS"
        elif "small" in itemSize.lower():
            itemSize = "S"
        elif "s" in itemSize.lower():
            itemSize = "S"
        elif "m" in itemSize.lower():
            itemSize = "M"
        elif "medium" in itemSize.lower():
            itemSize = "M"                 
        elif "l" in itemSize.lower():
            itemSize = "L"
        elif "large" in itemSize.lower():
            itemSize = "L"
        elif "xl" in itemSize.lower():
            itemSize = "XL"
        elif "extra large" in itemSize.lower():
            itemSize = "XL"
        elif "xxl" in itemSize.lower():
            itemSize = "XXL"
        elif "extra extra large" in itemSize.lower():
            itemSize = "XXL"

        db = client[collectionName]
        cursor = db[subCollectionName].find({
            # "$or": [
            #         {"color": {"$regex": itemColor, "$options": "i"}},
            #         # {"size": itemSize}
            #         {"gender": {"$regex": gender, "$options": "i"}}
            # ]
            #"color": {"$in": [itemColor]}
            #"size": itemSize
            # "price": {
            #     "$lt": budget
            # }
            "color": {"$regex": "^" + itemColor, "$options": "i"},
            "gender": {"$regex": "^" + gender, "$options": "i"},
            "size": {"$regex": "^" + itemSize, "$options": "i"},
            # "price": {
            #      "$lt": budget
            # }
        })
        items = random.sample(list(cursor), k=5)
        # print(items)
    except Exception as e:
        print(e)
    return json.loads(dumps(items))


def saveReviewMongo(rating, comment, userEmail): 
    MONGODB = os.getenv("MONGO_URI")

    #Create a new client and connect to the server
    client = MongoClient(MONGODB, server_api=ServerApi('1'))
    review = None

    user = client['test']['users'].find_one({"email":userEmail})

    try:
        db = client['test']
        db['reviews'].insert_one({
            "user": user,
            "rating": rating,
            "comment": comment
        })
        review = db['reviews'].find().sort({"_id":-1}).limit(1)
    except Exception as e:
        print(e)
    return json.loads(dumps(review))

def getReviewsMongo ():
    MONGODB = os.getenv("MONGO_URI")
    client = MongoClient(MONGODB, server_api=ServerApi('1'))

    db = client['test']
    cursor = db['reviews'].find({})

    reviewlist = random.sample(list(cursor), k=4)

    return json.loads(dumps(reviewlist))

def resetAiMemory():
    global conversation_history
    conversation_history = []