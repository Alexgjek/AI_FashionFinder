import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET(request) {
    // MongoDB connection URL
    const uri = "mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    // Database Name
    const dbName = 'DataClothes';

    let client;

    try {
        // Connect to MongoDB
        client = new MongoClient(uri);
        await client.connect();

        // Access the database
        const db = client.db(dbName);

        // Get a list of all collection names in the database
        const collectionNames = await db.listCollections().toArray();

        // Array to store unique brands
        let uniqueBrands = [];

        // Iterate through each collection
        for (let { name: collectionName } of collectionNames) {
        
            const collection = db.collection(collectionName);

        
            const query = { brand: { $exists: true } };

            // Retrieve distinct brands from the current collection
            const brandsFromCollection = await collection.distinct('brand', query);

            uniqueBrands = [...new Set([...uniqueBrands, ...brandsFromCollection])];
        }

        // Remove duplicates from the uniqueBrands array
        uniqueBrands = [...new Set(uniqueBrands)];

        return NextResponse.json({ brands: uniqueBrands });
    } catch (error) {
        console.error('Error retrieving brands:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (client) {
            await client.close();
        }
    }
}