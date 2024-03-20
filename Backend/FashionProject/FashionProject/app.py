from fastapi import FastAPI, Request
from openaiIntegration import generateResponse, searchMongo
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List,Optional

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
    mongoResult = searchMongo(collectionName = "ClothingData", subCollectionName = "dress", itemColor= "pink", itemSize= "small", budget= "100", gender='female')
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
    
    
@app.post("/searchItems")
async def searchItems(request: Request):
    body = await request.json()
    print("searchItemss")
    try:
        attributes = body.get('attributes')
        userInfo = UserInfo.parse_obj(body.get('userInfo'))

        matches = searchMongo(collectionName = "ClothingData", subCollectionName = attributes['itemType'], itemColor= attributes['color'], itemSize= attributes['size'], budget= userInfo.budget, gender = attributes['gender'])
        #matches = searchMongo(collectionName = "DataClothes", subCollectionName = "hoodie", itemColor= "", itemSize= "small", budget= userInfo.budget)
        print(matches)
        return matches
    except Exception as e:
        print("Error processing request:", e)
        return {"error": "An error occurred while processing the request"}
    
@app.get("/test")
async def searchItems(request: Request):
    return {"message":"Test Working"}