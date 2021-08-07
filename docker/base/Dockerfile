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

RUN apt-get install -y build-essential \
					   libssl-dev \
					   cmake \
					   libsqlite3-dev \
					   nlohmann-json-dev \
					   git \
					   apt-utils \
					   htop \
					   wget \
					   apache2 \
					   php7.4 \
					   php7.4-cli \
					   php7.4-common \
					   libapache2-mod-php7.4 \
					   php7.4-mysql \
					   curl



# Install Apache WebServer
RUN apt -y install apache2 -y --no-install-recommends

# Eclipse PAHO MQTT
RUN git clone https://github.com/eclipse/paho.mqtt.c.git
WORKDIR ./paho.mqtt.c
RUN make
RUN make install

# OpenCV
RUN apt install -y libopencv-dev python-opencv