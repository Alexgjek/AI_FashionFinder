from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import pymongo
import certifi

# MongoDB connection
client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())
db = client['clothing_data'] 
collection_Shorts = db['shorts']
collection_shirt = db['shirts']
collection_dress = db['dress']
collection_top = db['top']
collection_hoodie = db['hoodie']
collection_sweater = db['sweater']
collection_pants = db['pants']
collection_coat= db['jackets']


options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

def scrape_bloom():
    base_url = "https://www.bloomingdales.com/"
    max_pages = 2  

    for page in range(1, max_pages + 1):
    # stopped at page 7'''
       # url = f"{base_url}shop/search/Pageindex/8?keyword=clothing"
        url = f"{base_url}shop/mens/jeans-denim/Pageindex/11?id=10172"
        driver.get(url)
        
        content = driver.page_source
        soup = BeautifulSoup(content, "html.parser")
        image_data = parse_image_data(soup, base_url)
        save_to_mongodb(image_data)

def parse_image_data(soup, base_url):
    results = []
    for item in soup.select('.productThumbnail'):
        img_tag = item.select_one('.thumbnailImage')
        price_info = item.select_one('.tnPrice .regular.price-strike')  
        brand_name_tag = item.select_one('.brand.heavy') 
        rating_stars = item.select_one('.repeat-star-icon.rating')  
        review_count_tag = item.select_one('.productReviewsCount.small')  
        product_desc_link = item.select_one('.productDescLink')
        color_swatch = item.select_one('.swatch__image.lazy') 
        gender_tag = item.select_one('.badgeHeader.flexText')  
        brand_desc_tag = item.select_one('.brandSubDescription')  
        
        clothing_type = None
        if brand_desc_tag:
            clothing_type = brand_desc_tag.text.strip().split()[-1].strip()

        gender = 'None'
        if clothing_type and clothing_type.lower() in ['dress', 'blouse', 'top']:
            gender = 'Female'
        if gender_tag and 'WOMAN' in gender_tag.text.lower():
            gender = 'Female'
        
        color = 'N/A'
        if color_swatch:
            color = color_swatch.get('title', None)

        price = None
        if price_info:
            price_text = price_info.text.strip()
            price = price_text

        brand_name = None
        if brand_name_tag:
            brand_name = brand_name_tag.text.strip()

        rating = 'None'
        if rating_stars:
            rating_style = rating_stars.get('style', '')
            width_start = rating_style.find('width:') + len('width:')
            width_end = rating_style.find('%', width_start)
            width = rating_style[width_start:width_end].strip()
            rating = int(float(width) / 20) 

        review_count = 'None'
        if review_count_tag:
            review_count_text = review_count_tag.text.strip('()') 
            try:
                review_count = int(review_count_text)
            except ValueError:
                review_count = None 

        if img_tag and 'data-lazysrc' in img_tag.attrs:
            image_url = img_tag['data-lazysrc']
            if image_url.startswith("https://images.bloomingdalesassets.com/is/image/"):
                product_url = base_url + product_desc_link['href']
                
                results.append({
                    'image_url': image_url.split('?')[0],  
                    'product_url': product_url, 
                    'brand': brand_name,
                    'price': price,  
                    'rating': rating, 
                    'reviews': review_count,
                    'gender': gender,
                    'color': color, 
                    'type': clothing_type
                })
    return results

def save_to_mongodb(image_data):
    try:
        if image_data:
            for data in image_data:
                if data['type'] in ['shirt', 'T-shirt', 'Shirt', 'T-Shirt','top', 'Top','Sweater','Crew','Blouse','blouse']:
                    collection_top.insert_one(data)
                elif data['type'] in [ 'dress','Dress','Minidress']:
                    collection_dress.insert_one(data)
                elif data['type'] in ['hoodie', 'Hoodie']:
                    collection_hoodie.insert_one(data)
                elif data['type'] in ['pants','Pants', 'Jeans']:
                    collection_pants.insert_one(data)
                elif data['type'] in['Coat', 'Jacket', 'Hood','Parka']:
                    collection_coat.insert_one(data)
                elif data['type'] == 'Shorts':
                    collection_Shorts.insert_one(data)
            print(f'Inserted {len(image_data)} records into MongoDB')
        else:
            print('No data found')
    except Exception as e:
        print(f'An error occurred: {e}')

scrape_bloom()
driver.quit()
