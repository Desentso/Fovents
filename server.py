from flask import Flask, render_template, json, request, session, redirect, url_for
import sqlite3, os, marshal, stripe, requests, time, datetime, smtplib
from dateutil.parser import parse
from time import gmtime, strftime
from datetime import timedelta
from werkzeug import generate_password_hash, check_password_hash
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__)
app.secret_key = os.urandom(50)

stripe.api_key = ""
eventful_api_key = ""
phqApiKey = ""

eventBriteGategories = {'Music': '103', 'Family ': '115', 'Sports ': '108', 'Business ': '101', 'Seasonal ': '116', 'Science ': '102', 'Food ': '110', 'Government ': '112', 'Health ': '107', 'Other': '199', 'Performing ': '105', 'Religion ': '114', 'Hobbies ': '119', 'Charity ': '111', 'Home ': '117', 'Auto, Boat ': '118', 'Travel ': '109', 'Fashion ': '106', 'Community ': '113', 'Film, Media ': '104'}
eventBriteFormats = {'5': 'Festival or Fair', '12': 'Rally', '2': 'Seminar or Talk', '1': 'Conference', '17': 'Attraction', '4': 'Convention', '16': 'Tour', '13': 'Tournament', '18': 'Camp, Trip, or Retreat', '14': 'Game or Competition', '3': 'Tradeshow, Consumer Show, or Expo', '6': 'Concert or Performance', '15': 'Race or Endurance Event', '19': 'Appearance or Signing', '10': 'Meeting or Networking Event', '100': 'Other', '8': 'Dinner or Gala', '7': 'Screening', '9': 'Class, Training, or Workshop', '11': 'Party or Social Gathering'}
eventBriteFormatIds = {'community': '18,11,14,9,', 'festivals': '5,8', 'other': '17,100', 'performing-arts': '6,19', 'expos': '3,7', 'concerts': '6,19', 'conferences': '1,12,2,10,4', 'sports': '14,15,13,16', "all": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,100"}
eventBriteSubIds = {'3009': 'Indie', '3015': 'Reggae', '6002': 'Accessories', '12008': 'Military', '5006': 'Orchestra', '12002': 'Democratic Party', '4001': 'TV', '9004': 'Canoeing', '15006': 'Parents Association', '11002': 'Environment', '2999': 'Other', '19003': 'DIY', '19005': 'Knitting', '15007': 'Reunion', '2007': 'Robotics', '13006': 'Renaissance', '12005': 'Federal Government', '10004': 'Spirits', '15999': 'Other', '13009': 'Language', '13001': 'State', '2006': 'Social Media', '16002': 'Easter', '16005': 'Thanksgiving', '8018': 'Rugby', '3006': 'EDM / Electronic', '6003': 'Bridal', '3999': 'Other', '5014': 'Jewelry', '3012': 'Opera', '8007': 'Football', '1010': 'Career', '14001': 'Christianity', '7005': 'Yoga', '2002': 'Science', '8005': 'Obstacles', '10003': 'Food', '3003': 'Classical', '18002': 'Motorcycle/ATV', '12007': 'County/Municipal Government ', '5004': 'Dance', '1004': 'Educators', '3018': 'Top 40', '11001': 'Animal Welfare', '8014': 'Hockey', '11999': 'Other', '14002': 'Judaism', '7004': 'Spa', '11005': 'International Aid', '4003': 'Anime', '16007': 'Channukah', '10002': 'Wine', '3016': 'Religious/Spiritual', '13007': 'Heritage', '8009': 'Soccer', '3005': 'Cultural', '13008': 'Nationality', '5002': 'Musical', '3010': 'Latin', '7003': 'Medical', '8010': 'Golf', '8013': 'Swimming & Water Sports', '11004': 'Human Rights', '8006': 'Basketball', '8012': 'Tennis', '18001': 'Auto', '15008': 'Senior Citizen', '13004': 'LGBT', '12999': 'Other', '5003': 'Ballet', '4999': 'Other', '19004': 'Photography', '12004': 'Non-partisan', '14008': 'Mysticism and Occult', '5005': 'Opera', '1002': 'Finance', '8019': 'Yoga', '16999': 'Other', '7001': 'Personal health', '11008': 'Education', '13005': 'Medieval', '19001': 'Anime/Comics', '1008': 'Media', '7999': 'Other', '18003': 'Boat', '8016': 'Fighting & Martial Arts', '13002': 'County', '19007': 'Adult', '16008': 'Fall events', '5010': 'Comedy', '3011': 'Metal', '2003': 'Biotech', '13999': 'Other', '15003': 'Parenting', '16006': 'Christmas', '8008': 'Baseball', '5011': 'Sculpture', '18999': 'Other', '1011': 'Investment', '8011': 'Volleyball', '9002': 'Rafting', '4007': 'Comedy', '5012': 'Painting', '5999': 'Other', '12006': 'State Government', '8015': 'Motorsports', '2001': 'Medicine', '14007': 'Eastern Religion', '5008': 'Fine Art', '16009': 'New Years Eve', '4002': 'Film', '2005': 'Mobile', '14006': 'Sikhism', '11006': 'Poverty', '19006': 'Books', '4004': 'Gaming', '3004': 'Country', '3002': 'Blues & Jazz', '15001': 'Education', '8003': 'Cycling', '3017': 'Rock', '11007': 'Disaster Relief', '4006': 'Adult', '8001': 'Running', '8017': 'Snow Sports', '19008': 'Drawing & Painting', '6004': 'Beauty', '9001': 'Hiking', '19002': 'Gaming', '14003': 'Islam', '4005': 'Comics', '8021': 'Softball', '8020': 'Exercise', '9003': 'Kayaking', '9006': 'Travel', '8004': 'Mountain Biking', '1009': 'Design', '3013': 'Pop', '7002': 'Mental health', '9005': 'Climbing', '8002': 'Walking', '17001': 'Dating', '11003': 'Healthcare', '16003': 'Independence Day', '3008': 'Hip Hop / Rap', '17002': 'Pets & Animals', '14009': 'New Age', '16004': 'Halloween/Haunt', '12009': 'International Affairs', '5001': 'Theatre', '1005': 'Real Estate', '12003': 'Other Party', '19999': 'Other', '9999': 'Other', '1003': 'Environment & Sustainability', '17003': 'Home & Garden', '13010': 'Historic', '1006': 'Non Profit & NGOs', '5009': 'Literary Arts', '5013': 'Design', '1007': 'Sales & Marketing', '3007': 'Folk', '1001': 'Startups & Small Business', '8999': 'Other', '14005': 'Buddhism', '10999': 'Other', '5007': 'Craft', '15004': 'Baby', '13003': 'City/Town', '16001': 'St Patricks Day', '2004': 'High Tech', '3001': 'Alternative', '12010': 'National Security', '12001': 'Republican Party', '6999': 'Other', '10001': 'Beer', '6001': 'Fashion', '1999': 'Other', '3014': 'R&B', '14099': 'Other', '18004': 'Air', '17999': 'Other', '15002': 'Alumni', '14004': 'Mormonism', '15005': 'Children & Youth '}

timezones = {"America/Los_Angeles": 8, "America/Denver": 7,
             "America/Chicago": 6, "America/New_York": 5}

##conn.execute("CREATE TABLE USERS
##                (ID INTEGER PRIMARY KEY, NAME TEXT, USERNAME TEXT, PASSWORD TEXT,
##                 EMAIL TEXT, CUSTOMERID TEXT, SUBSCRIPTIONPAIDFORMONTHS INTEGER,
##                 ADDRESS TEXT, COUNTRY TEXT, CITY TEXT, POSTALCODE TEXT)")

##conn.execute("CREATE TABLE SAVEDEVENTS (ID INTEGER PRIMARY KEY, USERID INTEGER,
##             USERNAME TEXT, EVENTTITLE TEXT, EVENTDESC TEXT, EVENTDATE INTEGER,
##             EVENTLOCATION TEXT, EVENTCATEGORIES TEXT, EVENTRANK INTEGER, LAT FLOAT,
##             LONG FLOAT, EVENTLABELS TEXT)")

def connDB():
    
    conn = sqlite3.connect(r"dbconnstring")
    return conn

def checkUser(uname, pword):

    conn = connDB()
    
    cursor = conn.execute("SELECT username,password FROM USERS WHERE username=?",  (uname,))
    data = cursor.fetchall()
    conn.close()
    print(data)

    if not data:
        return False
    
    if check_password_hash(data[0][1], pword):

        session["user"] = data[0][0]

        return True
    else:

        return False

def getUserId(uname):
    
    conn = connDB()
    
    if session.get("user"):

        cursor = conn.execute("SELECT id FROM USERS WHERE username=?",  (uname,))
        data = cursor.fetchall()
        conn.close()

        if len(data[0]) > 1:
            return data[0][1]
        else:
            return None

def getUserName(id):
    
    conn = connDB()
    
    if session.get("user"):
        
        cursor = conn.execute("SELECT username FROM USERS WHERE id=?",  (id,))
        data = cursor.fetchall()
        conn.close()
        return data[0][0]

@app.route("/usernameavailable/username=<username>", methods=["GET"])
def usernameFree(username):

    conn = connDB()

    cursor = conn.execute("SELECT * FROM USERS WHERE username=?", (username,))
    data = cursor.fetchall()
    conn.close()
    if not data:
        return True
    else:
        return False
    
@app.route("/emailAvailable/email=<email>", methods=["GET"])
def emailFree(email):

    ##email = request.args.get("email")
    
    conn = connDB()

    cursor = conn.execute("SELECT * FROM USERS WHERE email=?", (email,))
    data = cursor.fetchall()
    conn.close()
    if not data:
        return "True"
    else:
        return "False"
    
@app.route("/")
def landing():
    return render_template("index.html")


@app.route("/login")
def login():

    if session.get("user"):
        return redirect("/app")
    else:
        return render_template("login.html")

@app.route("/logincheck", methods=["POST"])
def userLogin():

    _name = request.form['username']
    _password = request.form['password']

    print(_name)
    print(_password)
    ##return "Login denied"
    if checkUser(_name, _password):

        return "Success"##render_template("main.html")
    else:
        return "Login denied"

@app.route("/getUserData")
def getUserInSession():

    username = session["user"]
    print(username)
    userId = getUserId(username)
    
    conn = connDB()

    cursor = conn.execute("SELECT * FROM USERS WHERE username=?", (username,))
    
    values = cursor.fetchall()

    conn.close()
    
    labels = ["id", "name", "username", "password", "email", "customerId", "subPaid", "address", "country", "city", "postalCode"]

    print(values[0])
    
    data = {}
    
    for i in range(len(labels)):

        if i > len(values[0]):

            value = None
        else:

            value = values[0][i]
            
        if labels[i] != "password" and labels[i] != "customerId":
            
            data[labels[i]] = value
    
    print(data)
    data = json.dumps(data)
    
    return data

@app.route("/changepassword", methods=["POST"])
def changePassword():

    password = request.args.get("password")
    username = session["user"]

    password = generate_password_hash(password)
    
    conn = connDB()
    conn.execute("UPDATE USERS set password=? WHERE username=?", (password, username,))
    conn.commit()
    conn.close()
    
    return "success"

@app.route("/logout")
def logout():
    
    session.pop("user", None)
    return redirect("/")


@app.route("/register")
def register():
    
    return render_template("register.html")

@app.route("/newUser", methods=["POST"])
def newUser():
    
    token = request.form['stripeToken']
    name = request.form["name"]
    username = request.form["username"]
    password = request.form["password"]
    email = request.form["email"]
    sub = request.form["subscription"]
    address = request.form["address"]
    
    print(token, name, password, email, sub)

    customer = stripe.Customer.create(
        source=token,
        email=email
        )
    
    ##Save customer.id and other info to database
    if sub == "monthly":
        stripe.Subscription.create(
            customer=customer.id,
            plan="basic-monthly"
        )
    elif sub == "yearly":
        stripe.Subscription.create(
            customer=customer.id,
            plan="basic-yearly"
        )
        
    customerId = customer.id
    password = generate_password_hash(password)

    usernameFre = usernameFree(username)                       
    ##emailFre = emailFree(email)
    
    ##Check if username and/or email is available
    if usernameFre: ##and emailFre:
    
        conn = connDB()

        conn.execute("INSERT INTO USERS (ID,NAME,USERNAME,PASSWORD,CUSTOMERID,EMAIL,ADDRESS) \
VALUES (?,?,?,?,?,?,?)", (None, name, username, password, customerId, email,address))
        conn.commit()

        conn.close()
        
        session["user"] = username

        return render_template("main.html")
    else:

        return "usernameFree: " + str(usernameFre)## + ", emailFree: " + str(emailFre)

@app.route("/app")
def main():

    return render_template("main.html")

@app.route("/planned")
def planned():

    return render_template("planned.html")

@app.route("/account")
def account():

    return render_template("account.html")

@app.route("/support")
def support():

    return render_template("support.html")

@app.route("/getEvents", methods=["GET"])
def getEvents():

    startTime = time.time()
    ebTime = time.time()
    pHqTime = time.time()
    
    place = request.args.get("place")
    within = request.args.get("within")
    category = request.args.get("category")
    sdate = request.args.get("startdate")
    edate = request.args.get("enddate")
    
    data = getEventsNear(place, category, within, sdate, edate)

    ##print(category)
    
    jsonS = {}
    jsonS["events"] = data

    events = json.dumps(jsonS)

    print(time.time() - startTime)
    
    return events

def getEventsNear(address, category, within, sdate, edate):
    
    global eventBriteGategories
    global eventBriteFormats

    count = 0
    
    ##categoryId = eventBriteGategories[category]
    formatId = eventBriteFormatIds[category]
    
    sdate = sdate + "T00:00:00"
    edate = edate + "T23:59:59"

    ##print(sdate, edate)
    
    ebTime = time.time()
    
    eventBrite = "https://www.eventbriteapi.com/v3/events/search/?token=123&include_unavailable_events=on&expand=venue"

    if category == "all":
        eBQuery ="&sort_by=best&location.address=" + address + "&location.within=" + within + "mi&start_date.range_start=" + sdate + "&start_date.range_end=" + edate
    else:
        eBQuery = "&sort_by=best&formats=" + formatId + "&location.address=" + address + "&location.within=" + within + "mi&start_date.range_start=" + sdate + "&start_date.range_end=" + edate
    
    ##ebTime = time.time() - ebTime
    
    req = requests.get(eventBrite + eBQuery)

    print(eventBrite + eBQuery)
    events = []
    
    data = req.json()

    ebTime = time.time() - ebTime
    pHqTime = time.time()
    
    if "events" in data:
        
        lat = data["events"][0]["venue"]["address"]["latitude"]
        lng = data["events"][0]["venue"]["address"]["longitude"]
    else:
    
        res = requests.get(
            url="https://api.predicthq.com/v1/places/",
            headers={
              "Authorization": "Bearer " + phqApiKey,
              "Accept": "application/json"
            },
            params={
                "q": address,
                "limit": 1
        })
        
        location = res.json()
        
        if len(location["results"]) > 0:
            
            lat = str(location["results"][0]["location"][1])
            lng = str(location["results"][0]["location"][0])
        else:
            lat = ""
            lng = ""

    if category == "all":
        category1 = "concerts,sports,festivals,performing-arts,conferences,expos,community,other"
    else:
        category1 = category
        

    if lat != "" and lng != "":
        
        response = requests.get(
            url="https://api.predicthq.com/v1/events/",
            headers={
              "Authorization": "Bearer " + phqApiKey,
              "Accept": "application/json"
            },
            params={
                "within": within + "mi@" + lat + "," + lng,
                "category": category1,
                "active.gte": sdate,
                "active.lt": edate,
                "limit": 200
        })

        data1 = response.json()
        
        resultsArr = data1["results"]
        
        nxt = data1["next"]
        
        while nxt != None:

            resp = requests.get(
                url = nxt,
                headers={
                  "Authorization": "Bearer " + phqApiKey,
                  "Accept": "application/json"
                }
            )

            data2 = resp.json()
            resultsArr += data2["results"]

            nxt = data2["next"]    
            
        
        pHqTime = time.time() - pHqTime
        
        for e in resultsArr:

            event = {}
            
            event["lat"] = e["location"][1]
            event["long"] = e["location"][0]
            event["address"] = "address not available"

            evsDate = parse(e["start"][0:len(e["start"])-1])
            eveDate = parse(e["end"][0:len(e["start"])-1])

            if e["timezone"] in timezones:
                timezone = timezones[e["timezone"]]
            else:
                timezone = 0
            
            localSTime = evsDate - datetime.timedelta(hours=timezone)
            localETime = eveDate - datetime.timedelta(hours=timezone)

            event["start"] = localSTime
            event["end"] = localETime
            
            event["name"] = e["title"]
            event["capacity"] = 0
            event["description"] = e["description"]
            event["rank"] = e["rank"]
            event["category"] = e["category"]
            event["labels"] = e["labels"]
            event["id"] = count
            ##print(e["start"], e["end"])
            ##print(localSTime, localETime)

            count += 1
            
            events.append(event)
        
    
    if req.status_code == requests.codes.ok:
        
        data = req.json()
        
        for e in data["events"]:

            if e["capacity"] > 200 and e["online_event"] == False:
                
                event = {}
                
                event["lat"] = e["venue"]["address"]["latitude"]
                event["long"] = e["venue"]["address"]["longitude"]
                event["address"] = e["venue"]["address"]["localized_address_display"]
                
                event["name"] = e["name"]["text"]
                event["start"] = parse(e["start"]["local"])
                event["end"] = parse(e["end"]["local"])

                if e["format_id"] != None:
                    event["format"] = eventBriteFormats[e["format_id"]]
                else:
                    event["format"] = None
                    
                event["capacity"] = e["capacity"]
                event["description"] = e["description"]["text"]
                event["rank"] = 0
                
                labels = []
                
                if e["subcategory_id"] != None:
                    labels.append(eventBriteSubIds[e["subcategory_id"]])
                    
                event["labels"] = labels
                
                event["id"] = count

                count += 1
                
                events.append(event)


    print("phqTime",pHqTime)
    print("ebTime",ebTime)
    return events

@app.route("/saveevent", methods=["POST"])
def saveEvent():

    data = request.get_json(force=True)

    print(data)
    username = session["user"]
    print(username)
    userId = getUserId(username)

    data["start"] = parse(data["start"])

    epoch = datetime.datetime.utcfromtimestamp(0)
    
    data["start"] = (data["start"].replace(tzinfo=None) - epoch).total_seconds() * 1000.0

    print(data["start"])
        
    labels = ""
    for i in range(len(data["labels"])):

        labels += data["labels"][i]

        if i != (len(data["labels"]) - 1):
            labels += ","
    
    print(labels)
    
    conn = connDB()
     
    conn.execute("INSERT INTO SAVEDEVENTS VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                 (None, userId, username, data["name"], data["description"], data["start"],
                  data["address"], data["category"], data["rank"], data["lat"], data["long"],
                  labels,))

    conn.commit()
    conn.close()

    return "ok"

@app.route("/sendForm", methods=["POST"])
def sendForm():

    data = request.get_json(force=True)

    print(data)
    
    email = data["email"]
    name = data["name"]
    text = data["text"]

    msg = MIMEMultipart()
    
    msg["Subject"] = "Message From " + name
    msg["From"] = email
    msg["To"] = "email123"
    
    body = text

    msg.attach(MIMEText(body, "plain"))

    text = msg.as_string()
    
    gmail = smtplib.SMTP("smtp.gmail.com", 587)
    gmail.ehlo()
    gmail.starttls()
    gmail.login("email123", "password")
    gmail.sendmail(email, "email123", text)
    gmail.quit()

    return "ok"

@app.route("/getsavedevents", methods=["GET"])
def getSavedEvents():

    username = session["user"]

    conn = connDB()
    cursor = conn.execute("SELECT * FROM SAVEDEVENTS WHERE username=?", (username,))
    data = cursor.fetchall()

    print(data)

    retData = {"events": []}

    labels = ["id","userid", "username","title","description","date","address","category","rank",
              "lat","long","labels"]

    for i in range(len(data)):

        event = {}
        
        for e in range(len(data[i])):

            if labels[e] != "userid" and labels[e] != "username":
                event[labels[e]] = data[i][e]

        retData["events"].append(event)
            
    retData = json.dumps(retData)
    
    return retData
    
@app.route("/subscription")
def subscription():

    
    
    return render_template("sub.html")

@app.route("/swh", methods=["POST"])
def stripeWebHook():

    data = request.get_json()
    print(data)

    if data["type"] == "invoice.payment_succeeded":
        
        customerId = data["data"]["customer"]
        periodEnd = data["data"]["period"]["end"]
    
    return "abc", 200

@app.route("/cancelsub", methods=["POST"])
def cancelsubscription():

    if session.get("user"):
        
        username = session["user"]
        
        conn = connDB()

        cursor = conn.execute("SELECT customerid FROM USERS WHERE username=?", (username,))
        data = cursor.fetchall()
        
        customerId = data[0][0]
        
        customer = stripe.Customer.retrieve(customerId)
        
        subId = customer["subscriptions"]["data"][0]["id"]

        subscription = stripe.Subscription.retrieve(subId)
        subscription.delete(at_period_end=True)

        return "success"
    
if __name__ == '__main__':

    context = ("/ssl.crt", "/ssl.key")
    
    app.run(host='127.0.0.1', port=5000, ssl_context=context, threaded=True)
