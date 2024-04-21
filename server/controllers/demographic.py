###################################################
# Name: Demographic Controller
# Description: This controller is for sending the
# demographic data payload to the frontend.
###################################################
from flask import request, jsonify
from utils.draw import plot_demographic_analysis

def demographic_chart(data_model):
    # Parse the request body
    body = request.get_json()

    # Get the demographic feature from the request body
    demographic_feature = body.get('demographic_feature')

    # Get start and end dates from the request body
    start_date = body.get('start_date')
    end_date = body.get('end_date')
    census_block = body.get('census_block')

    # call plot_demographic_analysis function
    analysis_result = plot_demographic_analysis(data_model.data, demographic_feature, census_block=census_block, start_date=start_date, end_date=end_date)

    return jsonify(analysis_result)
