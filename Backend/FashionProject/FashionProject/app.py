from fastapi import FastAPI, Request
from openaiIntegration import generateResponse
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

@app.post("/getAIResponse/")
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