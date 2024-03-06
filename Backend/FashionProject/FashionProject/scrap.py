from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import pymongo
import certifi

# MongoDB connection
client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())
db = client['nk']
collection = db['clothing_images']

options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

def scrape_nike_clothing_images():
    base_url = "https://www.nike.com"
    max_pages = 10
    for page in range(1, max_pages+1):
        url = f"{base_url}/w?q=clothing&vst=clothing&page={page}"
        driver.get(url)
        content = driver.page_source
        soup = BeautifulSoup(content, "html.parser")
        image_data = parse_image_data(soup)
        save_to_mongodb(image_data)

def parse_image_data(soup):
    base_url = "https://www.nike.com"
    results = []
    for item in soup.select('.product-card__body'):
        img_tag = item.select_one('.product-card__hero-image')
        if img_tag:
            image_url = img_tag['src']
            if image_url.startswith("https://static.nike.com/a/images/"):
                product_name = item.select_one('.product-card__title').text.strip()
                product_url =  item.select_one('.product-card__link-overlay')['href']
                results.append({'image_url': image_url, 'product_name': product_name, 'product_url': product_url})
    return results

def save_to_mongodb(image_data):
    try:
        if image_data:
            for data in image_data:
                collection.insert_one(data)
            print(f'Inserted {len(image_data)} image data into MongoDB')
        else:
            print('No image data found')
    except Exception as e:
        print(f'An error occurred: {e}')

scrape_nike_clothing_images()

driver.quit()
