###################################################
# Name: Line Controller
# Description: This controller is for sending the
# line payload to the frontend.
###################################################
from flask import request, jsonify
from utils.draw import plot_time_series

def line_chart(data_model):
    # Parse the request body
    body = request.get_json()

    # Get start and end dates from the request body
    start_date = body.get('start_date')
    end_date = body.get('end_date')
    census_block = body.get('census_block')
    print(start_date, end_date, census_block)

    # call plot_time_series function
    analysis_result = plot_time_series(data_model.data, start_date=start_date, census_block=census_block, end_date=end_date, interval="M")
    print(analysis_result)

    return jsonify(analysis_result)