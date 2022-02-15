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
    document.getElementById("day2S").textContent = total_data["summary"]["summary"]["t"];
    document.getElementById("closingprice2S").textContent = total_data["summary"]["summary"]["pc"];
    document.getElementById("openingprice2S").textContent = total_data["summary"]["summary"]["o"];
    document.getElementById("highprice2S").textContent = total_data["summary"]["summary"]["h"];
    document.getElementById("lowprice2S").textContent = total_data["summary"]["summary"]["l"];
    document.getElementById("change2S").textContent = total_data["summary"]["summary"]["d"];
    document.getElementById("percent2S").textContent = total_data["summary"]["summary"]["dp"];
}
function getSummary(companyName) {
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            summary = JSON.parse(this.responseText);
            console.log('summary');
            console.log(summary);
            total_data['summary'] = summary;
            showSummary();
        }
    };
    httpRequest.open("GET", "/summary=" + companyName);
    httpRequest.send();
}
function getCharts(companyName) {
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            charts = JSON.parse(this.responseText);
            console.log('charts');
            console.log(charts);
            total_data['charts'] = charts;
        }
    };
    httpRequest.open("GET", "/charts=" + companyName);
    httpRequest.send();
}
function getNews(companyName) {
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            news = JSON.parse(this.responseText);
            console.log('news');
            console.log(news);
            total_data['news'] = news;
        }
    };
    httpRequest.open("GET", "/news=" + companyName);
    httpRequest.send();
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
                console.log('company');
                console.log(company);
                total_data['company'] = company;
                callAPI();
                showCompany();
            }
        }
    };
    httpRequest.open("GET", "/company=" + companyName);
    httpRequest.send();
}
function callAPI() {
    // companyName = document.getElementById("query").value;
    // getCompany(companyName);
    getSummary(companyName);
    getCharts(companyName);
    getNews(companyName);
}
const form = document.getElementById("query-form");
var total_data = {};
form.addEventListener("submit", function (event) {
    event.preventDefault();
    companyName = document.getElementById("query").value;
    getCompany(companyName);
});