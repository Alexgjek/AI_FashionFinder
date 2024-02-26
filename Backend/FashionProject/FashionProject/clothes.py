import requests
from bs4 import BeautifulSoup
import pymongo
import certifi

def scrape_clothing_photos():
    max_pages = 15
    page = 1
    clothing_photos = []
    base_url = "https://us.shein.com"
    while page <= max_pages:
        markup = requests.get(f'https://us.shein.com/pdsearch/clothing/?ici=s1`EditSearch`clothing`_fb`d0`PageHome&search_source=1&search_type=all&src_identifier=st%3D2%60sc%3Dclothing%60sr%3D0%60ps%3D1&src_module=search&src_tab_page_id=page_home1708891648762&page={page}').text
        soup = BeautifulSoup(markup, 'html.parser')
        photos_on_page = False
        for item in soup.select('.product-card__top-wrapper'):
            clothing_photo = {}
            img_tag = item.select_one('.S-product-card__img-container')
            if img_tag:
                # Extracting additional attributes like product name and URL
                overlay_tag = item.select_one('.S-product-card__img-container')
                if overlay_tag:
                    clothing_photo['product_name'] = overlay_tag['aria-label']
                    clothing_photo['product_url'] = base_url + overlay_tag['href']

                clothing_photos.append(clothing_photo)
                photos_on_page = True
        
        if not photos_on_page:
            break
        
        print(f'Scraped page {page}')
        page += 1

    return clothing_photos

clothing_photos = scrape_clothing_photos()

# Connect to MongoDB
client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())

# Access the database and collection
db = client['sheins']
collection = db['collection']

try:
    collection.insert_many(clothing_photos)
    print(f'Inserted {len(clothing_photos)} clothing photos')
except Exception as e:
    print(f'An error occurred: {e}')


