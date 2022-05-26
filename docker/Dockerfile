FROM debian:stretch
LABEL maintainer="André Rocha - anr@isep.ipp.pt"

# Update Repositories
RUN apt-get update -y
RUN apt-get upgrade -y

# General Purpose Libraries
RUN apt-get install -y apt-transport-https
RUN apt-get install -y lsb-release
RUN apt-get install -y ca-certificates
RUN apt-get install -y wget
RUN wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
RUN echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list

RUN apt-get update -y

RUN apt-get install -y libssl-dev
RUN apt-get install -y apache2
RUN apt-get install -y php7.4
RUN apt-get install -y php7.4-cli
RUN apt-get install -y php7.4-common
RUN apt-get install -y libapache2-mod-php7.4
RUN apt-get install -y php7.4-mysql

# Remove default html files
RUN rm /var/www/html/index.html

# Copy PHP config file
COPY config/php.ini /etc/php/7.4/apache2

# Execute
CMD ["/usr/sbin/apachectl", "-D", "FOREGROUND"]