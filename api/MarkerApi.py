import os
from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse
from pyspark.sql import SparkSession
from pyspark.sql.functions import count
import json


class MarkerApi(Resource):
  def __init__(self):
        self.spark = SparkSession.builder.appName('BostonCrimeData').getOrCreate()
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('year', type=int, required=True)
        self.data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')

  def get(self):
    year = request.args.get('year')
    month = request.args.get('month')
    if not year:
      return {'error': 'Year not provided'}, 400
    file_path = os.path.join(self.data_dir, f'{year}.csv')
    df = self.spark.read.csv(file_path, header=True, inferSchema=True)
    total_count_of_year = df.count()
    filtered_df = df.filter(df.MONTH==month).drop('OFFENSE_CODE', 'OFFENSE_CODE_GROUP', 'OCCURRED_ON_DATE', 'UCR_PART', 'Location')
    total_count_of_the_month = filtered_df.count();
    # crimeDetails = filtered_df.toJSON().collect();
    crimeDetails = [json.loads(row) for row in filtered_df.toJSON().collect()]
    return {
      'resultStatus': 'SUCCESS',
      'total_count_of_year': total_count_of_year,
      'total_count_of_the_month' : total_count_of_the_month,
      'crimeDetails' : crimeDetails
      }

  def post(self):
    print(self)
    parser = reqparse.RequestParser()
    parser.add_argument('type', type=str)
    parser.add_argument('message', type=str)

    args = parser.parse_args()

    print(args)
    # note, the post req from frontend needs to match the strings here (e.g. 'type and 'message')

    request_type = args['type']
    request_json = args['message']
    # ret_status, ret_msg = ReturnData(request_type, request_json)
    # currently just returning the req straight
    ret_status = request_type
    ret_msg = request_json

    if ret_msg:
      message = "Your Message Requested: {}".format(ret_msg)
    else:
      message = "No Msg"
    
    final_ret = {"status": "Success", "message": message}

    return final_ret
