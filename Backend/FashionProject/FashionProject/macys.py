from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import pymongo
import certifi
import math


# MongoDB connection
client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())
db = client['DataClothes'] 


collection_Shorts = db['shorts']
collection_shirt = db['shirts']
collection_dress = db['dress']
collection_top = db['top']
collection_hoodie = db['hoodie']
collection_pants = db['pants']
collection_coat= db['jackets']


options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)



def scrape_macys():
    base_url = "https://www.macys.com/"
   
    max_pages = 1
    for page in range(1, max_pages+1):
        #shop/womens-clothing/womens-tops/Women_regular_size_t,Pageindex,Productsperpage/0%252C%20XS,10,120?id=255
        #shop/womens-clothing/womens-tops/Women_regular_size_t,Pageindex,Productsperpage/2%252C%20S%7C4%252C%20S,10,120?id=255
        #shop/womens-clothing/womens-tops/Women_regular_size_t,Pageindex,Productsperpage/6%252C%20M%7C8%252C%20M,10,120?id=255
        #shop/womens-clothing/womens-tops/Women_regular_size_t,Pageindex,Productsperpage/10%252C%20L%7C12%252C%20L,10,120?id=255
        #shop/womens-clothing/womens-tops/Women_regular_size_t,Pageindex,Productsperpage/14%252C%20XL%7C16%252C%20XL,10,120?id=255
        #shop/mens-clothing/mens-shirts/Men_regular_size_t,Pageindex,Productsperpage/XS,5,120?id=20626
        #shop/mens-clothing/mens-shirts/Men_regular_size_t,Pageindex,Productsperpage/S,10,120?id=20626
        #shop/mens-clothing/mens-shirts/Men_regular_size_t,Pageindex,Productsperpage/M,10,120?id=20626
        #shop/mens-clothing/mens-shirts/Men_regular_size_t,Pageindex,Productsperpage/L,10,120?id=20626
        #shop/mens-clothing/mens-shirts/Men_regular_size_t,Pageindex,Productsperpage/XL,10,120?id=20626
        #shop/mens-clothing/hoodies-for-men/Men_regular_size_t,Productsperpage/XS,120?id=25995
        #shop/mens-clothing/hoodies-for-men/Men_regular_size_t,Sweater_style,Pageindex,Productsperpage/S,Hoodie,6,120?id=25995
        #shop/mens-clothing/hoodies-for-men/Men_regular_size_t,Sweater_style,Pageindex,Productsperpage/M,Hoodie,3,120?id=25995
        #shop/mens-clothing/hoodies-for-men/Men_regular_size_t,Sweater_style,Pageindex,Productsperpage/L,Hoodie,4,120?id=25995"     
        #shop/mens-clothing/hoodies-for-men/Men_regular_size_t,Sweater_style,Pageindex,Productsperpage/XL,Hoodie,5,120?id=25995
        #shop/womens-clothing/hoodies-sweatshirts/Women_regular_size_t,Pageindex,Productsperpage/2%252C%20S,4,120?id=293359
        #shop/womens-clothing/hoodies-sweatshirts/Women_regular_size_t,Pageindex,Productsperpage/6%252C%20M%7C8%252C%20M,3,120?id=293359
        #shop/womens-clothing/hoodies-sweatshirts/Women_regular_size_t,Pageindex,Productsperpage/10%252C%20L%7C12%252C%20L,3,120?id=293359
        url = f"{base_url}"
        driver.get(url)
        content = driver.page_source
        soup = BeautifulSoup(content, "html.parser")
        image_data = parse_image_data(soup)
        save_to_mongodb(image_data)

def parse_image_data(soup):
    results = []
    for item in soup.select('.productThumbnail'):
        img_tag = item.select_one('.thumbnailImage')
        price_info = item.select_one(('.prices .regular') or ('.regular .originalOrRegularPriceOnSale' and '.priceLabel'))
        price_info2= item.select_one(('.prices .discount' and '.priceLabel .Sale'))
        rating_and_review = item.select_one('.stars')
        product_desc_link = item.select_one('.productDescLink')
        color_swatch = item.select('.colorSwatch div') 

        clothing_type = None
        aria_label = item.get('aria-label', '')
        if aria_label:
            clothing_type_parts = aria_label.split(", Created for Macy's")
            if len(clothing_type_parts) > 1:
                clothing_type = clothing_type_parts[0].split()[-1].strip()

        size = 'L'
        gender = 'Female'
        color = 'N/A'
        if color_swatch:
           color = [swatch.get('data-colorswatchfamily') for swatch in color_swatch if swatch.get('data-colorswatchfamily')]

        price = None
        if price_info:
            price_text = price_info.text.strip()
            price = price_text
        elif price_info2:
            price_text = price_info2.text.strip()
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
                            review_count = 'None'
                    else:
                        review_count = 'None'
                else:
                    rating = 'None'
                    review_count = 'None'
                results.append({
                    'image_url': image_url,
                    'product_url': product_url,
                    'brand': brand_name,
                    'price': price,
                    'rating': rating,
                    'reviews': review_count,
                    'gender': gender,
                    'color': color,
                    'type': clothing_type,
                    'size': size
                })
    return results


def save_to_mongodb(image_data):
    try:
        if image_data:
            for data in image_data:
                # Check if color is available
                if 'N/A' not in data['color']:
                    if data['type'] in ['shirt', 'T-shirt', 'Shirt', 'T-Shirt','top', 'Top','Sweater','Crew','Blouse','blouse','Tee','Tunic']:
                        collection_top.insert_one(data)
                    elif data['type'] in [ 'dress','Dress','Minidress', 'Gown']:
                        collection_dress.insert_one(data)
                    elif data['type'] in ['hoodie', 'Hoodie', 'Sweatshirt','sweatshirt']:
                        collection_hoodie.insert_one(data)
                    elif data['type'] in ['pants','Pants', 'Jeans', 'Jean','jeans', 'jean','pant','Pant']:
                        collection_pants.insert_one(data)
                    elif data['type'] in['Coat', 'Jacket', 'Hood','Parka']:
                        collection_coat.insert_one(data)
                    elif data['type'] == 'Shorts':
                        collection_Shorts.insert_one(data)
                else:
                    print(f"")
            print(f'Inserted {len(image_data)} records into MongoDB')
        else:
            print('No data found')
    except Exception as e:
        print(f'An error occurred: {e}')

scrape_macys()

driver.quit()
