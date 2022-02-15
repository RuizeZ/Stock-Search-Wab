from flask import Flask, jsonify, request
import finnhub
from dateutil.relativedelta import *
import datetime
import time
finnhub_client = finnhub.Client(api_key="c823s8qad3i9d12p6hqg")
app = Flask(__name__)


@app.route("/")
def home():
    # print(finnhub_client.company_profile2(symbol='AAPL'))
    return app.send_static_file("index.html")


@app.route("/index.css")
def home_css():
    return app.send_static_file('index.css')


@app.route("/index.js")
def home_js():
    return app.send_static_file('index.js')


@app.route("/search-solid.svg")
def home_search():
    return app.send_static_file('search-solid.svg')


@app.route("/times-solid.svg")
def home_times():
    return app.send_static_file('times-solid.svg')


@app.route("/back.svg")
def home_back():
    return app.send_static_file('back.svg')


@app.route("/company=<companyName>", methods=["GET"])
def company(companyName):
    print("company")
    companyName = companyName.upper()
    company = finnhub_client.company_profile2(symbol=companyName)
    return jsonify(company)

@app.route("/summary=<companyName>", methods=["GET"])
def summary(companyName):
    print("summary")
    companyName = companyName.upper()
    print(companyName)
    summary = finnhub_client.quote(companyName)
    print(summary)
    recommendation = finnhub_client.recommendation_trends(companyName)
    return_data = {}
    return_data["summary"] = summary
    return_data["recommendation"] = recommendation
    return jsonify(return_data)

@app.route("/charts=<companyName>", methods=["GET"])
def charts(companyName):
    print("charts")
    companyName = companyName.upper()
    TODAY = datetime.date.today()
    historical_data_startdate = TODAY + relativedelta(months=-6, days=-1)
    historical_data_startdate = int(time.mktime(historical_data_startdate.timetuple()))
    historical_data_enddate = int(time.mktime(TODAY.timetuple()))
    historical_data = finnhub_client.stock_candles(companyName, 'D', historical_data_startdate, historical_data_enddate)
    return jsonify(historical_data)
@app.route("/news=<companyName>", methods=["GET"])
def news(companyName):
    print("news")
    companyName = companyName.upper()
    TODAY = datetime.date.today()
    company_news_startdate = TODAY + relativedelta(days=-30)
    company_news = finnhub_client.company_news(companyName, _from=company_news_startdate, to=TODAY)
    return jsonify(company_news)
