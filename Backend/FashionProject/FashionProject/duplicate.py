import pymongo
import certifi

# Connect to the MongoDB 
client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/ClothingData?retryWrites=true&w=majority', tlsCAFile=certifi.where())

db = client.DataClothes
collection = db.dress

pipeline = [
    {
        "$group": {
            "_id": {
                "product_url": "$product_url",
                "size": "$size"
            },
            "dups": {"$addToSet": "$_id"},
            "count": {"$sum": 1}
        }
    },
    {
        "$match": {
            "count": {"$gt": 1}
        }
    }
]

cursor = collection.aggregate(pipeline)

for doc in cursor:
    # Get duplicate 
    duplicate_ids = doc["dups"][1:]
    # Delete duplicate documents
    collection.delete_many({"_id": {"$in": duplicate_ids}})
    print("Deleted duplicates:", duplicate_ids)
