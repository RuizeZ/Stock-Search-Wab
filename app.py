from flask import Flask, jsonify
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

@app.route("/RedArrowDown.png")
def RedArrowDown():
    return app.send_static_file('RedArrowDown.png')

@app.route("/GreenArrowUp.png")
def GreenArrowUp():
    return app.send_static_file('GreenArrowUp.png')

@app.route("/company=<companyName>&try=<try_time>", methods=["GET"])
def company(companyName, try_time):
    print("company")
    companyName = companyName.upper()
    if try_time == '0':
        #check valid companyName
        company = finnhub_client.company_profile2(symbol=companyName)
        return jsonify(company)
    else:
        print("try_time != 0")
        #call APIs
        return_data = {}
        #info for tab2
        return_data["summary"] = finnhub_client.quote(companyName)
        print(return_data["summary"])
        return_data["recommendation"] = finnhub_client.recommendation_trends(companyName)
        #info for tab3
        TODAY = datetime.date.today()
        historical_data_startdate = TODAY + relativedelta(months=-6, days=-1)
        historical_data_startdate = int(time.mktime(historical_data_startdate.timetuple()))
        historical_data_enddate = int(time.mktime(TODAY.timetuple()))
        print(historical_data_startdate)
        print(historical_data_enddate)
        return_data["charts"] = finnhub_client.stock_candles(companyName, 'D', historical_data_startdate, historical_data_enddate)
        #info for tab4
        company_news_startdate = TODAY + relativedelta(days=-30)
        return_data["news"] = finnhub_client.company_news(companyName, _from=company_news_startdate, to=TODAY)
        return jsonify(return_data)