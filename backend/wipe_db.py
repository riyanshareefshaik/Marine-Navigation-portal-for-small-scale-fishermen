from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os

async def wipe():
    client = AsyncIOMotorClient(os.getenv("MONGO_URL", "mongodb://localhost:27017"))
    db = client.marine_safety
    await db.locations.drop()
    print("Database collection 'locations' dropped. Next boot will fetch live data!")
    
asyncio.run(wipe())
