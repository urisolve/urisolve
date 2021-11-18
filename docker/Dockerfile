FROM debian:stretch
LABEL maintainer="André Rocha - anr@isep.ipp.pt"

# Update Repositories
RUN apt-get update -y
RUN apt-get upgrade -y

# General Libraries

RUN apt-get install -y apt-transport-https lsb-release ca-certificates wget
RUN wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
RUN echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list

RUN apt-get update -y

RUN apt-get install -y build-essential
RUN apt-get install -y libssl-dev
RUN apt-get install -y cmake
RUN apt-get install -y libsqlite3-dev
RUN apt-get install -y nlohmann-json-dev
RUN apt-get install -y git
RUN apt-get install -y apt-utils
RUN apt-get install -y htop
RUN apt-get install -y wget
RUN apt-get install -y apache2
RUN apt-get install -y php7.4
RUN apt-get install -y php7.4-cli
RUN apt-get install -y php7.4-common
RUN apt-get install -y libapache2-mod-php7.4
RUN apt-get install -y php7.4-mysql
RUN apt-get install -y curl

# Install Apache WebServer
RUN apt -y install apache2 -y --no-install-recommends

# Eclipse PAHO MQTT
RUN git clone https://github.com/eclipse/paho.mqtt.c.git
WORKDIR ./paho.mqtt.c
RUN make
RUN make install

# OpenCV
RUN apt install -y libopencv-dev python-opencv

# Copy DB
COPY ./db /data

# Copy html files
COPY /build /var/www/html

# Copy PHP config file
COPY php.ini /etc/php/7.4/apache2

# Copy Source Files
# COPY ./src /urisolve
# WORKDIR /build

# Compile urisolve program
# RUN g++ -o recon recon.cpp -lpaho-mqtt3c -lsqlite3 `pkg-config --cflags --libs opencv`

# Execute
CMD ./urisolve
CMD ["/usr/sbin/apachectl", "-D", "FOREGROUND"]
