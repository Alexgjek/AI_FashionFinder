import pymongo
import certifi

# Connect to the MongoDB
client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/ClothingData?retryWrites=true&w=majority', tlsCAFile=certifi.where())

db = client['DataClothes'] 

collection = db['dress']  

date_str = "3-27-2024"

# Update all documents to add the "date" field as a string
result = collection.update_many(
    {},  # An empty query object matches all documents in the collection
    {'$set': {'date': date_str}}
)

print(f"Documents modified: {result.modified_count}")
