function convertTime(tab, time) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var date;
    if (tab.localeCompare("news") === 0) {
        date = new Date(time * 1000);
    } else {
        date = new Date(total_data["summary"]["t"] * 1000);
    }
    var year = date.getFullYear();
    var month = months[date.getMonth()];
    var dateNum = date.getDate();
    if (tab.localeCompare("summary") === 0 || tab.localeCompare("news") === 0) {
        return dateNum + ' ' + month + ', ' + year
    } else {
        return ' ' + year + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(dateNum).padStart(2, '0')
    }
}

function openTab(tabName) {
    tabContent = document.getElementsByClassName("tab_content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "inherit";
}
function showNews() {
    newsArr = total_data['news']
    checkArr = ["image", "url", "headline", "datetime"];
    newsIdArr = ["news1", "news2", "news3", "news4", "news5"];
    index = 0;
    count = 0;
    while (index < newsArr.length && count < 5) {
        currNews = newsArr[index];
        nextNews = false;
        for (check of checkArr) {
            if (!(check in currNews) || currNews[check].toString().length === 0) {
                nextNews = true;
                break;
            }
        }
        if (!nextNews) {
            document.getElementById(newsIdArr[count] + "_img").src = currNews["image"];
            document.getElementById(newsIdArr[count] + "_p").textContent = currNews["headline"];
            document.getElementById(newsIdArr[count] + "_time").textContent = convertTime("news", currNews["datetime"]);
            document.getElementById(newsIdArr[count] + "_a").href = currNews["url"];
            count++;
        }
        index++;
    }
}
function showCompany() {
    document.getElementById("company_img").src = total_data['company']["logo"];
    document.getElementById("name1S").textContent = total_data['company']["name"];
    document.getElementById("symbol1S").textContent = total_data['company']["ticker"];
    document.getElementById("code1S").textContent = total_data['company']["exchange"];
    document.getElementById("date1S").textContent = total_data['company']["ipo"];
    document.getElementById("category1S").textContent = total_data['company']["finnhubIndustry"];
}
function showSummary() {
    document.getElementById("symbol2S").textContent = total_data['company']["ticker"];
    document.getElementById("day2S").textContent = convertTime("summary", null);
    document.getElementById("closingprice2S").textContent = total_data["summary"]["pc"];
    document.getElementById("openingprice2S").textContent = total_data["summary"]["o"];
    document.getElementById("highprice2S").textContent = total_data["summary"]["h"];
    document.getElementById("lowprice2S").textContent = total_data["summary"]["l"];
    document.getElementById("change2S").textContent = total_data["summary"]["d"];
    if (total_data["summary"]["d"] < 0) {
        document.getElementById("change_img").src = "RedArrowDown.png";
    } else if (total_data["summary"]["d"] > 0) {
        document.getElementById("change_img").src = "GreenArrowUp.png";
    }
    document.getElementById("percent2S").textContent = total_data["summary"]["dp"];
    if (total_data["summary"]["dp"] < 0) {
        document.getElementById("change_percent").src = "RedArrowDown.png";
    } else if (total_data["summary"]["dp"] > 0) {
        document.getElementById("change_percent").src = "GreenArrowUp.png";
    }
    document.getElementById("recommendation1").textContent = total_data['recommendation'][0]["strongSell"];
    document.getElementById("recommendation2").textContent = total_data['recommendation'][0]["sell"];
    document.getElementById("recommendation3").textContent = total_data['recommendation'][0]["hold"];
    document.getElementById("recommendation4").textContent = total_data['recommendation'][0]["buy"];
    document.getElementById("recommendation5").textContent = total_data['recommendation'][0]["strongBuy"];
}
function getCompany(companyName) {
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            company = JSON.parse(this.responseText);
            if (Object.keys(company).length === 0) {
                document.getElementById("error-message").style.display = "inherit";
                document.getElementById("tab").style.display = "none";
            } else {
                document.getElementById("error-message").style.display = "none";
                document.getElementById("tab").style.display = "inherit";
                total_data['company'] = company;
                callAPI(companyName);
            }
        }
    };
    httpRequest.open("GET", "/company=" + companyName + "&try=0");
    httpRequest.send();
}
function callAPI(companyName) {
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            return_data = JSON.parse(this.responseText);
            console.log("data: ");
            total_data = Object.assign({}, return_data, total_data);
            console.log(total_data);
            showCompany();
            showSummary();
            createChart();
            showNews();
            openTab("company");
        }
    };
    httpRequest.open("GET", "/company=" + companyName + "&try=1");
    httpRequest.send();
}
const form = document.getElementById("query-form");
var total_data = {};
form.addEventListener("submit", function (event) {
    event.preventDefault();
    companyName = document.getElementById("query").value;
    total_data = {};
    getCompany(companyName);

});
usdtoeur = [1, 2, 3]
let chart; // globally available
function createChart() {
    date = total_data['charts']["t"];
    volume = total_data['charts']["v"];
    price = total_data['charts']["c"];
    volumeArr = [];
    priceArr = [];
    for (let i = 0; i < date.length; i++) {
        volumeArr.push([date[i] * 1000, volume[i]]);
        priceArr.push([date[i] * 1000, price[i]])
    }
    // create the chart
    Highcharts.stockChart('chart_container', {
        chart: {
            height: 600
        },
        title: {
            text: 'Stock Price' + ' ' + total_data['company']["ticker"] + convertTime('charts', null)
        },

        subtitle: {
            text: 'Source: finnhub'
        },
        yAxis: [{
            // tickAmount: 8,
            title: {
                text: 'Volume',
            },
            labels: {
                align: 'right'
            }
        }, {
            // tickAmount: 8,
            tickInterval: 50,
            title: {
                text: 'Stock Price',
            },
            labels: {
                align: 'left',
                format: '{value}',
            },
            opposite: false
        }],

        rangeSelector: {
            inputEnabled: false,
            buttons: [{
                type: 'day',
                count: 7,
                text: '7d',
            }, {
                type: 'day',
                count: 15,
                text: '15d'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'month',
                count: 3,
                text: '3m'
            }, {
                type: 'month',
                count: 6,
                text: '6m'
            }]
        },
        plotOptions: {
            series: {
                pointWidth: 3
            },
            areaspline: {
                threshold: null
            }
        },
        series: [
            {
                name: "Volume",
                data: volumeArr,
                type: 'area',
                threshold: null,
                tooltip: {
                    valueDecimals: 2
                },
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                }
            },
            {
                type: 'column',
                name: "Stock Price",
                yAxis: 1,
                data: priceArr
            }
        ]
    });
}