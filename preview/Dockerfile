FROM nginx:1.27-alpine
COPY . /usr/share/nginx/html
# Minimal security headers (can be extended via nginx.conf)
RUN sed -i 's|try_files .*;|try_files $uri $uri/ =404;|g' /etc/nginx/conf.d/default.conf && \
    sed -i '/server_name _;/a \
        add_header X-Content-Type-Options nosniff;\n        add_header X-Frame-Options SAMEORIGIN;\n        add_header Referrer-Policy no-referrer-when-downgrade;\n        add_header Permissions-Policy geolocation=(), microphone=(), camera=();' /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]