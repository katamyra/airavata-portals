#!/bin/sh

# Replace env vars in JavaScript files
# echo "Replacing env vars in JS"
# for file in /usr/share/nginx/html/js/app.*.js;
# do
#   echo "Processing $file ...";

#   # Use the existing JS file as template
#   if [ ! -f $file.tmpl.js ]; then
#     cp $file $file.tmpl.js
#   fi

#   envsubst '$VUE_APP_CLIENT_ID,$VUE_APP_CLIENT_SEC,$VUE_APP_REDIRECT_URI,$VUE_APP_CUSTOS_API_URL,$VUE_APP_SUPER_CLIENT_ID$VUE_APP_UNDER_MAINTENANCE' < $file.tmpl.js > $file
# done

# TODO: run gunicorn in a separate docker container
echo "Starting Gunicorn in background"
gunicorn -b unix:/tmp/gunicorn.sock --daemon airavata_custos_portal.wsgi

echo "Starting Nginx"
exec nginx -g 'daemon off;'
