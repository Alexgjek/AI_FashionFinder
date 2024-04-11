from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import pymongo
import certifi
import math

# MongoDB connection
client = pymongo.MongoClient('mongodb+srv://oloofakalid:Mongo2024@cluster0.liexh8o.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())
db = client['DataClothes']
collection = db['collection']

options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)
def scrape_kohls():
    base_url = "https://www.kohls.com/"
    url = f"{base_url}search.jsp?search=women+clothing+with+color"
    driver.get(url)
    content = driver.page_source
    soup = BeautifulSoup(content, "html.parser")
    parse_product_data(soup, base_url)

def parse_product_data(soup, base_url):
    image_data = parse_image_data(soup, base_url)
    save_to_mongodb(image_data)

def parse_image_data(soup, base_url):
    results = []
    for item in soup.select('.products-container-left'):
        img_tag = item.select_one('.pmp-hero-img')
        price_info = item.select_one('.prod_price_amount')

        product_link_tag = item.select_one('.prod_img_block a')
        product_desc = product_link_tag.get('title', 'No description available') if product_link_tag else 'No description available'

        rating_tag = item.select_one('.prod_ratingImg a')
        review_count_tag = item.select_one('.prod_ratingCount a')

        price = price_info.text.strip() if price_info else 'N/A'

        rating = 'None'
        if rating_tag and 'stars-' in rating_tag.get('class', ''):
            rating_class = rating_tag.get('class', [])
            rating = rating_class[1] if len(rating_class) > 1 else 'None'

        review_count = 'None'
        if review_count_tag:
            review_count_text = review_count_tag.text.strip('()')
            review_count = review_count_text

        image_url = img_tag.get('data-herosrc') if img_tag else 'N/A'
        product_url = product_link_tag['href'] if product_link_tag else 'N/A'

        # Extracting color information
        color_data = []
        color_swatches = item.select('.prod_colorswatches .colorSwatch')
        for swatch in color_swatches:
            color_name = swatch.find('img')['title'] if swatch.find('img') else 'N/A'
            color_image_url = swatch.find('a')['rel'][0] if swatch.find('a') and swatch.find('a')['rel'] else 'N/A'
            color_swatch_url = swatch.find('img')['src'] if swatch.find('img') else 'N/A'

            color_data.append({
                'color_name': color_name,
                'color_image_url': base_url + color_image_url if color_image_url != 'N/A' else 'N/A',
                'color_swatch_url': base_url + color_swatch_url if color_swatch_url != 'N/A' else 'N/A',
            })

        # Extracting clothing type
        clothing_type = product_desc.split()[-1].strip()

        results.append({
            'image_url': image_url,
            'product_url': base_url + product_url,
            'price': price,
            'rating': rating,
            'reviews': review_count,
            'description': product_desc,
            'colors': color_data,
            'type': clothing_type  
        })

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


scrape_kohls()
driver.quit()
