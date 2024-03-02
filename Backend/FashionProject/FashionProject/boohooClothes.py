import requests
from bs4 import BeautifulSoup
import pymongo
import certifi

def scrape_clothing_photos():
    max_pages = 15
    page = 1
    clothing_photos = []
    base_url = "https://www.boohooman.com"
    while page <= max_pages:
        markup = requests.get(f'https://www.boohooman.com/us/search?q=clothes&_gl=1*nu2f7y*_up*MQ..&gclid=CjwKCAiAloavBhBOEiwAbtAJOwk9eyNC0F6cm1B8oc3cJZHnkr7wtP11jwnj2wr8KcHW4ZYqM51NVBoCsCcQAvD_BwE&gclsrc=aw.ds&page={page}').text
        soup = BeautifulSoup(markup, 'html.parser')
        photos_on_page = False
        for item in soup.select('.product-tile'):
            clothing_photo = {}
            
            product_name_tag = item.select_one('.name-link.js-canonical-link')
            if product_name_tag and product_name_tag.has_attr('title'):
                product_name = product_name_tag['title']

                product_name = product_name.replace('Go to Product: ', '')
                clothing_photo['product_name'] = product_name

            overlay_tag = item.select_one('.thumb-link')
            if overlay_tag and overlay_tag.has_attr('href'):
                clothing_photo['product_url'] = base_url + overlay_tag['href']

            if clothing_photo:
                clothing_photos.append(clothing_photo)
                photos_on_page = True
        
        if not photos_on_page:
            break
        
        print(f'Scraped page {page}')
        page += 1

    return clothing_photos

clothing_photos = scrape_clothing_photos()

client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())

db = client['boohoo']
collection = db['collection']

try:
    collection.insert_many(clothing_photos)
    print(f'Inserted {len(clothing_photos)} clothing photos')
except Exception as e:
    print(f'An error occurred: {e}')
