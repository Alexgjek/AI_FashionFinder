from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import pymongo
import certifi

# MongoDB connection
client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())
db = client['DataClothes'] 

collection_top = db['top']
collection_Shorts = db['shorts']
collection_Hood = db['hoodie']
collection_dress = db['dress']
collection_Pants= db['pants']

options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

def scroll_page(duration_minutes):
    end_time = time.time() + duration_minutes * 60
    while time.time() < end_time:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

def scrape_saks_clothing_images():
    base_url = "https://www.saksfifthavenue.com/c/women-s-apparel"
    driver.get(base_url)
    scroll_page(1)  # Scroll for 1 minute
    
    # Find all product links
    product_links = driver.find_elements_by_css_selector('.quickview')
    for link in product_links:
        try:
            # Click on "Quick View" for each product to open the quick view modal
            link.click()
            # Wait until the quick view modal is visible
            WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.CSS_SELECTOR, '.saks-avenue-quickview-modal')))
         
            content = driver.page_source
            soup = BeautifulSoup(content, "html.parser")
            image_data = parse_image_data(soup)
            save_to_mongodb(image_data)
        except Exception as e:
            print(f"Error processing product: {e}")
        finally:
            # Close the quick view modal
            close_button = driver.find_element_by_css_selector('.saks-avenue-quickview-modal .close-button')
            close_button.click()

def parse_image_data(soup):
    base_url = "https://www.saksfifthavenue.com"
    results = []
    product_segment = soup.find('div', {'class': 'product-segment'})
    if product_segment:
        brand_tag = product_segment.find('a', {'class': 'adobelaunch__brand'})
        if brand_tag:
            brand = brand_tag.text.strip()
        else:
            brand = "Unknown"

        product_name = product_segment.find('div', {'class': 'product-name'}).text.strip()
        price = soup.find('span', {'class': 'formatted_sale_price'}).text.strip()

        color_tag = soup.find('span', {'class': 'attr-name'}, text='Color')
        if color_tag:
            color = color_tag.find_next('span', {'class': 'text2'}).text.strip()
        else:
            color = "Unknown"

        sizes_tag = soup.find('ul', {'class': 'radio-group-list size-attribute'})
        if sizes_tag:
            sizes = [size.text.strip() for size in sizes_tag.find_all('a')]
        else:
            sizes = []

        image_url = soup.find('div', {'class': 'primary-image'}).find('img')['src']

        clothing_type = product_name.split()[-1]

        results.append({'brand': brand, 'product_name': product_name, 'price': price,
                        'color': color, 'sizes': sizes, 'image_url': image_url, 'clothing_type': clothing_type})
    else:
        print("Product segment not found.")
    return results

def save_to_mongodb(image_data):
    try:
        if image_data:
            for data in image_data:
                if data['clothing_type'] in ['shirt', 'T-shirt', 'Shirt', 'T-Shirt', 'top', 'Top', 'Sweater', 'Crew']:
                    collection_top.insert_one(data)
                elif data['clothing_type'] == 'dress':
                    collection_dress.insert_one(data)
                elif data['clothing_type'] in ['hoodie', 'Hoodie']:
                    collection_Hood.insert_one(data)
                elif data['clothing_type'] in ['Sweatpants', 'Joggers', 'Leggings', 'Tights']:
                    collection_Pants.insert_one(data)
                elif data['clothing_type'] == 'pants':
                    collection_Pants.insert_one(data)
                elif data['clothing_type'] == 'Shorts':
                    collection_Shorts.insert_one(data)
            print(f'Inserted {len(image_data)} records into MongoDB')
        else:
            print('No data found')
    except Exception as e:
        print(f'An error occurred: {e}')

scrape_saks_clothing_images()

driver.quit()
