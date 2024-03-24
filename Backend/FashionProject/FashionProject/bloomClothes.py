from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import pymongo
import certifi

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
collection_skirt= db['skirts']
collection_suit= db['suit']




options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

def scrape_bloom():
    base_url = "https://www.bloomingdales.com/"
    max_pages = 2  

    for page in range(1, max_pages + 1):
        #/shop/womens-apparel/designer-dresses/Rtw_clothing_size_t,Pageindex,Productsperpage/0%252C%20XS,20,120?id=21683"
        #shop/womens-apparel/designer-dresses/Rtw_clothing_size_t,Pageindex,Productsperpage/4%252C%20S%7C6%252C%20S,16,120?id=21683"
        #shop/womens-apparel/designer-dresses/Rtw_clothing_size_t,Pageindex,Productsperpage/10%252C%20M%7C8%252C%20M,16,120?id=21683"
        #shop/womens-apparel/designer-dresses/Rtw_clothing_size_t,Pageindex,Productsperpage/12%252C%20L%7C14%252C%20L,16,120?id=21683"
        #shop/womens-apparel/designer-dresses/Rtw_clothing_size_t,Pageindex,Productsperpage/16%252C%20XL,16,120?id=21683"
        #shop/womens-apparel/designer-dresses/Rtw_clothing_size_t,Pageindex,Productsperpage/18%252C%20XXL,4,120?id=21683
        #shop/womens-apparel/tops-tees/Rtw_clothing_size_t,Pageindex,Productsperpage/0%252C%20XS%7C2%252C%20XS,10,120?id=5619"
        #shop/womens-apparel/tops-tees/Rtw_clothing_size_t,Pageindex,Productsperpage/4%252C%20S%7C6%252C%20S,10,120?id=5619
        #shop/womens-apparel/tops-tees/Rtw_clothing_size_t,Pageindex,Productsperpage/10%252C%20M%7C8%252C%20M,10,120?id=5619"
        #shop/womens-apparel/tops-tees/Rtw_clothing_size_t,Pageindex,Productsperpage/12%252C%20L%7C14%252C%20L,10,120?id=5619"
        #shop/womens-apparel/tops-tees/Rtw_clothing_size_t,Pageindex,Productsperpage/16%252C%20XL,10,120?id=5619"   
        #shop/womens-apparel/tops-tees/Rtw_clothing_size_t,Pageindex,Productsperpage/18%252C%20XXL,5,120?id=5619"
        #shop/womens-apparel/coats-jackets/Rtw_clothing_size_t,Pageindex,Productsperpage/0%252C%20XS%7C2%252C%20XS,10,120?id=1001520"
        #shop/womens-apparel/coats-jackets/Rtw_clothing_size_t,Pageindex,Productsperpage/4%252C%20S%7C6%252C%20S,10,120?id=1001520"
        #shop/womens-apparel/coats-jackets/Rtw_clothing_size_t,Pageindex,Productsperpage/10%252C%20M%7C8%252C%20M,10,120?id=1001520
        #shop/womens-apparel/coats-jackets/Rtw_clothing_size_t,Pageindex,Productsperpage/12%252C%20L%7C14%252C%20L,10,120?id=1001520
        #shop/womens-apparel/coats-jackets/Rtw_clothing_size_t,Pageindex,Productsperpage/16%252C%20XL,6,120?id=1001520
        #shop/womens-apparel/coats-jackets/Rtw_clothing_size_t,Pageindex,Productsperpage/16%252C%20XL,6,120?id=1001520
        #shop/womens-apparel/shorts/Rtw_denim_regular_size_t,Pageindex,Productsperpage/26%252C%202%7C27%252C%204,3,120?id=19950
        #shop/womens-apparel/shorts/Rtw_denim_regular_size_t,Pageindex,Productsperpage/28%252C%206%7C29%252C%208,3,120?id=19950
        #shop/womens-apparel/shorts/Rtw_denim_regular_size_t,Pageindex,Productsperpage/30%252C%2010%7C31%252C%2012,3,120?id=19950"
        #shop/mens/shorts/Men_clothing_size_t,Pageindex,Productsperpage/29%252C%20S%7C30%252C%20S%7C31%252C%20S,2,120?id=11576
        #shop/mens/shorts/Men_clothing_size_t,Pageindex,Productsperpage/35%252C%20L%7C36%252C%20L%7C37%252C%20L,2,120?id=11576
        #shop/mens/shorts/Men_clothing_size_t,Pageindex,Productsperpage/38%252C%20XL%7C40%252C%20XL,2,120?id=11576
        #shop/mens/jeans-denim/Men_clothing_size_t,Pageindex,Productsperpage/29%252C%20S%7C30%252C%20S%7C31%252C%20S,5,120?id=10172
        #shop/mens/jeans-denim/Men_clothing_size_t,Pageindex,Productsperpage/32%252C%20M%7C33%252C%20M%7C34%252C%20M,5,120?id=10172
        #shop/mens/jeans-denim/Men_clothing_size_t,Pageindex,Productsperpage/35%252C%20L%7C36%252C%20L,5,120?id=10172"
        #shop/mens/jeans-denim/Men_clothing_size_t,Pageindex,Productsperpage/38%252C%20XL%7C40%252C%20XL,5,120?id=10172
        #shop/womens-apparel/jeans/Rtw_denim_regular_size_t,Pageindex,Productsperpage/26%252C%202%7C27%252C%204,5,120?id=5545
        #shop/womens-apparel/jeans/Rtw_denim_regular_size_t,Pageindex,Productsperpage/28%252C%206%7C29%252C%208,5,120?id=5545
        #shop/womens-apparel/jeans/Rtw_denim_regular_size_t,Pageindex,Productsperpage/30%252C%2010%7C31%252C%2012,5,120?id=5545
        #shop/womens-apparel/jeans/Rtw_denim_regular_size_t,Pageindex,Productsperpage/32%252C%2014%7C33%252C%2016,5,120?id=5545"
        #shop/mens/coats-jackets/Men_tops_and_jackets_t,Pageindex,Productsperpage/XS,2,120?id=11548
        #shop/mens/coats-jackets/Men_tops_and_jackets_t,Pageindex,Productsperpage/S,8,120?id=11548
        #shop/mens/coats-jackets/Men_tops_and_jackets_t,Pageindex,Productsperpage/M,6,120?id=11548
        #shop/mens/coats-jackets/Men_tops_and_jackets_t,Pageindex,Productsperpage/L,6,120?id=11548
        #shop/mens/coats-jackets/Men_tops_and_jackets_t,Pageindex,Productsperpage/XL,5,120?id=11548
        #shop/womens-apparel/skirts/Rtw_denim_regular_size_t,Pageindex,Productsperpage/22%252C%2000%7C23%252C%2000%7C24%252C%2000%7C25%252C%200,5,120?id=19951
        #shop/womens-apparel/skirts/Rtw_denim_regular_size_t,Pageindex,Productsperpage/26%252C%202%7C27%252C%204,5,120?id=19951
        #shop/womens-apparel/skirts/Rtw_denim_regular_size_t,Pageindex,Productsperpage/28%252C%206%7C29%252C%208,5,120?id=19951
        #shop/womens-apparel/skirts/Rtw_denim_regular_size_t,Pageindex,Productsperpage/30%252C%2010%7C31%252C%2012,5,120?id=19951
        #shop/womens-apparel/skirts/Rtw_denim_regular_size_t,Pageindex,Productsperpage/32%252C%2014%7C33%252C%2016,3,120?id=19951
        #shop/womens-apparel/skirts/Rtw_denim_regular_size_t,Pageindex,Productsperpage/32%252C%2014%7C33%252C%2016,3,120?id=19951"
        url = f"{base_url}"
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
        price_info2 = item.select_one('.tnPrice .regular.heavy') or ('.tnPrice .regular.heavy')    
        brand_name_tag = item.select_one('.brand.heavy') 
        rating_stars = item.select_one('.repeat-star-icon.rating')  
        review_count_tag = item.select_one('.productReviewsCount.small')  
        product_desc_link = item.select_one('.productDescLink')
        color_swatch = item.select('.colorSwatches li[role="radio"]')  
        gender_tag = item.select_one('.badgeHeader.flexText')  
        brand_desc_tag = item.select_one('.brandSubDescription')  
        
        clothing_type = None
        if brand_desc_tag:
            clothing_type = brand_desc_tag.text.strip().split()[-1].strip()

        size='S'
        gender='Male'
        color = 'N/A'
        if color_swatch:
            color = [li.get('aria-label', 'N/A') for li in color_swatch]

      

        price = None
        if price_info:
            price_text = price_info.text.strip()
            price = price_text
        elif price_info2:
            price_text = price_info2.text.strip()
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
                    elif data['type'] in ['hoodie', 'Hoodie']:
                        collection_hoodie.insert_one(data)
                    elif data['type'] in ['pants','Pants', 'Jeans']:
                        collection_pants.insert_one(data)
                    elif data['type'] in['Coat', 'Jacket', 'Hood','Parka']:
                        collection_coat.insert_one(data)
                    elif data['type'] == 'Skirt':
                        collection_skirt.insert_one(data) 
                    elif data['type'] == 'Suit':
                        collection_suit.insert_one(data)    
                    elif data['type'] == 'Shorts':
                        collection_Shorts.insert_one(data)
                else:
                    print(f"")
            print(f'Inserted {len(image_data)} records into MongoDB')
        else:
            print('No data found')
    except Exception as e:
        print(f'An error occurred: {e}')

scrape_bloom()
driver.quit()
