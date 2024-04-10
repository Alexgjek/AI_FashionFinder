import re
from fastapi import FastAPI, Request
from openaiIntegration import generateResponse, searchMongo, saveReviewMongo, getReviewsMongo, resetAiMemory
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List,Optional

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.json_util import dumps
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class Prompt(BaseModel):
    prompt: str

class UserInfo(BaseModel):
    email: str
    firstName: str
    lastName: str
    brands: Optional[List[str]]
    budget: Optional[int]

class AIRequest(BaseModel):
    prompt: Prompt
    userInfo: UserInfo

@app.get("/")
def api_view(request: Request):
    # prompt = "what is your name?"
    # ai_response = generateResponse(prompt)
    # # Return AI response as JSON
    # return {'ai_response': ai_response}
    print("Default API")
    mongoResult = searchMongo (collectionName = "DataClothes", subCollectionName = "dress", itemColor= "pink", itemSize= "small", budget= "100", gender='female', brands='Nike')
    return {'ai_response': mongoResult} 

@app.post("/getAIResponse")
async def getAIResponse(request: Request):
    body = await request.json()

    try:
        prompt = Prompt.parse_obj({'prompt': body.get('prompt')})
        userInfo = UserInfo.parse_obj(body.get('userInfo'))

        aiResponse = generateResponse(prompt.prompt, userInfo.dict())

        return {"ai_response": aiResponse}
    except Exception as e:
        print("Error processing request:", e)
        return {"error": "An error occurred while processing the request"}
    

# api to get data from database based on the searchMango Function 
@app.post("/searchItems")
async def searchItems(request: Request):
    body = await request.json()
    print("searchItemss")
    try:
        attributes = body.get('attributes')
        userInfo = UserInfo.parse_obj(body.get('userInfo'))

        matches = searchMongo(collectionName = "DataClothes", subCollectionName = attributes['itemType'], itemColor= attributes['color'], itemSize= attributes['size'], budget= attributes['budget'], gender = attributes['gender'], brands= attributes['brand'])
        #matches = searchMongo(collectionName = "DataClothes", subCollectionName = "hoodie", itemColor= "", itemSize= "small", budget= userInfo.budget)
        # print(matches)
        return matches
    except Exception as e:
        print("Error processing request:", e)
        return {"error": "An error occurred while processing the request"}


# api to save reviews in database 
@app.post("/saveReview")
async def saveReview(request: Request):
    body = await request.json()
    try:
        userEmail = body.get('userEmail')
        rating = int(body.get('rating'))
        comment = body.get('comment')

        print("Save review " + str(body.get('rating')) + ", " + body.get('comment'))

        review = saveReviewMongo(rating=rating, comment=comment, userEmail=userEmail)
        return review
    except Exception as e:
        print("Error processing request:", e)
        return {"error": "An error occurred while processing the request"}
    
#api to get list of reviews from database 
@app.get("/getReviews")
async def getReviews(request: Request):
    reviews = getReviewsMongo()

    #print("test" + reviews)
    return {"reviews":reviews}
    

@app.get("/test")
async def test(request: Request):
    MONGODB = os.getenv("MONGO_URI")

    # #Create a new client and connect to the server
    client = MongoClient(MONGODB, server_api=ServerApi('1'))
    # user = client['test']['users'].find_one({"email":"angjelomana1@gmail.com"})
    # client['test']['reviews'].insert_one({
    #     "user": user,
    #     "rating": 4,
    #     "comment": "Test Comment"
    # })
    # return {"users":json.loads(dumps(user))}
    return {"message":"Test Working"}


@app.post("/resetAiMemory")  # Define a new route for resetting AI memory
async def reset_ai_memory():
    try:
        resetAiMemory()  # Call resetAiMemory function
        return {"message": "AI memory reset successfully"}
    except Exception as e:
        return {"error": "An error occurred while resetting AI memory"}
    
# api to get all prices from database and convert them into a float and store it in priceFloat
@app.get("/parsePrice")
async def test(request: Request):
    MONGODB = os.getenv("MONGO_URI")

    client = MongoClient(MONGODB, server_api=ServerApi('1'))
    dbName = 'DataClothes'
    collections = client[dbName].list_collection_names()

    for collection in collections:
        print('Fixing collection ' + collection)
        col = client[dbName][collection]
        for cursor in col.find():
            try:
                price = cursor["price"]
                col.update_one({
                    "_id": cursor["_id"]
                }, {
                    "$set": {
                        #"priceFloat": float(re.sub(r'.?', '', re.sub(r'[^0-9.-]+', '', price)))
                        "priceFloat": float(re.sub(r'[^0-9.-]+', '', price))
                    }
                })
            except Exception as e:
                print(e)
                return {"error": "An error occurred while updating prices"}
        print('Fixed collection ' + collection)
    
    return {"message":"ParsePrice API Working"}
