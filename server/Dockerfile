FROM python:latest

# Install system dependencies for GDAL
RUN apt-get update && apt-get install -y libgdal-dev gdal-bin

# Set environment variables needed for GDAL
ENV GDAL_CONFIG=/usr/bin/gdal-config
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# copy the requirements file into the image
COPY ./requirements.txt /app/requirements.txt

# switch working directory
WORKDIR /app

# install the dependencies and packages in the requirements file
RUN pip install -r requirements.txt

# copy every content from the local file to the image
COPY . /app

# Expose the port the server will run on
EXPOSE 12345

# Start the server
CMD ["python3", "app.py"]