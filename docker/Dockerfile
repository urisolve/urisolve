FROM docker.pkg.github.com/txroot/urisolve/webappx64:base
LABEL maintainer="André Rocha - anr@isep.ipp.pt"

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
