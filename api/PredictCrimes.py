import os
from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse
from pyspark.sql import SparkSession
from pyspark.sql.functions import count
import json
from data.heatmapData import heatmapData2015, heatmapData2016, heatmapData2017, heatmapData2018, heatmapData2019, heatmapData2020, heatmapData2021, heatmapData2022, heatmapData2023



class PredictCrimes(Resource):
  def __init__(self):
        self.spark = SparkSession.builder.appName('BostonCrimeData').getOrCreate()
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('latlng', type=int, required=True)
        self.data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')

  def replace_null_with_average(self, intensities):
    intensities = [x for x in intensities if x is not None]
    avg = sum(intensities) / len(intensities) if intensities else None
    return [avg if x is None else x for x in intensities]

  def find_intensities(self, latitude, longitude):
    intensities = []
    years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]
    for year in years:
        global heatmapDataByYear
        if year == 2015:
            heatmapDataByYear = heatmapData2015
        elif year == 2016:
            heatmapDataByYear = heatmapData2016
        elif year == 2017:
            heatmapDataByYear = heatmapData2017
        elif year == 2018:
            heatmapDataByYear = heatmapData2018
        elif year == 2019:
            heatmapDataByYear = heatmapData2019
        elif year == 2020:
            heatmapDataByYear = heatmapData2020
        elif year == 2021:
            heatmapDataByYear = heatmapData2021
        elif year == 2022:
            heatmapDataByYear = heatmapData2022
        else:
            heatmapDataByYear = heatmapData2023  # set default value
      
        # find the intensity for the given latitude and longitude in the current year's data
        intensity = None
        for lat, lng, value in heatmapDataByYear:
            if lat == latitude and lng == longitude:
                intensity = value
                break
        intensities.append(intensity)

    return self.replace_null_with_average(intensities)

  def get(self):
    lat = round(float(request.args.get('lat')), 2)
    lng = round(float(request.args.get('lng')), 2)
    #Got these values from python notebook in data/Generating_heatmap_data.ipynb
    lat_max= 42.36
    lng_max= -71.06
    lat_min= 42.37
    lng_min= -71.12
    if not lat or not lng:
      return {'error': 'Co-ordinates not provided'}, 400
    # file_path = os.path.join(self.data_dir, f'heatmapData.py')
    # df = self.spark.read.csv(file_path, header=True, inferSchema=True)
    # total_count_of_year = df.count()
    # filtered_df = df.filter(df.MONTH==month).drop('OFFENSE_CODE', 'OFFENSE_CODE_GROUP', 'OCCURRED_ON_DATE', 'UCR_PART', 'Location')
    # total_count_of_the_month = filtered_df.count();
    # # crimeDetails = filtered_df.toJSON().collect();
    # crimeDetails = [json.loads(row) for row in filtered_df.toJSON().collect()]
    intensities_requested = self.find_intensities(lat, lng)
    intensities_max = self.find_intensities(lat_max, lng_max)
    intensities_min = self.find_intensities(lat_min, lng_min)

    return {
      'resultStatus': 'SUCCESS',
    #   'total_count_of_year': total_count_of_year,
    #   'total_count_of_the_month' : total_count_of_the_month,
    #   'crimeDetails' : crimeDetails
      'latitude-requested' : lat,
      'longitude-requested' : lng,
      'intensities_requested' : intensities_requested,
      'latitude-max' : lat_max,
      'longitude-max' : lng_max,
      'intensities_max' : intensities_max,
      'latitude-min' : lat_min,
      'longitude-min' : lng_min,
      'intensities_min' : intensities_min
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
