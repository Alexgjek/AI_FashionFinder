from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

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





options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

def scrape_forever_21():
    base_url = "https://www.forever21.com"
    max_pages = 20
    for page in range(1, max_pages + 1):
        url = f"{base_url}/us/search?q=clothing&lang=en_US&page={page}"
        driver.get(url)
        content = driver.page_source
        soup = BeautifulSoup(content, "html.parser")
        image_data = parse_image_data(soup)
        save_to_mongodb(image_data)

def parse_image_data(soup):
    results = []
    brand_name = "Forever21"
    Gender = "Female"
    for item in soup.select('.product-tile'):
        img_tag = item.select_one('.product-tile__media img')
        if img_tag and 'src' in img_tag.attrs:
            image_url = img_tag['src']
            if image_url.startswith("https://www.forever21.com/dw/image"):
                product_url = item.find('a', class_='product-tile__anchor')['href']
                Type_Cloth = item.select_one('.product-tile__image')['alt']
                price_tag = item.select_one('span[itemprop="price"]')
                price = price_tag['content'] if price_tag else 'N/A'

                driver.get(product_url)
                color_element = driver.find_element(By.CSS_SELECTOR, '.product-attribute__selected-value')
                color = color_element.text.strip() if color_element else 'N/A'
                


                rating_element = driver.find_element(By.CSS_SELECTOR, '.product-common__rating') if driver.find_elements(By.CSS_SELECTOR, '.product-common__rating') else None
                if rating_element:
                    stars = rating_element.find_elements(By.CSS_SELECTOR, '.TTteaser__star')
                    full_stars = len(stars)
                    half_star = 0
                    for star in stars:
                        if 'icon--halfstar' in star.find_element(By.CSS_SELECTOR, 'use').get_attribute('xlink:href'):
                            half_star += 1
                    rating = full_stars + 0.5 * half_star
                else:
                    rating = 'N/A'
                
                reviews_elements = driver.find_elements(By.CSS_SELECTOR, '.TTteaser__read-reviews')

                if reviews_elements:
                    reviews_text = reviews_elements[0].text.split()[0]
                else:
                    reviews_text = 'N/A'




                results.append({'image_url': image_url, 'product_url': product_url,
                                'brand': brand_name,  'price': price,'rating': rating, 'review_count': reviews_text,'gender': Gender,
                                'color': color,'type': Type_Cloth,})
    return results



def save_to_mongodb(clothing_data):
    try:
        if clothing_data:
            for data in clothing_data:
                Type_Cloth = data['type'].split()[-1].lower()
                data['type'] = Type_Cloth
                if data['type'] in ['shirt', 'T-shirt', 'Shirt', 'T-Shirt','top', 'Top','Sweater','Crew']:
                    collection_top.insert_one(data)
                elif data['type'] == 'dress':
                    collection_dress.insert_one(data)
                elif data['type'] in ['hoodie', 'Hoodie']:
                    collection_Hood.insert_one(data)
                elif data['type'] in[' Sweatpants, Joggers', 'Leggings','Tights']:
                    collection_Sweats.insert_one(data)
                elif data['type'] == 'pants' :
                    collection_Pants.insert_one(data)
                elif data['type'] == 'Shorts':
                    collection_Shorts.insert_one(data)
            print(f'Inserted {len(clothing_data)} records into MongoDB')
        else:
            print('No data found')
    except Exception as e:
        print(f'An error occurred: {e}')


scrape_forever_21()

driver.quit()
