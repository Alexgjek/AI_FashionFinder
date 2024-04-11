from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import pymongo
import certifi

# MongoDB connection
client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())
db = client['clothing_Yoox']

collection = db['items']

options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

def scroll_page(duration_minutes):
    end_time = time.time() + duration_minutes * 60
    while time.time() < end_time:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

def scrape_yoox_clothing():
    base_url = "https://www.yoox.com"
    url = f"{base_url}/us/women/clothing/shoponline?page=2&dept%5B0%5D=clothingwomen&area=women"
    driver.get(url)
    scroll_page(1)  # Scroll for 1 minute
    content = driver.page_source
    soup = BeautifulSoup(content, "html.parser")
    item_data = parse_item_data(soup)
    save_to_mongodb(item_data)

def parse_item_data(soup):
    results = []
    for item in soup.find_all('article', class_='Hit_card__gkLk6'):
        image_tag = item.find('img', class_='HitImage_image-container__DlUe0').find('img')
        brand_tag = item.find('div', class_='HitInfos_brand')
        category_tag = item.find('div', class_='HitInfos_microCategory')
        price_tag = item.find('div', class_='HitPrices_price')
        sizes_tags = item.find_all('span', class_='HitSizes_size')
        colors_tags = item.find_all('span', class_='HitColors_color')

        if image_tag and brand_tag and category_tag and price_tag and sizes_tags and colors_tags:
            image_url = image_tag['src']
            brand = brand_tag.text.strip()
            category = category_tag.text.strip()
            price = price_tag.text.strip()

            sizes = [size.text.strip() for size in sizes_tags]
            colors = [color['title'] for color in colors_tags]

            item_data = {
                'image_url': image_url,
                'brand': brand,
                'category': category,
                'price': price,
                'sizes': sizes,
                'colors': colors
            }
            
            results.append(item_data)
        else:
            print("Some required tags are missing in the item card.")

    return results


def save_to_mongodb(item_data):
    try:
        if item_data:
            for data in item_data:
                collection.insert_one(data)
            print(f'Inserted {len(item_data)} records into MongoDB')
        else:
            print('No data found')
    except Exception as e:
        print(f'An error occurred: {e}')

scrape_yoox_clothing()

driver.quit()
