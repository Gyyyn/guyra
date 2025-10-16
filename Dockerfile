FROM google/cloud-sdk:slim

# Install prerequisites
RUN apt-get update && apt-get install -y apt-transport-https lsb-release ca-certificates wget

# Add PHP repository
RUN wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
RUN echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list

# Install Nginx, PHP and extensions
RUN apt-get update && apt-get install -y \
    nginx \
    php8.2 \
    php8.2-cli \
    php8.2-fpm \
    php8.2-sqlite3 \
    php8.2-gd \
    php8.2-zip \
    php8.2-mbstring \
    php8.2-curl \
    php8.2-xml \
    php8.2-dev \
    php8.2-grpc \
    php8.2-protobuf \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set the working directory
WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy application files
COPY . .

# Set ownership of application files
RUN chown -R www-data:www-data /var/www/html

# Copy Nginx site configuration
COPY nginx.conf /etc/nginx/sites-available/default

# Copy the run script and make it executable
COPY run.sh /usr/local/bin/run.sh
RUN chmod +x /usr/local/bin/run.sh

# Expose the port and set the command
EXPOSE 8080
CMD ["run.sh"]
