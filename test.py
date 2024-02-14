import os
import requests
from bs4 import BeautifulSoup
import urllib.parse
import time

base_url = "https://peraturan.go.id/uu"
page_limit = 3
output_folder = "uu"

# Create the output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

for page_number in range(1, page_limit + 1):
    url = f"{base_url}?page={page_number}"
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Failed to retrieve page {page_number}. Status code: {response.status_code}")
        continue

    soup = BeautifulSoup(response.content, 'html.parser')

    # Extract PDF links from the page
    pdf_links = [urllib.parse.urljoin(base_url, a['href']) for a in soup.find_all('a', href=True, target='_blank') if a.img and 'pdf' in a.img.get('src', '').lower()]

    # Download and save PDFs to the 'uu' folder
    for pdf_link in pdf_links:
        pdf_filename = os.path.join(output_folder, os.path.basename(pdf_link))
        print(f"Downloading {pdf_link} to {pdf_filename}")
        pdf_data = requests.get(pdf_link).content
        with open(pdf_filename, 'wb') as pdf_file:
            pdf_file.write(pdf_data)

    # Add a delay between requests to be considerate
    time.sleep(1)

print("Scraping completed.")
