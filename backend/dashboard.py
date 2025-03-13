import dash
from dash import dcc, html, Input, Output
import plotly.express as px
import requests
import pandas as pd
import os

# ✅ Initialize Dash app
app = dash.Dash(__name__)

# ✅ Load dataset for visualization
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "telco.csv")
df = pd.read_csv(DATA_PATH)

# ✅ Churn distribution pie chart
churn_pie = px.pie(df, names="Churn Label", title="Customer Churn Distribution")

# ✅ Dashboard layout
app.layout = html.Div(children=[
    html.H1("Customer Churn Prediction Dashboard", style={"textAlign": "center"}),

    html.Div([
        html.H3("Churn Distribution"),
        dcc.Graph(figure=churn_pie),
    ], style={"width": "48%", "display": "inline-block"}),

    html.H3("Live Churn Prediction"),
    html.Button("Get Latest Prediction", id="update-button", n_clicks=0),
    html.Div(id="prediction-output", style={"fontSize": 24, "marginTop": 20}),
])


# ✅ Callback to update real-time prediction
@app.callback(
    Output("prediction-output", "children"),
    Input("update-button", "n_clicks"),
)
def update_prediction(n_clicks):
    if n_clicks > 0:
        try:
            response = requests.get("http://127.0.0.1:5000/predict")
            data = response.json()
            if "churn_prediction" in data:
                return f"Latest Prediction: {'Churn' if data['churn_prediction'] == 1 else 'No Churn'} (Probability: {data['churn_probability']}%)"
            else:
                return "No predictions yet. Submit data via the React frontend."
        except requests.exceptions.RequestException:
            return "❌ API not reachable. Ensure Flask is running."
    return "Click the button to fetch the latest prediction."


# ✅ Run the Dash dashboard
if __name__ == '__main__':
    app.run_server(debug=True, port=8051)



