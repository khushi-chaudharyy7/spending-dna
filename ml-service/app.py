from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from utils.categorizer import categorize
from utils.dna_engine import analyze_spending_dna
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify({'message': 'Spending DNA ML Service running'})

@app.route('/categorize', methods=['POST'])
def categorize_transaction():
    data = request.get_json()
    title = data.get('title', '')
    category = categorize(title)
    return jsonify({'category': category})

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    transactions = data.get('transactions', [])
    result = analyze_spending_dna(transactions)
    return jsonify(result)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)