from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import pymongo
import certifi

# MongoDB connection
client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())
db = client['forever21']
collection = db['clothes']

options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

def scrape_forever_21():
    base_url = "https://www.forever21.com"
    max_pages = 5
    for page in range(1, max_pages + 1):
        url = f"{base_url}/us/search?q=clothing&lang=en_US&page={page}"
        driver.get(url)
        content = driver.page_source
        soup = BeautifulSoup(content, "html.parser")
        image_data = parse_image_data(soup)
        save_to_mongodb(image_data)

def parse_image_data(soup):
    results = []
    for item in soup.select('.product-tile'):
        img_tag = item.select_one('.product-tile__media img')
        if img_tag and 'src' in img_tag.attrs:
            image_url = img_tag['src']
            if image_url.startswith("https://www.forever21.com/dw/image"):
                product_url = item.find('a', class_='product-tile__anchor')['href']
                brand_name = item.select_one('.product-tile__image')['alt']
                results.append({'image_url': image_url, 'product_url': product_url, 'brand': brand_name})
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

scrape_forever_21()

driver.quit()
