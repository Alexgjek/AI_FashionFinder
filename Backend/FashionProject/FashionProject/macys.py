from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import pymongo
import certifi
import math


# MongoDB connection
client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())
db = client['clothing_data'] 

collection_top = db['top']
collection_Shorts = db['shorts']
collection_Hood = db['hoodie']
collection_dress = db['dress']
collection_Sweats= db['sweats']
collection_Pants= db['pants']
collection_coat= db['jackets']



options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

def scrape_macys():
    base_url = "https://www.macys.com/"
    max_pages = 2
    for page in range(1, max_pages+1):
        # url = f"{base_url}shop/featured/clothing/shop/Featured,Pageindex/clothing%26page,19"
        url = f"{base_url}shop/mens-clothing/mens-dress-shirts/Pageindex,Productsperpage/3,120?id=20635"
        driver.get(url)
        content = driver.page_source
        soup = BeautifulSoup(content, "html.parser")
        image_data = parse_image_data(soup)
        save_to_mongodb(image_data)

def parse_image_data(soup):
    results = []
    for item in soup.select('.productThumbnail'):
        img_tag = item.select_one('.thumbnailImage')
        price_info = item.select_one('.prices .regular.originalOrRegularPriceOnSale')
        rating_and_review = item.select_one('.stars')
        product_desc_link = item.select_one('.productDescLink')
        color_swatch = item.select_one('[aria-label^="Color Swatch"]')

        
        clothing_type = None
        aria_label = item.get('aria-label', '')
        if aria_label:
            clothing_type_parts = aria_label.split(", Created for Macy's")
            if len(clothing_type_parts) > 1:
                clothing_type = clothing_type_parts[0].split()[-1].strip()  
        

        gender = None
        if product_desc_link:
            product_href = product_desc_link['href']
            if 'women' in product_href:
                gender = 'Female'
            elif 'men' in product_href:
                gender = 'Male'
            elif 'girls' in product_href:
                gender = 'Female'
            elif 'boys' in product_href:
                gender = 'Male'
            elif 'juniors' in product_href:
                gender = 'Female'
         
        color = None

        if color_swatch:
            color = color_swatch.get('aria-label', '').split('Color Swatch ')[1]
        price = None

        if price_info:
            price_text = price_info.text.strip()
            price = price_text

        if img_tag and 'data-lazysrc' in img_tag.attrs:
            image_url = img_tag['data-lazysrc']
            if image_url.startswith("https://slimages.macysassets.com/is/image/"):
                product_url = product_desc_link['href']
                product_desc = item.select_one('.productDescription')

                if product_desc:
                    brand_name = product_desc.text.strip().split('\n')[0]  
                if rating_and_review:
                    rating_text = rating_and_review.get('aria-label', '').split(' out of ')[0]
                    try:
                        rating = float(rating_text)
                        rating = math.floor(rating)  
                    except ValueError:
                        rating = None 
                    review_count_text = rating_and_review.select_one('.aggregateCount')
                    if review_count_text:
                        review_count_text = review_count_text.text.strip('()') 
                        try:
                            review_count = int(review_count_text)
                        except ValueError:
                            review_count = None 
                    else:
                        review_count = None
                else:
                    rating = None
                    review_count = None

                results.append({
                    'image_url': image_url, 
                    'product_url': product_url, 
                    'brand': brand_name,
                    'price': price,  
                    'rating': rating, 
                    'review_count': review_count,
                    'gender': gender,
                     'color': color, 
                     'type': clothing_type
                })
    return results


def save_to_mongodb(image_data):
    try:
        if image_data:
            for data in image_data:
                if data['type'] in ['shirt', 'T-shirt', 'Shirt', 'T-Shirt','top', 'Top','Sweater','Crew']:
                    collection_top.insert_one(data)
                elif data['type'] == 'dress':
                    collection_dress.insert_one(data)
                elif data['type'] in ['hoodie', 'Hoodie']:
                    collection_Hood.insert_one(data)
                elif data['type'] in[' Sweatpants, Joggers', 'Leggings','Tights']:
                    collection_Sweats.insert_one(data)
                elif data['type'] in ['pants','Pants', 'Jeans','Jean']:
                    collection_Pants.insert_one(data)
                elif data['type'] in['Coat', 'Jacket']:
                    collection_coat.insert_one(data)
                elif data['type'] == 'Shorts':
                    collection_Shorts.insert_one(data)
            print(f'Inserted {len(image_data)} records into MongoDB')
        else:
            print('No data found')
    except Exception as e:
        print(f'An error occurred: {e}')
scrape_macys()

driver.quit()
