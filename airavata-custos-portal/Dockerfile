# build stage
FROM node:14 as build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY ./ .
RUN yarn run build

# production stage
FROM nginx:stable-alpine as production-stage

# Django server installation
RUN apk update && apk add python3 py3-pip
RUN mkdir /django
COPY requirements.txt /django/
RUN python3 -m pip install --upgrade pip setuptools wheel --no-cache
RUN python3 -m pip install -r /django/requirements.txt --no-cache
RUN mkdir /django/airavata_custos_portal
COPY --from=build-stage /app/airavata_custos_portal /django/airavata_custos_portal
COPY --from=build-stage /app/manage.py /django/
WORKDIR /django
ENV DJANGO_DEBUG=false
ENV DJANGO_STATIC_ROOT=/usr/share/nginx/html/static
RUN python3 manage.py migrate
RUN python3 manage.py collectstatic

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
EXPOSE 8080 443
ENTRYPOINT [ "/entrypoint.sh" ]
#CMD ["nginx", "-g", "daemon off;"]
