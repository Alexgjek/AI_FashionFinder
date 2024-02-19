import requests
from bs4 import BeautifulSoup
import pymongo
import certifi

def scrape_clothing_photos():
    max_pages = 10
    page = 1
    clothing_photos = []
    base_url = "https://www.nike.com"
    while page <= max_pages:
        markup = requests.get(f'https://www.nike.com/w?q=clothing&vst=clothing&page={page}').text
        soup = BeautifulSoup(markup, 'html.parser')
        photos_on_page = False
        for item in soup.select('.product-card__body'):
            clothing_photo = {}
            img_tag = item.select_one('.product-card__hero-image')
            if img_tag:
                #getting product url 
                overlay_tag = item.select_one('.product-card__img-link-overlay')
                if overlay_tag:
                    clothing_photo['product_name'] = overlay_tag['aria-label']
                    clothing_photo['product_url'] = overlay_tag['href']

                clothing_photos.append(clothing_photo)
                photos_on_page = True
        
        if not photos_on_page:
            break
        
        print(f'Scraped page {page}')
        page += 1

    return clothing_photos

clothing_photos = scrape_clothing_photos()

client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())

db = client['xxdatabase']
collection = db['xxcollection']

try:
    collection.insert_many(clothing_photos)
    print(f'Inserted {len(clothing_photos)} clothing photos')
except Exception as e:
    print(f'An error occurred: {e}')
