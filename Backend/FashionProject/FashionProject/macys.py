from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import pymongo
import certifi

# MongoDB connection
client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())
db = client['macys']
collection = db['test']

options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

def scrape_macys():
    base_url = "https://www.macys.com/shop/featured/clothing"
    max_pages = 5
    for page in range(1, max_pages+1):
        url = f"{base_url}/shop/featured/clothing&page={page}"
        driver.get(url)
        content = driver.page_source
        soup = BeautifulSoup(content, "html.parser")
        image_data = parse_image_data(soup)
        save_to_mongodb(image_data)

def parse_image_data(soup):
    the_url = "https://www.macys.com"
    results = []
    for item in soup.select('.productThumbnail'):
        img_tag = item.select_one('.thumbnailImage')
        if img_tag and 'data-lazysrc' in img_tag.attrs:
            image_url = img_tag['data-lazysrc']
            if image_url.startswith("https://slimages.macysassets.com/is/image/"):
                product_url = item.find('a', class_='productDescLink')['href']
                Brand_name = item.select_one('.productDescription').text.strip()# Extract product name
                results.append({'image_url': image_url, 'product_url': the_url + product_url, 'brand':  Brand_name })
    return results

def save_to_mongodb(image_data):
    try:
        if image_data:
            for data in image_data:
                collection.insert_one(data)
            print(f'Inserted {len(image_data)} records into MongoDB')
        else:
            print('No data found')
    except Exception as e:
        print(f'An error occurred: {e}')

scrape_macys()

driver.quit()
