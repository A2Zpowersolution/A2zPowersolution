from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

cache = {
    "steam": {"data": [], "last_update": None},
    "epic": {"data": [], "last_update": None}
}

# --- Helper: Steam Scraper ---
def fetch_steam():
    url = "https://store.steampowered.com/search/?filter=topsellers&specials=1"
    soup = BeautifulSoup(requests.get(url, headers={"User-Agent": "Mozilla/5.0"}).text, "html.parser")
    games = []
    for item in soup.select(".search_result_row"):
        name = item.select_one(".title").get_text(strip=True)
        link = item.get("href").split("?")[0]
        discount_tag = item.select_one(".discount_pct")
        price_new = item.select_one(".discount_final_price")
        discount = int(discount_tag.get_text(strip=True).replace("-", "").replace("%", "")) if discount_tag else 0
        price_text = price_new.get_text(strip=True) if price_new else "Free"
        if "Free" in price_text or discount >= 90:
            games.append({
                "name": name,
                "price": price_text,
                "discount": discount,
                "link": link,
                "source": "steam"
            })
    return games

# --- Helper: Epic Scraper ---
def fetch_epic():
    url = "https://store.epicgames.com/en-US/free-games"
    soup = BeautifulSoup(requests.get(url, headers={"User-Agent": "Mozilla/5.0"}).text, "html.parser")
    games = []
    for card in soup.select("a[href*='/store/en-US/p/']"):
        name = card.select_one("span[data-testid='offer-title-info-title']").get_text(strip=True) if card.select_one("span[data-testid='offer-title-info-title']") else "Unknown Game"
        link = "https://store.epicgames.com" + card.get("href")
        price_el = card.select_one("span[data-testid='offer-original-price']")
        price_text = "Free" if "Free" in card.text else (price_el.get_text(strip=True) if price_el else "Unknown")
        discount = 100 if "Free" in price_text else 0
        if "Free" in price_text or discount >= 90:
            games.append({
                "name": name,
                "price": price_text,
                "discount": discount,
                "link": link,
                "source": "epic"
            })
    return games

# --- Cache Updater ---
def update_cache(source):
    now = datetime.utcnow()
    if cache[source]["last_update"] and (now - cache[source]["last_update"]) < timedelta(hours=6):
        return cache[source]["data"]
    if source == "steam":
        data = fetch_steam()
    else:
        data = fetch_epic()
    cache[source] = {"data": data, "last_update": now}
    return data

# --- API Endpoints ---
@app.route("/api/steam")
def steam_api():
    return jsonify(update_cache("steam"))

@app.route("/api/epic")
def epic_api():
    return jsonify(update_cache("epic"))

@app.route("/")
def index():
    return {
        "status": "OK",
        "message": "Use /api/steam or /api/epic to fetch data."
    }

if __name__ == "__main__":
    print("🚀 Server running on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000)
