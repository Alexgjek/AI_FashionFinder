from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import pymongo
import certifi

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

def scroll_page(duration_minutes):
    end_time = time.time() + duration_minutes * 60
    while time.time() < end_time:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)  

def scrape_nike_clothing_images():
    base_url = "https://www.nike.com"
    url = f"{base_url}/w/mens-clothing-6ymx6znik1"
    driver.get(url)
    scroll_page(5)  # Scroll for 5 minutes
    content = driver.page_source
    soup = BeautifulSoup(content, "html.parser")
    image_data = parse_image_data(soup)
    save_to_mongodb(image_data)

def parse_image_data(soup):
    base_url = "https://www.nike.com"
    results = []
    for item in soup.select('.product-card__body'):
        img_tag = item.select_one('.product-card__hero-image')
        product_name_tag = item.select_one('.product-card__title')
        product_url_tag = item.select_one('.product-card__link-overlay')
        price_tag = item.select_one('.product-price')
        gender_tag = item.select_one('.product-card__subtitle')
        clothing_type = item.select_one('img[alt]')
        color_tag = item.select_one('.product-card__product-count')

        # Check if all required tags are found
        if img_tag and product_name_tag and product_url_tag and price_tag and gender_tag and clothing_type and color_tag:
            image_url = img_tag['src']
            if image_url.startswith("https://static.nike.com/a/images/"):
                product_name = product_name_tag.text.strip()
                product_url = product_url_tag['href']
                price = price_tag.text.strip()

                gender_text = gender_tag.text.lower()
                if 'men' in gender_text or 'mens' in gender_text:
                    gender = 'Male'
                elif 'women' in gender_text or 'womens' in gender_text:
                    gender = 'Female'
                else:
                    gender = 'Unknown'
                
                types = clothing_type['alt'].split()[-1]
                color_text = color_tag.text.strip()
                color_count = int(''.join(filter(str.isdigit, color_text)))
                color = 'Available in ' + str(color_count) + ' Colors'

                results.append({'image_url': image_url, 'product_name': product_name, 'product_url': product_url,
                                'Brand': 'Nike', 'type': types, 'price': price, 'gender': gender, 'reviews': 'None',
                                'ratings': 'None', 'color': color})
        else:
            print("Some required tags are missing in the product card.")

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

scrape_nike_clothing_images()

driver.quit()
