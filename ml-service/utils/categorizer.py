# Rule-based categorizer (works without training data)
# We'll upgrade this to ML later

CATEGORY_RULES = {
    "Food & Beverage": [
        "starbucks", "mcdonalds", "zomato", "swiggy", "dominos", "pizza",
        "restaurant", "cafe", "coffee", "burger", "food", "eat", "lunch",
        "dinner", "breakfast", "hotel", "dhaba", "biryani", "sushi"
    ],
    "Shopping": [
        "amazon", "flipkart", "myntra", "ajio", "meesho", "nykaa", "shopping",
        "mall", "store", "market", "fashion", "clothes", "shoes", "dress"
    ],
    "Transport": [
        "uber", "ola", "rapido", "metro", "bus", "auto", "petrol", "fuel",
        "parking", "toll", "cab", "taxi", "train", "flight", "irctc"
    ],
    "Entertainment": [
        "netflix", "spotify", "prime", "hotstar", "youtube", "movie", "cinema",
        "pvr", "inox", "concert", "gaming", "steam", "playstation"
    ],
    "Subscriptions": [
        "subscription", "membership", "plan", "renewal", "annual", "monthly",
        "linkedin", "notion", "figma", "canva", "adobe", "microsoft"
    ],
    "Health & Fitness": [
        "gym", "fitness", "pharmacy", "medical", "doctor", "hospital", "medicine",
        "apollo", "1mg", "netmeds", "yoga", "cult", "healthify"
    ],
    "Rent & Utilities": [
        "rent", "electricity", "water", "gas", "wifi", "internet", "broadband",
        "maintenance", "society", "pg", "hostel"
    ],
    "Education": [
        "udemy", "coursera", "leetcode", "coding", "course", "book", "study",
        "tuition", "college", "university", "fees", "exam"
    ],
    "Travel": [
        "hotel", "resort", "airbnb", "booking", "makemytrip", "goibibo",
        "holiday", "trip", "travel", "tour", "vacation"
    ],
}

def categorize(title: str) -> str:
    title_lower = title.lower()
    for category, keywords in CATEGORY_RULES.items():
        for keyword in keywords:
            if keyword in title_lower:
                return category
    return "Other"