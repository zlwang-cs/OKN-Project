###################################################
# Name: Demographic Controller
# Description: This controller is for sending the
# demographic data payload to the frontend.
###################################################
from flask import request, jsonify
import json
from utils.draw import plot_demographic_analysis

def demographic_chart(data_model):
    # Parse the request body
    body = request.get_json()

    if not body:
        return jsonify({"error": "Request body is empty"}), 400

    # Get start and end dates from the request body
    start_date = body.get('start_date')
    end_date = body.get('end_date')
    census_block = body.get('census_block')
    filters = body.get('filters')
    demographic_feature = body.get('demographic_features')

    # Ensure census_block is a list
    if isinstance(census_block, str):
        try:
            census_block = json.loads(census_block)
        except json.JSONDecodeError as e:
            return jsonify({"error": f"Invalid census_block format: {str(e)}"}), 400

    # call plot_demographic_analysis function
    try:
        analysis_result = plot_demographic_analysis(data_model.data, census_blocks=census_block, start_date=start_date, end_date=end_date, demographic_feature=demographic_feature)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(analysis_result)
