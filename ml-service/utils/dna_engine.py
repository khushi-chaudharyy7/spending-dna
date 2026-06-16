import pandas as pd
from datetime import datetime

def analyze_spending_dna(transactions: list) -> dict:
    if not transactions:
        return {"error": "No transactions provided"}

    df = pd.DataFrame(transactions)
    df['date'] = pd.to_datetime(df['date'])
    df['amount'] = pd.to_numeric(df['amount'])
    df = df[df['type'] == 'debit']

    if df.empty:
        return {"error": "No debit transactions found"}

    # --- Basic stats ---
    total_spent = df['amount'].sum()
    avg_transaction = df['amount'].mean()
    category_totals = df.groupby('category')['amount'].sum().to_dict()

    # --- Behavioral signals ---
    df['hour'] = df['date'].dt.hour
    df['dayofweek'] = df['date'].dt.dayofweek  # 0=Monday, 6=Sunday
    df['is_weekend'] = df['dayofweek'].isin([5, 6])
    df['is_late_night'] = df['hour'].between(22, 23) | df['hour'].between(0, 3)

    weekend_spend = df[df['is_weekend']]['amount'].sum()
    weekday_spend = df[~df['is_weekend']]['amount'].sum()
    late_night_spend = df[df['is_late_night']]['amount'].sum()

    weekend_ratio = weekend_spend / total_spent if total_spent > 0 else 0
    late_night_ratio = late_night_spend / total_spent if total_spent > 0 else 0

    # --- Top category ---
    top_category = max(category_totals, key=category_totals.get) if category_totals else "Unknown"
    top_category_ratio = category_totals.get(top_category, 0) / total_spent if total_spent > 0 else 0

    subscription_spend = category_totals.get("Subscriptions", 0)
    subscription_ratio = subscription_spend / total_spent if total_spent > 0 else 0

    # --- Spending spikes ---
    daily_spend = df.groupby(df['date'].dt.date)['amount'].sum()
    spike_threshold = daily_spend.mean() + 2 * daily_spend.std()
    spike_days = (daily_spend > spike_threshold).sum()

    # --- Personality classification ---
    personality = classify_personality(
        weekend_ratio, late_night_ratio,
        top_category_ratio, top_category,
        subscription_ratio, spike_days
    )

    # --- Health score ---
    health_score = calculate_health_score(
        weekend_ratio, late_night_ratio,
        subscription_ratio, spike_days, len(df)
    )

    # --- Insights ---
    insights = generate_insights(
        weekend_ratio, late_night_ratio,
        subscription_ratio, spike_days,
        category_totals, total_spent
    )

    return {
        "total_spent": float(round(total_spent, 2)),
        "avg_transaction": float(round(avg_transaction, 2)),
        "category_breakdown": {k: float(round(v, 2)) for k, v in category_totals.items()},
        "top_category": top_category,
        "weekend_spend_ratio": float(round(weekend_ratio * 100, 1)),
        "late_night_spend_ratio": float(round(late_night_ratio * 100, 1)),
        "spending_spikes": int(spike_days),
        "personality": personality,
        "health_score": int(health_score),
        "insights": insights
    }


def classify_personality(weekend_ratio, late_night_ratio, top_category_ratio, top_category, subscription_ratio, spike_days):
    if late_night_ratio > 0.2:
        return {
            "type": "Night Owl Spender",
            "emoji": "🦉",
            "description": "You make a significant portion of purchases late at night — often impulse-driven."
        }
    if weekend_ratio > 0.5:
        return {
            "type": "Weekend Overspender",
            "emoji": "🎉",
            "description": "Your spending spikes heavily on weekends. You tend to reward yourself after the work week."
        }
    if subscription_ratio > 0.25:
        return {
            "type": "Subscription Hoarder",
            "emoji": "📦",
            "description": "A large chunk of your money goes to recurring subscriptions — many possibly unused."
        }
    if spike_days > 3:
        return {
            "type": "Impulse Spender",
            "emoji": "⚡",
            "description": "You have frequent high-spend days suggesting impulsive purchasing behavior."
        }
    if top_category_ratio > 0.5:
        return {
            "type": "Lifestyle-Driven Buyer",
            "emoji": "✨",
            "description": f"More than half your spending goes to {top_category}. Your lifestyle defines your wallet."
        }
    return {
        "type": "Balanced Spender",
        "emoji": "⚖️",
        "description": "Your spending is fairly balanced across categories. You show good financial awareness."
    }


def calculate_health_score(weekend_ratio, late_night_ratio, subscription_ratio, spike_days, total_transactions):
    score = 100
    if weekend_ratio > 0.5: score -= 15
    elif weekend_ratio > 0.35: score -= 8
    if late_night_ratio > 0.2: score -= 20
    elif late_night_ratio > 0.1: score -= 10
    if subscription_ratio > 0.25: score -= 15
    elif subscription_ratio > 0.15: score -= 7
    if spike_days > 5: score -= 20
    elif spike_days > 2: score -= 10
    return max(0, min(100, score))


def generate_insights(weekend_ratio, late_night_ratio, subscription_ratio, spike_days, category_totals, total_spent):
    insights = []

    if weekend_ratio > 0.35:
        insights.append(f"Your spending increases {round(weekend_ratio * 100)}% during weekends — consider setting a weekend budget.")

    if late_night_ratio > 0.1:
        insights.append(f"{round(late_night_ratio * 100)}% of your spending happens late at night — these are often impulsive purchases.")

    if subscription_ratio > 0.15:
        insights.append(f"Subscriptions eat {round(subscription_ratio * 100)}% of your budget — audit them for unused services.")

    if spike_days > 2:
        insights.append(f"You had {spike_days} unusually high-spend days — review what triggered those.")

    top_cat = max(category_totals, key=category_totals.get) if category_totals else None
    if top_cat:
        pct = round(category_totals[top_cat] / total_spent * 100)
        insights.append(f"{top_cat} is your biggest expense at {pct}% of total spending.")

    if not insights:
        insights.append("Your spending looks healthy! Keep tracking to maintain good habits.")

    return insights