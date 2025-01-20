import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
from .models import CrimeData

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the Euclidean distance between two geographical points.
    """
    return ((lat2 - lat1) ** 2 + (lon2 - lon1) ** 2) ** 0.5


def train_and_save_model():
    queryset = CrimeData.objects.all()[:50]
    data = [
        {
            "longitude": crime.wkb_geometry.x,
            "latitude": crime.wkb_geometry.y,
            "occur_date": crime.occurdate,
            "violation": crime.primviolat,
        }
        for crime in queryset
    ]

    # Convert data to DataFrame
    crimes = pd.DataFrame(data)
    crimes['occur_date'] = pd.to_datetime(crimes['occur_date'])
    crimes['hour'] = crimes['occur_date'].dt.hour
    crimes['month'] = crimes['occur_date'].dt.month
    crimes['weekday'] = crimes['occur_date'].dt.weekday

    # Filter and preprocess
    crimes = crimes.dropna()
    class_counts = crimes['violation'].value_counts()
    common_classes = class_counts[class_counts >= 6].index
    crimes = crimes[crimes['violation'].isin(common_classes)]

    # Define features and target
    X = crimes[['longitude', 'latitude', 'hour', 'month', 'weekday']]
    y = crimes['violation'].astype('category').cat.codes

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Train the model
    model = XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=5)
    model.fit(X_train, y_train)
    accuracy = accuracy_score(y_test, model.predict(X_test))

    # Save the model
    joblib.dump(model, 'crime_model_optimized.joblib')
    print(f"Model accuracy: {accuracy * 100:.2f}%")
    return accuracy


def predict_hotspots(features):
    # Load the saved model
    model = joblib.load('crime_model_optimized.joblib')

    # Predict classes
    predictions = model.predict(features)
    return predictions
